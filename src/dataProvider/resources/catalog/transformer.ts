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
  extractMultiLanguageString,
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

    const titlesMultiLang =
      extractMultiLanguageString(_datasetResource, "dct:title") ??
      extractMultiLanguageString(_datasetResource, "aas:Referable/displayName");

    const titleString =
      titlesMultiLang?.find((t) => t.language === "en")?.value ||
      titlesMultiLang?.[0]?.value ||
      extractString(_datasetResource, "aas:Identifiable/id") ||
      "";

    const abstractsMultiLang =
      extractMultiLanguageString(_datasetResource, "dct:abstract") ??
      extractMultiLanguageString(_datasetResource, "aas:Referable/description");

    const abstractString =
      abstractsMultiLang?.find((t) => t.language === "en")?.value ||
      abstractsMultiLang?.[0]?.value ||
      "";

    const dataset: Dataset = {
      ...rest,
      title: titleString,
      titles: titlesMultiLang,
      abstract: abstractString,
      abstracts: abstractsMultiLang,
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
          const titlesMultiLang =
            extractMultiLanguageString(_datasetResource, "dct:title") ??
            extractMultiLanguageString(
              _datasetResource,
              "aas:Referable/displayName"
            );

          const titleString =
            titlesMultiLang?.find((t) => t.language === "en")?.value ||
            titlesMultiLang?.[0]?.value ||
            extractString(_datasetResource, "aas:Identifiable/id") ||
            "";

          const abstractsMultiLang =
            extractMultiLanguageString(_datasetResource, "dct:abstract") ??
            extractMultiLanguageString(
              _datasetResource,
              "aas:Referable/description"
            );

          const abstractString =
            abstractsMultiLang?.find((t) => t.language === "en")?.value ||
            abstractsMultiLang?.[0]?.value ||
            "";

          return {
            ...rest,
            title: titleString,
            titles: titlesMultiLang,
            abstract: abstractString,
            abstracts: abstractsMultiLang,
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
