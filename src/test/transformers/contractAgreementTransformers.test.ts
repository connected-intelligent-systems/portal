import { describe, it, expect, vi } from "vitest";
import { parseContractAgreementFromJsonLd } from "../../dataProvider/resources/contractAgreement";

// Mock the policy transformer as its testing is separate
vi.mock("../../dataProvider/resources/policy", () => ({
  parsePolicyFromJsonLd: vi.fn((policy) =>
    Promise.resolve({ ...policy, id: "parsed-policy" })
  ),
}));

describe("contractAgreementTransformers", () => {
  const mockJsonLdAgreement = {
    "@id": "agreement-wrapper-123",
    // The actual agreement data is nested
    contractAgreement: {
      "@id": "agreement-123",
      "@type": "ContractAgreement",
      providerId: "provider-abc",
      consumerId: "consumer-xyz",
      assetId: "asset-456",
      contractSigningDate: 1672531200, // seconds since epoch, 2023-01-01T00:00:00.000Z
      policy: { "@id": "policy-789" },
    },
    dataset: { "@id": "dataset-1" },
  };

  it("should parse nested contract agreement from JSON-LD", async () => {
    const result = await parseContractAgreementFromJsonLd(mockJsonLdAgreement);

    expect(result.id).toBe("agreement-123");
    expect(result.providerId).toBe("provider-abc");
    expect(result.consumerId).toBe("consumer-xyz");
    expect(result.assetId).toBe("asset-456");
    expect(result.contractSigningDate).toBe("2023-01-01T00:00:00.000Z");
    expect(result.policy.id).toBe("parsed-policy");
  });
});
