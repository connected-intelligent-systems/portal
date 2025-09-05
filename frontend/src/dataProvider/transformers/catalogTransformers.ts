import { z } from "zod";
import {
  Catalog,
  Dataset,
  DatasetPolicy,
  PolicyRule,
  PolicyConstraint,
} from "../../types/catalog";
import { removeUndefinedValues } from "../helpers";
import { normalizeStringArray } from "./helpers";

// --- Zod Schemas for Catalog Structure ---

const ConstraintSchema = z
  .object({
    "odrl:leftOperand": z
      .union([z.object({ "@id": z.string() }), z.string()])
      .transform((v) => (typeof v === "object" ? v["@id"] : v)),
    "odrl:operator": z
      .union([z.object({ "@id": z.string() }), z.string()])
      .transform((v) => (typeof v === "object" ? v["@id"] : v)),
    "odrl:rightOperand": z.union([z.string(), z.number(), z.date()]),
  })
  .transform((c) => ({
    leftOperand: c["odrl:leftOperand"],
    operator: c["odrl:operator"],
    rightOperand: c["odrl:rightOperand"],
  }));

const PolicyRuleSchema = z
  .object({
    "odrl:action": z
      .union([z.object({ "@id": z.string() }), z.string()])
      .transform((v) => (typeof v === "object" ? v["@id"] : v)),
    "odrl:constraint": z
      .union([ConstraintSchema, z.array(ConstraintSchema)])
      .optional()
      .transform((c) => (c ? (Array.isArray(c) ? c : [c]) : [])),
  })
  .transform((r) => ({
    action: r["odrl:action"],
    constraints: r["odrl:constraint"],
  }));

const PolicySchema = z
  .object({
    "@id": z.string(),
    "@type": z.string(),
    "odrl:permission": z
      .union([PolicyRuleSchema, z.array(PolicyRuleSchema)])
      .optional()
      .transform((p) => (p ? (Array.isArray(p) ? p : [p]) : [])),
    "odrl:prohibition": z
      .union([PolicyRuleSchema, z.array(PolicyRuleSchema)])
      .optional()
      .transform((p) => (p ? (Array.isArray(p) ? p : [p]) : [])),
    "odrl:obligation": z
      .union([PolicyRuleSchema, z.array(PolicyRuleSchema)])
      .optional()
      .transform((p) => (p ? (Array.isArray(p) ? p : [p]) : [])),
  })
  .transform((p) => ({
    id: p["@id"],
    type: p["@type"],
    permissions: p["odrl:permission"],
    prohibitions: p["odrl:prohibition"],
    obligations: p["odrl:obligation"],
  }));

const DatasetSchema = z
  .object({
    "@id": z
      .union([z.string(), z.null(), z.undefined()])
      .transform((val) => val || "unknown-id"),
    "dct:title": z.string().optional(),
    "dct:abstract": z.string().optional(),
    "dct:description": z.string().optional(),
    type: z.string().optional(),
    contenttype: z.string().optional(),
    "dcat:mediaType": z.string().optional(),
    "dcat:theme": z
      .object({
        "dct:title": z.string().optional(),
        "@id": z.string().optional(),
      })
      .optional(),
    "dcat:keyword": z.union([z.string(), z.array(z.string())]).optional(),
    "dspace:participantId": z.string().optional(),
    "odrl:hasPolicy": z
      .union([PolicySchema, z.array(PolicySchema)])
      .optional()
      .transform((p) => (p ? (Array.isArray(p) ? p : [p]) : [])),
  })
  .transform((d) => ({
    id: d["@id"],
    title: d["dct:title"],
    abstract: d["dct:abstract"],
    description: d["dct:description"],
    type: d.type,
    contenttype: d.contenttype,
    mediaType: d["dcat:mediaType"],
    theme: d["dcat:theme"]
      ? { title: d["dcat:theme"]["dct:title"], id: d["dcat:theme"]["@id"] }
      : undefined,
    keywords: d["dcat:keyword"]
      ? Array.isArray(d["dcat:keyword"])
        ? d["dcat:keyword"]
        : [d["dcat:keyword"]]
      : undefined,
    participantId: d["dspace:participantId"],
    policies: d["odrl:hasPolicy"],
  }));

const CatalogSchema = z.object({
  "dct:title": z.string().optional(),
  "dct:description": z.string().optional(),
  "dcat:dataset": z
    .union([DatasetSchema, z.array(DatasetSchema)])
    .optional()
    .transform((d) => (d ? (Array.isArray(d) ? d : [d]) : [])),
});

// --- Main Transformation Functions ---

export async function parseDatasetFromJsonLd(
  jsonLdDataset: any
): Promise<Dataset> {
  try {
    const parsed = DatasetSchema.parse(jsonLdDataset);
    return removeUndefinedValues(parsed as Dataset);
  } catch (error) {
    console.error("Error in parseDatasetFromJsonLd:", error);
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
    const catalog: Catalog = {
      id: catalogId,
      title: parsed["dct:title"],
      description: parsed["dct:description"],
      datasets: parsed["dcat:dataset"] || [],
    };
    return removeUndefinedValues(catalog) as Catalog;
  } catch (error) {
    console.error("Error in parseCatalogFromJsonLd:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to transform JSON-LD catalog: ${errorMessage}`);
  }
}
