import { z } from "zod";

// A generic type for any resource that has a properties bag
export type CoreResource = {
  properties?: Record<string, unknown>;
  [key: string]: unknown;
};

/**
 * Safely extracts a string value from a resource's properties.
 * @param data The core resource object.
 * @param key The key of the property to extract (e.g., 'dct:title').
 * @returns The string value or undefined if not found or not a string.
 */
export function extractString(
  data: CoreResource,
  key: string
): string | undefined {
  const result = z.string().safeParse(data.properties?.[key]);
  return result.success ? result.data : undefined;
}

/**
 * Safely extracts a value that could be a single string or an array of strings,
 * and normalizes it into an array of strings.
 * @param data The core resource object.
 * @param key The key of the property to extract.
 * @returns An array of strings, or undefined if not found.
 */
export function normalizeStringArray(
  data: CoreResource,
  key: string
): string[] | undefined {
  const keywords = data.properties?.[key];
  const arraySchema = z.array(z.string());
  const stringSchema = z.string();

  const arrayResult = arraySchema.safeParse(keywords);
  if (arrayResult.success) {
    return arrayResult.data;
  }

  const stringResult = stringSchema.safeParse(keywords);
  if (stringResult.success) {
    return [stringResult.data];
  }

  return undefined;
}

export interface CreatorInfo {
  name: string;
  id?: string;
}

export interface ProvenanceInfo {
  derivedFromId?: string;
  generatedByDescription?: string;
  attributedToId?: string;
}

export interface QualityMeasurementInfo {
  measurementOf: {
    title: string;
  };
  value: string | number;
  unit?: string;
}

export function extractCreator(data: CoreResource): CreatorInfo | undefined {
  const creator = data.properties?.["dct:creator"] as any;
  if (!creator) return undefined;

  const nameFromStructured = z
    .string()
    .safeParse(creator["schema:name"] ?? creator["name"]);
  const idResult = z.string().safeParse(creator["@id"]);

  if (nameFromStructured.success) {
    return {
      name: nameFromStructured.data,
      id: idResult.success ? idResult.data : undefined,
    };
  }

  const stringResult = z.string().safeParse(creator);
  if (stringResult.success) {
    return { name: stringResult.data };
  }

  return undefined;
}

export function extractDate(
  data: CoreResource,
  field: string
): string | undefined {
  const dateValue = data.properties?.[field];
  if (!dateValue) return undefined;

  if (typeof dateValue === "object" && dateValue !== null) {
    const structuredValue = (dateValue as Record<string, unknown>)["@value"];
    const structuredResult = z.string().safeParse(structuredValue);
    if (structuredResult.success) {
      return structuredResult.data;
    }
  }

  const stringResult = z.string().safeParse(dateValue);
  if (stringResult.success) {
    return stringResult.data;
  }

  return undefined;
}

export function extractProvenance(
  data: CoreResource
): ProvenanceInfo | undefined {
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

export function extractQualityMeasurements(
  data: CoreResource
): QualityMeasurementInfo[] | undefined {
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

/**
 * Parse privacy settings from a core resource properties bag.
 * Specifically extracts `dpv:hasPersonalDataHandling` entries and
 * normalizes them to an array of objects with friendly keys.
 */
export function extractPrivacySettings(
  data: CoreResource
): { personalDataHandling?: Array<Record<string, any>> } | undefined {
  const props = data.properties;
  if (!props) return undefined;

  const handling = props["dpv:hasPersonalDataHandling"];
  if (!handling) return undefined;

  const arr = Array.isArray(handling) ? handling : [handling];

  // Normalize each entry to use short keys for the UI form
  const normalized = arr.map((item: any) => ({
    personalData:
      item["dpv:hasData"] ?? item["dpv:hasPersonalData"] ?? undefined,
    purpose: item["dpv:hasPurpose"],
    legalBasis: item["dpv:hasLegalBasis"],
    applicableLaw: item["dpv:hasLaw"],
    // keep original shape as fallback
    __raw: item,
  }));

  return { personalDataHandling: normalized };
}

/**
 * Serialize privacy settings from the form/model into JSON-LD property entries
 * under `dpv:hasPersonalDataHandling` using the expected dpv predicates.
 */
export function serializePrivacySettings(
  privacy: any
): Record<string, any> | undefined {
  if (!privacy) return undefined;

  const handling = privacy.personalDataHandling;
  if (!handling || !Array.isArray(handling) || handling.length === 0)
    return undefined;

  const mapped = handling.map((h: any) => {
    const entry: Record<string, any> = {};
    if (h.personalData) entry["dpv:hasData"] = h.personalData;
    if (h.purpose) entry["dpv:hasPurpose"] = h.purpose;
    if (h.legalBasis) entry["dpv:hasLegalBasis"] = h.legalBasis;
    if (h.applicableLaw) entry["dpv:hasLaw"] = h.applicableLaw;
    return entry;
  });

  return { "dpv:hasPersonalDataHandling": mapped };
}
