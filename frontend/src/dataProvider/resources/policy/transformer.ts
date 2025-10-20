import { z } from "zod";
import { Policy, PolicyFormData, PolicyRule } from "../../../types/policy";
import {
  removeUndefinedValues,
  stripUndefinedValues,
} from "../../shared/helpers";
import { CorePolicySchema } from "./schema";

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

    return stripUndefinedValues(policy);
  } catch (error) {
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
