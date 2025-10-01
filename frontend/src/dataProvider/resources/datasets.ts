import { GetManyReferenceParams } from "react-admin";
import { parseCatalogFromJsonLd } from "../transformers/catalogTransformers";
import { LocalCatalogService } from "../../services/localCatalogService";

/**
 * Fetch datasets by catalog URL (counterparty address)
 * This is used with ReferenceManyField to display datasets for a catalog
 */
export async function getManyReference(params: GetManyReferenceParams) {
  try {
    // params.id is the catalog URL (from the source record)
    // params.target is the field name being referenced (should be catalog URL)
    const catalogUrl = params.id;
    const { page = 1, perPage = 10 } = params.pagination || {};
    const { q, title, description, category } = params.filter || {};

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

    if (!response.ok) {
      throw new Error(
        catalogData.message || `HTTP error! status: ${response.status}`
      );
    }

    // Transform JSON-LD catalog to clean Catalog object with normalized datasets
    const cleanCatalog = await parseCatalogFromJsonLd(
      catalogData,
      catalogUrl as string
    );

    // Update last connected timestamp
    LocalCatalogService.updateLastConnected(catalogUrl as string);

    let datasets = cleanCatalog.datasets || [];

    // Apply client-side filtering
    if (q) {
      const query = q.toLowerCase();
      datasets = datasets.filter(
        (dataset: any) =>
          dataset.title?.toLowerCase().includes(query) ||
          dataset.description?.toLowerCase().includes(query) ||
          dataset.id?.toLowerCase().includes(query)
      );
    }

    if (title) {
      const titleQuery = title.toLowerCase();
      datasets = datasets.filter((dataset: any) =>
        dataset.title?.toLowerCase().includes(titleQuery)
      );
    }

    if (description) {
      const descQuery = description.toLowerCase();
      datasets = datasets.filter((dataset: any) =>
        dataset.description?.toLowerCase().includes(descQuery)
      );
    }

    if (category) {
      datasets = datasets.filter(
        (dataset: any) => dataset.theme?.title === category
      );
    }

    // Calculate pagination
    const total = datasets.length;
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const paginatedDatasets = datasets.slice(start, end);

    // Return the datasets array from the catalog
    return {
      data: paginatedDatasets,
      total: total,
    };
  } catch (error) {
    console.error("Error fetching datasets:", error);
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
    console.error("Error fetching categories:", error);
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

export async function getOne() {
  throw new Error("Datasets getOne is not implemented.");
}

export async function getMany() {
  throw new Error("Datasets getMany is not implemented.");
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
