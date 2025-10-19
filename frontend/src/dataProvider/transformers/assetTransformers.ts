import { z } from "zod";
import { Asset, AssetDataAddress, AssetFormData } from "../../types/asset";
import { removeUndefinedValues, stripUndefinedValues } from "../helpers";
import {
  extractCreator,
  extractDate,
  extractPrivacySettings,
  extractProvenance,
  extractQualityMeasurements,
  extractString,
  normalizeStringArray,
  serializePrivacySettings,
} from "./helpers";
import {
  compactThingDescription,
  expandThingDescription,
} from "../../utils/thingDescriptionUtils";

const CoreAssetSchema = z
  .object({
    "@id": z.string(),
    properties: z.record(z.unknown()).optional(),
    dataAddress: z.record(z.unknown()).optional(),
  })
  .passthrough();

type CoreAsset = z.infer<typeof CoreAssetSchema>;

async function extractThingDescription(thingDescription: any): Promise<any> {
  // the edc returns the expanded form, we want the compacted one
  return compactThingDescription(thingDescription);
}

export async function parseAssetFromJsonLd(jsonLdAsset: any): Promise<Asset> {
  try {
    const coreAsset: CoreAsset = CoreAssetSchema.parse(jsonLdAsset);

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
      privacySettings: extractPrivacySettings(coreAsset),
      thingDescription: await extractThingDescription(
        coreAsset.properties?.["td:hasThingDescription"]
      ),
    };

    return stripUndefinedValues(asset);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to transform JSON-LD asset: ${errorMessage}`);
  }
}

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
    const dataAddressType = asset.dataAddress.type;
    const processedAddress: AssetDataAddress = { type: dataAddressType };

    // Define allowed fields for each type
    const httpDataFields = [
      "type",
      "baseUrl",
      "header:Accept",
      "proxyPath",
      "proxyQueryParams",
      "proxyBody",
      "proxyMethod",
      "authHeader",
    ];
    const amazonS3Fields = [
      "type",
      "region",
      "endpointOverride",
      "bucketName",
      "objectName",
      "objectPrefix",
      "accessKeyId",
      "secretAccessKey",
    ];

    // Determine which fields to keep based on type
    const allowedFields =
      dataAddressType === "HttpData" || dataAddressType === "http"
        ? httpDataFields
        : dataAddressType === "AmazonS3" || dataAddressType === "s3"
        ? amazonS3Fields
        : Object.keys(asset.dataAddress); // fallback: keep all fields

    for (const [key, value] of Object.entries(asset.dataAddress)) {
      if (key !== "type" && allowedFields.includes(key)) {
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
      td: "https://www.w3.org/2019/wot/td#",
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

  // attach privacy settings into properties if present
  const privacyProps = serializePrivacySettings(asset.privacySettings);
  if (privacyProps) {
    jsonLd.properties = { ...jsonLd.properties, ...privacyProps };
  }

  // Process and attach W3C Thing Description if present
  if (asset.thingDescription) {
    jsonLd.properties = {
      ...jsonLd.properties,
      "td:hasThingDescription": await expandThingDescription(
        asset.thingDescription
      ),
    };
  }

  return removeUndefinedValues(jsonLd);
}
