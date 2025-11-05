import { z } from "zod";
import type { CoreResource } from "../../shared/transformerHelpers";

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

export const PolicySchema = z
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

const DistributionSchema = z
  .object({
    "@type": z.string().optional(),
    "dct:format": z
      .object({
        "@id": z.string().optional(),
      })
      .optional(),
    "dcat:accessService": z
      .object({
        "@id": z.string().optional(),
        "@type": z.string().optional(),
        "dcat:endpointDescription": z.string().optional(),
        "dcat:endpointUrl": z.string().optional(),
        "dcat:endpointURL": z.string().optional(),
      })
      .optional(),
  })
  .passthrough()
  .transform((dist) => ({
    type: dist["@type"],
    format: dist["dct:format"]?.["@id"],
    accessService: dist["dcat:accessService"]
      ? {
          id: dist["dcat:accessService"]["@id"],
          type: dist["dcat:accessService"]["@type"],
          endpointDescription:
            dist["dcat:accessService"]["dcat:endpointDescription"],
          endpointUrl:
            dist["dcat:accessService"]["dcat:endpointUrl"] ||
            dist["dcat:accessService"]["dcat:endpointURL"],
        }
      : undefined,
  }));

export const DatasetSchema = z
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
      .union([
        z.string(),
        z.object({
          "dct:title": z.string().optional(),
          "@id": z.string().optional(),
          "@type": z.string().optional(),
        }),
      ])
      .optional(),
    "dcat:keyword": z.union([z.string(), z.array(z.string())]).optional(),
    "odrl:hasPolicy": z
      .union([PolicySchema, z.array(PolicySchema)])
      .optional()
      .transform((p) => (p ? (Array.isArray(p) ? p : [p]) : [])),
    "dcat:distribution": z
      .union([DistributionSchema, z.array(DistributionSchema)])
      .optional()
      .transform((d) => (d ? (Array.isArray(d) ? d : [d]) : [])),
  })
  .passthrough()
  .transform((d) => {
    const datasetResource: CoreResource = {
      "@id": d["@id"],
      properties: d as Record<string, unknown>,
    };

    return {
      id: d["@id"],
      title: d["dct:title"],
      abstract: d["dct:abstract"],
      description: d["dct:description"],
      type: d.type,
      contenttype: d.contenttype,
      mediaType: d["dcat:mediaType"],
      theme: d["dcat:theme"]
        ? {
            title:
              typeof d["dcat:theme"] === "string"
                ? d["dcat:theme"]
                : (d["dcat:theme"] as any)?.["dct:title"],
          }
        : undefined,
      keywords: d["dcat:keyword"]
        ? Array.isArray(d["dcat:keyword"])
          ? d["dcat:keyword"]
          : [d["dcat:keyword"]]
        : undefined,
      policies: d["odrl:hasPolicy"],
      distributions: d["dcat:distribution"],
      _rawThingDescription: d["td:hasThingDescription"],
      _datasetResource: datasetResource,
    };
  });

export const CatalogSchema = z.object({
  "dct:title": z.string().optional(),
  "dct:description": z.string().optional(),
  "dspace:participantId": z.string().optional(),
  "dcat:dataset": z
    .union([DatasetSchema, z.array(DatasetSchema)])
    .optional()
    .transform((d) => (d ? (Array.isArray(d) ? d : [d]) : [])),
});
