import { z } from "zod";

const ConstraintSchema = z
  .object({
    "odrl:leftOperand": z.object({ "@id": z.string() }),
    "odrl:operator": z.object({ "@id": z.string() }),
    "odrl:rightOperand": z.union([z.string(), z.number(), z.date()]),
  })
  .transform((c) => ({
    leftOperand: c["odrl:leftOperand"]["@id"],
    operator: c["odrl:operator"]["@id"],
    rightOperand: c["odrl:rightOperand"],
  }));

const RuleSchema = z
  .object({
    "@id": z.string().optional(),
    "odrl:action": z.object({ "@id": z.string() }),
    "odrl:constraint": z
      .union([ConstraintSchema, z.array(ConstraintSchema)])
      .optional(),
  })
  .transform((r) => ({
    action: r["odrl:action"]["@id"],
    constraints: r["odrl:constraint"]
      ? Array.isArray(r["odrl:constraint"])
        ? r["odrl:constraint"]
        : [r["odrl:constraint"]]
      : [],
  }));

export const CorePolicySchema = z
  .object({
    "@id": z.string(),
    "@type": z.string(),
    privateProperties: z.record(z.unknown()).optional(),
    createdAt: z.number().optional(),
    policy: z
      .object({
        "@type": z.string(),
        "odrl:permission": z.preprocess(
          (p) => (p ? (Array.isArray(p) ? p : [p]) : []),
          z.array(RuleSchema).optional()
        ),
        "odrl:prohibition": z.preprocess(
          (p) => (p ? (Array.isArray(p) ? p : [p]) : []),
          z.array(RuleSchema).optional()
        ),
        "odrl:obligation": z.preprocess(
          (p) => (p ? (Array.isArray(p) ? p : [p]) : []),
          z.array(RuleSchema).optional()
        ),
        "odrl:target": z.string().optional(),
      })
      .optional(),
  })
  .passthrough();
