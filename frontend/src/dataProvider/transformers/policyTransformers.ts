import { z } from "zod";
import { Policy, PolicyFormData, PolicyRule } from "../../types/policy";
import { removeUndefinedValues } from "../helpers";

// --- Zod Schemas for Policy Structure ---

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

const CorePolicySchema = z
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

// --- Main Transformation Functions ---

export async function parsePolicyFromJsonLd(
  jsonLdPolicy: any
): Promise<Policy> {
  try {
    const core = CorePolicySchema.parse(jsonLdPolicy);

    const rules: PolicyRule = {
      permissions: core.policy?.["odrl:permission"],
      prohibitions: core.policy?.["odrl:prohibition"],
      obligations: core.policy?.["odrl:obligation"],
      target: core.policy?.["odrl:target"],
    };

    const policy: Policy = {
      id: core["@id"],
      type: core["@type"],
      name:
        z.string().optional().parse(core.privateProperties?.name) ||
        "Untitled Policy",
      description: z
        .string()
        .optional()
        .parse(core.privateProperties?.description),
      createdAt: core.createdAt
        ? new Date(core.createdAt).toISOString()
        : undefined,
      policyType: core.policy?.["@type"],
      rules: rules,
      privateProperties: core.privateProperties,
    };

    return removeUndefinedValues(policy);
  } catch (error) {
    console.error("Error in parsePolicyFromJsonLd (Zod):", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to transform JSON-LD policy: ${errorMessage}`);
  }
}

export async function parsePolicyFromJsonLdArray(
  jsonLdPolicies: any[]
): Promise<Policy[]> {
  return Promise.all(
    jsonLdPolicies.map((policy) => parsePolicyFromJsonLd(policy))
  );
}

export async function serializePolicyToJsonLd(
  policy: PolicyFormData
): Promise<any> {
  const buildRule = (rule: any) => ({
    "odrl:action": { "@id": rule.action },
    "odrl:constraint": rule.constraints?.map((c: any) => ({
      "odrl:leftOperand": { "@id": c.leftOperand },
      "odrl:operator": { "@id": c.operator },
      "odrl:rightOperand": c.rightOperand,
    })),
  });

  const jsonLd = {
    "@context": {
      "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
      edc: "https://w3id.org/edc/v0.0.1/ns/",
      odrl: "http://www.w3.org/ns/odrl/2/",
      dct: "http://purl.org/dc/terms/",
    },
    "@type": policy.type || "PolicyDefinition",
    "@id": policy.id,
    createdAt: policy.createdAt
      ? new Date(policy.createdAt).getTime()
      : undefined,
    privateProperties: {
      name: policy.name,
      description: policy.description,
    },
    policy: {
      "@type": policy.policyType || "odrl:Set",
      "odrl:permission": policy.rules?.permissions?.map(buildRule),
      "odrl:prohibition": policy.rules?.prohibitions?.map(buildRule),
      "odrl:obligation": policy.rules?.obligations?.map(buildRule),
      "odrl:target": policy.rules?.target,
    },
  };

  return removeUndefinedValues(jsonLd);
}
