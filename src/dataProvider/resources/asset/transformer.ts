import { Asset, AssetDataAddress, AssetFormData } from "../../../types/asset";
import {
  removeUndefinedValues,
  stripUndefinedValues,
} from "../../shared/helpers";
import {
  extractCreator,
  extractDate,
  extractPrivacySettings,
  extractProvenance,
  extractQualityMeasurements,
  extractString,
  normalizeStringArray,
  serializePrivacySettings,
  extractThingDescription,
  extractMultiLanguageString,
  type MultiLanguageValue,
} from "../../shared/transformerHelpers";
import { expandThingDescription } from "../../../utils/thingDescriptionUtils";
import { CoreAssetSchema, type CoreAsset } from "./schema";

function serializeMultiLanguageString(
  value: string | MultiLanguageValue[] | undefined
): string | any[] | undefined {
  if (!value) return undefined;

  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => {
      if (item.language) {
        return {
          "@value": item.value,
          "@language": item.language,
        };
      }
      return item.value;
    });
  }

  return undefined;
}

export async function parseAssetFromJsonLd(jsonLdAsset: any): Promise<Asset> {
  try {
    const coreAsset: CoreAsset = CoreAssetSchema.parse(jsonLdAsset);

    const titlesMultiLang =
      extractMultiLanguageString(coreAsset, "dct:title") ??
      extractMultiLanguageString(coreAsset, "aas:Referable/displayName");

    const titleString =
      titlesMultiLang?.find((t) => t.language === "en")?.value ||
      titlesMultiLang?.[0]?.value ||
      extractString(coreAsset, "aas:Identifiable/id") ||
      "";

    const abstractsMultiLang =
      extractMultiLanguageString(coreAsset, "dct:abstract") ??
      extractMultiLanguageString(coreAsset, "aas:Referable/description");

    const abstractString =
      abstractsMultiLang?.find((t) => t.language === "en")?.value ||
      abstractsMultiLang?.[0]?.value ||
      "";

    const asset: Asset = {
      id: coreAsset["@id"],
      title: titleString,
      titles: titlesMultiLang,
      abstract: abstractString,
      abstracts: abstractsMultiLang,
      description: extractString(coreAsset, "dct:description"),
      mediaType: extractString(coreAsset, "dcat:mediaType"),
      keywords: normalizeStringArray(coreAsset, "dcat:keyword"),
      theme: coreAsset.properties?.["dcat:theme"]
        ? {
            title:
              typeof coreAsset.properties["dcat:theme"] === "string"
                ? coreAsset.properties["dcat:theme"]
                : (coreAsset.properties["dcat:theme"] as any)?.["dct:title"],
          }
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
    "dct:title":
      asset.titles && asset.titles.length > 0
        ? serializeMultiLanguageString(asset.titles)
        : asset.title,
    "dct:abstract":
      asset.abstracts && asset.abstracts.length > 0
        ? serializeMultiLanguageString(asset.abstracts)
        : asset.abstract,
    "dct:description": asset.description,
    "dcat:mediaType": asset.mediaType,
    "dcat:keyword": asset.keywords,
    "dcat:version": asset.version,
  };

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
    properties["dcat:theme"] = asset.theme.title;
  }

  if (asset.creator?.name) {
    properties["dct:creator"] = asset.creator.name;
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

    const allowedFields =
      dataAddressType === "HttpData" || dataAddressType === "http"
        ? httpDataFields
        : dataAddressType === "AmazonS3" || dataAddressType === "s3"
        ? amazonS3Fields
        : Object.keys(asset.dataAddress);

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

  const privacyProps = serializePrivacySettings(asset.privacySettings);
  if (privacyProps) {
    jsonLd.properties = { ...jsonLd.properties, ...privacyProps };
  }

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
