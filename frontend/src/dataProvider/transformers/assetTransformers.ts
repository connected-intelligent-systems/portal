import { z } from "zod";
import {
  Asset,
  AssetDataAddress,
  AssetFormData,
  AssetProvenance,
  AssetQualityMeasurement,
} from "../../types/asset";
import { removeUndefinedValues } from "../helpers";
import { extractString, normalizeStringArray } from "./helpers";

// --- Zod-based Transformation (Lifting) ---

const CoreAssetSchema = z
  .object({
    "@id": z.string(),
    properties: z.record(z.unknown()).optional(),
    dataAddress: z.record(z.unknown()).optional(),
  })
  .passthrough();

type CoreAsset = z.infer<typeof CoreAssetSchema>;

function extractCreator(data: CoreAsset) {
  const creator = data.properties?.["dct:creator"] as any;
  if (!creator) return undefined;

  // Handle both simple string and structured object formats
  const name = z.string().safeParse(creator["schema:name"]);
  const id = z.string().safeParse(creator["@id"]);

  if (name.success) {
    return {
      name: name.data,
      id: id.success ? id.data : undefined,
    };
  }
  return undefined;
}

function extractDate(data: CoreAsset, field: string): string | undefined {
  const dateValue = data.properties?.[field];
  if (!dateValue) return undefined;

  // Handle structured date format { "@value": "2025-01-01", "@type": "xsd:date" }
  if (typeof dateValue === "object" && dateValue["@value"]) {
    return dateValue["@value"];
  }

  // Handle simple string format
  if (typeof dateValue === "string") {
    return dateValue;
  }

  return undefined;
}

function extractProvenance(data: CoreAsset): AssetProvenance | undefined {
  const props = data.properties;
  if (!props) return undefined;

  const wasDerivedFrom = (props["prov:wasDerivedFrom"] as any)?.["@id"];
  const wasGeneratedBy = (props["prov:wasGeneratedBy"] as any)?.[
    "dct:description"
  ];
  const wasAttributedTo = (props["prov:wasAttributedTo"] as any)?.["@id"];

  if (!wasDerivedFrom && !wasGeneratedBy && !wasAttributedTo) {
    return undefined;
  }

  const derivedId = z.string().optional().safeParse(wasDerivedFrom);
  const generatedDesc = z.string().optional().safeParse(wasGeneratedBy);
  const attributedId = z.string().optional().safeParse(wasAttributedTo);

  return {
    derivedFromId: derivedId.success ? derivedId.data : undefined,
    generatedByDescription: generatedDesc.success
      ? generatedDesc.data
      : undefined,
    attributedToId: attributedId.success ? attributedId.data : undefined,
  };
}

function extractQualityMeasurements(
  data: CoreAsset
): AssetQualityMeasurement[] | undefined {
  const measurements = data.properties?.["dqv:hasQualityMeasurement"];
  if (!measurements) return undefined;

  const measurementSchema = z.object({
    "dqv:isMeasurementOf": z
      .object({
        "dct:title": z.string().optional(),
      })
      .optional(),
    "dqv:value": z.union([z.string(), z.number()]),
    "dqv:unit": z.string().optional(),
  });

  const measurementsArray = Array.isArray(measurements)
    ? measurements
    : [measurements];
  const parsedMeasurements = z
    .array(measurementSchema)
    .safeParse(measurementsArray);

  if (!parsedMeasurements.success) return undefined;

  return parsedMeasurements.data.map((m) => ({
    measurementOf: {
      title: m["dqv:isMeasurementOf"]?.["dct:title"] ?? "",
    },
    value: m["dqv:value"],
    unit: m["dqv:unit"],
  }));
}

