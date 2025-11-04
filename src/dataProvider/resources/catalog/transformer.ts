import { Catalog, Dataset } from "../../../types/catalog";
import { stripUndefinedValues } from "../../shared/helpers";
import {
  extractCreator,
  extractDate,
  extractPrivacySettings,
  extractProvenance,
  extractQualityMeasurements,
  extractString,
  extractThingDescription,
} from "../../shared/transformerHelpers";
import { CatalogSchema, DatasetSchema } from "./schema";

export async function parseDatasetFromJsonLd(
  jsonLdDataset: any
): Promise<Dataset> {
  try {
    const parsed = DatasetSchema.parse(jsonLdDataset) as any;
    const { _rawThingDescription, _datasetResource, ...rest } = parsed;
    const thingDescription = await extractThingDescription(
      _rawThingDescription
    );

    const dataset: Dataset = {
      ...rest,
      thingDescription,
      creator: extractCreator(_datasetResource),
      created: extractDate(_datasetResource, "dct:created"),
      modified: extractDate(_datasetResource, "dct:modified"),
      version: extractString(_datasetResource, "dcat:version"),
      provenance: extractProvenance(_datasetResource),
      qualityMeasurements: extractQualityMeasurements(_datasetResource),
      privacySettings: extractPrivacySettings(_datasetResource),
      raw: jsonLdDataset,
    };

    return stripUndefinedValues(dataset);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to transform JSON-LD dataset: ${errorMessage}`);
  }
}

export async function parseDatasetFromJsonLdArray(
  jsonLdDatasets: any[]
): Promise<Dataset[]> {
  return Promise.all(
    jsonLdDatasets.map((dataset) => parseDatasetFromJsonLd(dataset))
  );
}

export async function parseCatalogFromJsonLd(
  jsonLdCatalog: any,
  catalogId: string
): Promise<Catalog> {
  try {
    const parsed = CatalogSchema.parse(jsonLdCatalog);

    const datasetsWithThingDescriptions = await Promise.all(
      (parsed["dcat:dataset"] || []).map(
        async (dataset: any, index: number) => {
          const { _rawThingDescription, _datasetResource, ...rest } = dataset;
          const thingDescription = await extractThingDescription(
            _rawThingDescription
          );
          return {
            ...rest,
            thingDescription,
            creator: extractCreator(_datasetResource),
            created: extractDate(_datasetResource, "dct:created"),
            modified: extractDate(_datasetResource, "dct:modified"),
            version: extractString(_datasetResource, "dcat:version"),
            provenance: extractProvenance(_datasetResource),
            qualityMeasurements: extractQualityMeasurements(_datasetResource),
            privacySettings: extractPrivacySettings(_datasetResource),
            raw: (parsed["dcat:dataset"] || [])[index],
          };
        }
      )
    );

    const catalog: Catalog = {
      id: catalogId,
      title: parsed["dct:title"],
      description: parsed["dct:description"],
      participantId: parsed["dspace:participantId"],
      datasets: datasetsWithThingDescriptions,
    };
    return stripUndefinedValues(catalog);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to transform JSON-LD catalog: ${errorMessage}`);
  }
}
