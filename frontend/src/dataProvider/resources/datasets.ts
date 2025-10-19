import { GetManyReferenceParams } from "react-admin";
import {
  parseCatalogFromJsonLd,
  parseDatasetFromJsonLd,
} from "../transformers/catalogTransformers";
import { LocalCatalogService } from "../../services/localCatalogService";
import { buildQuerySpec, compactJsonLd } from "../helpers";

const frame = {
  "@context": {
    "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
    edc: "https://w3id.org/edc/v0.0.1/ns/",
    dct: "http://purl.org/dc/terms/",
    dcat: "http://www.w3.org/ns/dcat#",
    prov: "http://www.w3.org/ns/prov#",
    odrl: "http://www.w3.org/ns/odrl/2/",
    dqv: "http://www.w3.org/ns/dqv#",
    td: "https://www.w3.org/2019/wot/td#",
    dpv: "https://w3id.org/dpv#",
    schema: "http://schema.org/",
    owl: "http://www.w3.org/2002/07/owl#",
    dspace: "https://w3id.org/dspace/v0.8/",
  },
};

/**
 * Maps a filter key and value to a standardized filter object for querying datasets.
 *
 * @param key - The filter key (e.g., "title", "category").
 * @param value - The value to filter by.
 * @returns An object containing the mapped field, operator, and value for the filter.
 */
const filterMapping = (key: string, value: any) => {
  switch (key) {
    case "title":
      return {
        field: "http://purl.org/dc/terms/title",
        operator: "LIKE",
        value: `%${value}%`,
      };
    case "category":
      return {
        field:
          "'http://www.w3.org/ns/dcat#theme'.'http://purl.org/dc/terms/title'",
        operator: "=",
        value: `[{"@value":"${value}"}]`,
      };
    default:
      return { field: key, operator: "=", value };
  }
};

/**
 * Fetch datasets by catalog URL (counterparty address)
 * This is used with ReferenceManyField to display datasets for a catalog
 */
export async function getManyReference(params: GetManyReferenceParams) {
  try {
    const catalogUrl = params.id;

    const response = await fetch(`/api/management/v3/catalog/request`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        "@context": {
          "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
        },
        counterPartyAddress: catalogUrl,
        protocol: "dataspace-protocol-http",
        querySpec: buildQuerySpec(params, filterMapping),
      }),
    });

    const catalogData = await response.json();

    if (!response.ok) {
      throw new Error(
        catalogData.message || `HTTP error! status: ${response.status}`
      );
    }

    const framedCatalog = await compactJsonLd(catalogData, frame);
    const cleanCatalog = await parseCatalogFromJsonLd(
      framedCatalog,
      catalogUrl as string
    );

    LocalCatalogService.updateLastConnected(catalogUrl as string);

    const datasets = (cleanCatalog.datasets || []).map((dataset: any) => ({
      ...dataset,
      participantId: cleanCatalog.participantId,
    }));

    return {
      data: datasets,
      total: datasets.length,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to fetch datasets: ${errorMessage}`);
  }
}

// Helper function to get unique categories from datasets
export async function getCategories(catalogUrl: string): Promise<string[]> {
  try {
    const response = await fetch(`/api/management/v3/catalog/request`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        "@context": {
          "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
        },
        counterPartyAddress: catalogUrl,
        protocol: "dataspace-protocol-http",
      }),
    });

    const catalogData = await response.json();
    const cleanCatalog = await parseCatalogFromJsonLd(catalogData, catalogUrl);

    // Update last connected timestamp
    LocalCatalogService.updateLastConnected(catalogUrl);

    const datasets = cleanCatalog.datasets || [];

    const categories = new Set<string>();
    datasets.forEach((dataset: any) => {
      if (dataset.theme?.title) {
        categories.add(dataset.theme.title);
      }
    });

    return Array.from(categories).sort();
  } catch (error) {
    return [];
  }
}

// Note: getList returns empty array as datasets are only accessed via getManyReference
export async function getList() {
  return {
    data: [],
    total: 0,
  };
}

// getOne accepts composite ID: catalogId--datasetId
// where catalogId is base64(catalogUrl)
export async function getOne(params: any) {
  try {
    const [catalogId, datasetId] = params.id.split("--");

    if (!catalogId || !datasetId) {
      throw new Error(
        "Invalid dataset ID format. Expected format: catalogId--datasetId"
      );
    }

    const catalogUrl = atob(catalogId);

    // Fetch dataset from catalog
    const response = await fetch(`/api/management/v3/catalog/dataset/request`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        "@context": {
          "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
        },
        "@type": "DatasetRequest",
        "@id": datasetId,
        counterPartyAddress: catalogUrl,
        protocol: "dataspace-protocol-http",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const datasetData = await response.json();
    const framedDataset = await compactJsonLd(datasetData, frame);
    const cleanDataset = await parseDatasetFromJsonLd(framedDataset);

    // Add catalog metadata
    cleanDataset.catalogUrl = catalogUrl;
    cleanDataset.originalId = cleanDataset.id;
    cleanDataset.id = params.id; // Keep composite ID

    return {
      data: cleanDataset,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to fetch dataset: ${errorMessage}`);
  }
}

export async function getMany(params: any) {
  try {
    // Fetch multiple datasets by composite IDs: catalogId--datasetId
    const datasets = await Promise.all(
      params.ids.map(async (compositeId: string) => {
        const [catalogId, datasetId] = compositeId.split("--");

        if (!catalogId || !datasetId) {
          throw new Error(
            `Invalid dataset ID format: ${compositeId}. Expected format: catalogId--datasetId`
          );
        }

        // Decode catalog URL
        const catalogUrl = atob(catalogId);

        // Fetch dataset from catalog
        const response = await fetch(
          `/api/management/v3/catalog/dataset/request`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
              "@context": {
                "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
              },
              "@type": "DatasetRequest",
              "@id": datasetId,
              counterPartyAddress: catalogUrl,
              protocol: "dataspace-protocol-http",
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `HTTP error! status: ${response.status}`
          );
        }

        const datasetData = await response.json();
        const framedDataset = await compactJsonLd(datasetData, frame);
        const cleanDataset = await parseDatasetFromJsonLd(framedDataset);

        // Add catalog metadata
        cleanDataset.catalogUrl = catalogUrl;
        cleanDataset.originalId = cleanDataset.id;
        cleanDataset.id = compositeId; // Keep composite ID

        return cleanDataset;
      })
    );

    return {
      data: datasets,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to fetch datasets: ${errorMessage}`);
  }
}

export async function create() {
  throw new Error("Datasets create is not implemented.");
}

export async function update() {
  throw new Error("Datasets update is not implemented.");
}

export async function remove() {
  throw new Error("Datasets delete is not implemented.");
}