export async function parseAssetFromJsonLd(jsonLdAsset: any): Promise<Asset> {
  try {
    const coreAsset = CoreAssetSchema.parse(jsonLdAsset);

    const asset: Asset = {
      id: coreAsset["@id"],
      title: extractString(coreAsset, "dct:title") ?? "",
      abstract: extractString(coreAsset, "dct:abstract") ?? "",
      description: extractString(coreAsset, "dct:description"),
      mediaType: extractString(coreAsset, "dcat:mediaType"),
      keywords: normalizeStringArray(coreAsset, "dcat:keyword"),
      theme: (coreAsset.properties?.["dcat:theme"] as any)?.["dct:title"]
        ? { title: (coreAsset.properties?.["dcat:theme"] as any)["dct:title"] }
        : undefined,
      dataAddress: coreAsset.dataAddress as AssetDataAddress | undefined,
      creator: extractCreator(coreAsset),
      created: extractDate(coreAsset, "dct:created"),
      modified: extractDate(coreAsset, "dct:modified"),
      version: extractString(coreAsset, "dcat:version"),
      provenance: extractProvenance(coreAsset),
      qualityMeasurements: extractQualityMeasurements(coreAsset),
    };

    return removeUndefinedValues(asset) as Asset;
  } catch (error) {
    console.error("Error in parseAssetFromJsonLd (Zod):", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to transform JSON-LD asset: ${errorMessage}`);
  }
}

// --- TypeScript-based Transformation (Lowering) ---

export async function serializeAssetToJsonLd(
  asset: AssetFormData
): Promise<any> {
  const properties: Record<string, any> = {
    "dct:title": asset.title,
    "dct:abstract": asset.abstract,
    "dct:description": asset.description,
    "dcat:mediaType": asset.mediaType,
    "dcat:keyword": asset.keywords,
    "dcat:version": asset.version,
  };

  // Handle dates with proper xsd:date type
  if (asset.created) {
    properties["dct:created"] = {
      "@value": asset.created,
      "@type": "xsd:date",
    };
  }

  if (asset.modified) {
    properties["dct:modified"] = {
      "@value": asset.modified,
      "@type": "xsd:date",
    };
  }

  if (asset.theme?.title) {
    properties["dcat:theme"] = {
      "@type": "skos:Concept",
      "dct:title": asset.theme.title,
    };
  }

  if (asset.creator) {
    properties["dct:creator"] = {
      "@type": "schema:Organization",
      "schema:name": asset.creator.name,
      "@id": asset.creator.id,
    };
  }


  if (asset.provenance?.derivedFromId) {
    properties["prov:wasDerivedFrom"] = {
      "@id": asset.provenance.derivedFromId,
    };
  }
  if (asset.provenance?.generatedByDescription) {
    properties["prov:wasGeneratedBy"] = {
      "dct:description": asset.provenance.generatedByDescription,
    };
  }
  if (asset.provenance?.attributedToId) {
    properties["prov:wasAttributedTo"] = {
      "@id": asset.provenance.attributedToId,
    };
  }

  if (asset.qualityMeasurements) {
    properties["dqv:hasQualityMeasurement"] = asset.qualityMeasurements.map(
      (m) => ({
        "dqv:isMeasurementOf": { "dct:title": m.measurementOf.title },
        "dqv:value": m.value,
        "dqv:unit": m.unit,
      })
    );
  }

  let finalDataAddress = asset.dataAddress;
  if (asset.dataAddress) {
    const processedAddress: AssetDataAddress = { type: asset.dataAddress.type };
    for (const [key, value] of Object.entries(asset.dataAddress)) {
      if (key !== "type") {
        processedAddress[key] =
          typeof value === "boolean" ? String(value) : value;
      }
    }
    finalDataAddress = processedAddress;
  }

  const jsonLd = {
    "@context": {
      "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
      edc: "https://w3id.org/edc/v0.0.1/ns/",
      dct: "http://purl.org/dc/terms/",
      dcat: "http://www.w3.org/ns/dcat#",
      prov: "http://www.w3.org/ns/prov#",
      odrl: "http://www.w3.org/ns/odrl/2/",
      dqv: "http://www.w3.org/ns/dqv#",
      wot: "https://www.w3.org/2019/wot/td#",
      dpv: "https://w3id.org/dpv#",
      schema: "http://schema.org/",
      owl: "http://www.w3.org/2002/07/owl#",
      skos: "http://www.w3.org/2004/02/skos/core#",
      xsd: "http://www.w3.org/2001/XMLSchema#",
    },
    "@type": "dcat:Dataset",
    "@id": asset.id,
    properties: removeUndefinedValues(properties),
    dataAddress: finalDataAddress,
  };

  return removeUndefinedValues(jsonLd);
}
