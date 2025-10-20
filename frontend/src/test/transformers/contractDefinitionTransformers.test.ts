import { describe, expect, test } from "vitest";
import {
  parseContractDefinitionFromJsonLd,
  serializeContractDefinitionToJsonLd,
} from "../../dataProvider/resources/contractDefinition";

describe("contractDefinitionTransformers", () => {
  const mockJsonLdContractDefinition = {
    "@context": {
      "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
    },
    "@type": "ContractDefinition",
    "@id": "contract-def-123",
    privateProperties: {
      name: "Test Contract Definition",
      description: "A test contract definition",
    },
    accessPolicyId: "access-policy-123",
    contractPolicyId: "contract-policy-456",
    assetsSelector: [
      {
        "@type": "Criterion",
        operandLeft: "https://w3id.org/edc/v0.0.1/ns/id",
        operator: "in",
        operandRight: "asset-123",
      },
      {
        "@type": "Criterion",
        operandLeft: "https://w3id.org/edc/v0.0.1/ns/id",
        operator: "in",
        operandRight: "asset-456",
      },
    ],
    createdAt: 1672531200000,
  };

  test("should parse JSON-LD to clean ContractDefinition object", async () => {
    const result = await parseContractDefinitionFromJsonLd(
      mockJsonLdContractDefinition
    );

    expect(result.id).toBe("contract-def-123");
    expect(result.type).toBe("ContractDefinition");
    expect(result.privateProperties?.name).toBe("Test Contract Definition");
    expect(result.accessPolicyId).toBe("access-policy-123");
    expect(result.contractPolicyId).toBe("contract-policy-456");
    expect(result.assetsSelector).toEqual(["asset-123", "asset-456"]);
    expect(result.createdAt).toBe("2023-01-01T00:00:00.000Z");
  });

  test("should serialize clean ContractDefinition to JSON-LD format", async () => {
    const inputContractDefinition = {
      id: "contract-def-789",
      type: "ContractDefinition",
      privateProperties: {
        name: "New Contract Definition",
        description: "A new contract definition",
      },
      accessPolicyId: "access-policy-789",
      contractPolicyId: "contract-policy-012",
      assetsSelector: ["asset-789", "asset-012"],
    };

    const result = await serializeContractDefinitionToJsonLd(
      inputContractDefinition
    );

    expect(result["@context"]).toBeDefined();
    expect(result["@type"]).toBe("ContractDefinition");
    expect(result["@id"]).toBe("contract-def-789");
    expect(result.privateProperties?.name).toBe("New Contract Definition");
    expect(result.accessPolicyId).toBe("access-policy-789");
    expect(result.contractPolicyId).toBe("contract-policy-012");
    expect(result.assetsSelector).toHaveLength(2);
    expect(result.assetsSelector?.[0]).toEqual({
      "@type": "Criterion",
      operandLeft: "https://w3id.org/edc/v0.0.1/ns/id",
      operator: "in",
      operandRight: "asset-789",
    });
  });

  test("should handle empty assetsSelector", async () => {
    const inputContractDefinition = {
      id: "contract-def-empty",
      privateProperties: {
        name: "Empty Contract Definition",
      },
      accessPolicyId: "access-policy-empty",
      contractPolicyId: "contract-policy-empty",
      assetsSelector: [],
    };

    const result = await serializeContractDefinitionToJsonLd(
      inputContractDefinition
    );

    expect(result.assetsSelector).toEqual([]);
  });

  test("should handle single assetsSelector object (not array)", async () => {
    const singleAssetSelectorDef = {
      "@id": "contract-def-single-asset",
      "@type": "ContractDefinition",
      accessPolicyId: "access-policy-123",
      contractPolicyId: "contract-policy-456",
      assetsSelector: {
        "@type": "Criterion",
        operandLeft: "https://w3id.org/edc/v0.0.1/ns/id",
        operator: "in",
        operandRight: "asset-123",
      },
      privateProperties: {
        name: "Test Policy",
      },
      createdAt: 1672531200000,
    };

    const result = await parseContractDefinitionFromJsonLd(
      singleAssetSelectorDef
    );
    expect(result.assetsSelector).toEqual(["asset-123"]);
    expect(result.assetsSelectorCriteria).toHaveLength(1);
  });

  test("should serialize data from a flat form structure", async () => {
    const flatFormData = {
      id: "form-contract-def-123",
      name: "From Form",
      description: "A description from a flat form structure",
      accessPolicyId: "form-access-policy",
      contractPolicyId: "form-contract-policy",
      assetsSelector: ["form-asset-1"],
    };

    const result = await serializeContractDefinitionToJsonLd(flatFormData);

    expect(result.privateProperties?.name).toBe("From Form");
    expect(result.privateProperties?.description).toBe(
      "A description from a flat form structure"
    );
    expect(result.accessPolicyId).toBe("form-access-policy");
  });

  test("should handle missing createdAt field", async () => {
    const noCreatedAtDef = {
      "@id": "contract-def-no-created-at",
      "@type": "ContractDefinition",
      accessPolicyId: "access-policy-123",
      contractPolicyId: "contract-policy-456",
      assetsSelector: [],
      privateProperties: {
        name: "Test Policy",
      },
    };

    const result = await parseContractDefinitionFromJsonLd(noCreatedAtDef);
    expect(result.createdAt).toBeUndefined();
  });
});
