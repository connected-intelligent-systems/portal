import { describe, expect, it } from "vitest";
import {
  parsePolicyFromJsonLd,
  serializePolicyToJsonLd,
} from "../../dataProvider/transformers/policyTransformers";

describe("Policy Transformers", () => {
  const sampleJsonLdPolicy = {
    "@id": "policy-123",
    "@type": "PolicyDefinition",
    privateProperties: {
      name: "Test Policy",
      description: "A test policy",
    },
    policy: {
      "@type": "odrl:Set",
      "odrl:permission": [
        {
          "odrl:action": {
            "@id": "odrl:use",
          },
        },
      ],
    },
  };

  it("should parse policy from JSON-LD format", async () => {
    const result = await parsePolicyFromJsonLd(sampleJsonLdPolicy);

    expect(result.id).toBe("policy-123");
    expect(result.name).toBe("Test Policy");
    expect(result.description).toBe("A test policy");
    expect(result.type).toBe("PolicyDefinition");
    expect(result.policyType).toBe("odrl:Set");
    expect(Array.isArray(result.rules.permissions)).toBe(true);
    expect(result.rules.permissions).toHaveLength(1);
    expect(result.rules.permissions?.[0].action).toBe("odrl:use");
  });

  it("should handle single permission object (not array) from API", async () => {
    const singlePermissionPolicy = {
      "@id": "policy-456",
      "@type": "PolicyDefinition",
      privateProperties: {
        name: "Single Permission Policy",
        description: "A policy with single permission object",
      },
      policy: {
        "@type": "odrl:Set",
        "odrl:permission": {
          "odrl:action": {
            "@id": "odrl:read",
          },
        },
      },
    };

    const result = await parsePolicyFromJsonLd(singlePermissionPolicy);

    expect(result.id).toBe("policy-456");
    expect(result.name).toBe("Single Permission Policy");
    expect(Array.isArray(result.rules.permissions)).toBe(true);
    expect(result.rules.permissions).toHaveLength(1);
    expect(result.rules.permissions?.[0].action).toBe("odrl:read");
  });

  it("should serialize policy to JSON-LD format", async () => {
    const policyData = {
      name: "Test Policy",
      description: "A test policy",
      rules: {
        permissions: [{ action: "odrl:use", constraints: [] }],
        prohibitions: [],
        obligations: [],
      },
    };

    const result = await serializePolicyToJsonLd(policyData);

    expect(result["@type"]).toBe("PolicyDefinition");
    expect(result.privateProperties.name).toBe("Test Policy");
    expect(result.policy["@type"]).toBe("odrl:Set");
  });

  it("should preserve data through round-trip transformation", async () => {
    const lifted = await parsePolicyFromJsonLd(sampleJsonLdPolicy);
    const lowered = await serializePolicyToJsonLd(lifted);
    const final = await parsePolicyFromJsonLd(lowered);

    expect(final.name).toBe(lifted.name);
    expect(final.description).toBe(lifted.description);
  });

  it("should handle policy with no name", async () => {
    const noNamePolicy = {
      "@id": "policy-no-name",
      "@type": "PolicyDefinition",
      policy: {
        "@type": "odrl:Set",
      },
    };

    const result = await parsePolicyFromJsonLd(noNamePolicy);
    expect(result.name).toBe("Untitled Policy");
  });
});
