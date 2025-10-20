import { describe, expect, it } from "vitest";
import { parseTransferProcessFromJsonLd } from "../../dataProvider/resources/transferProcess";

describe("transferProcessTransformers", () => {
  const mockJsonLd = {
    "@id": "tp-123",
    "@type": "TransferProcess",
    state: "COMPLETED",
    stateTimestamp: 1672531260000,
    type: "PROVIDER",
    transferType: "HttpData-PULL",
    contractId: "contract-789",
    assetId: "asset-456",
    correlationId: "corr-abc",
    callbackAddresses: [{ "@id": "http://test.com" }],
    createdAt: 1672531200000,
    updatedAt: 1672531260000,
  };

  it("should parse transfer process from JSON-LD", async () => {
    const result = await parseTransferProcessFromJsonLd(mockJsonLd);

    expect(result.id).toBe("tp-123");
    expect(result.state).toBe("COMPLETED");
    expect(result.contractId).toBe("contract-789");
    expect(result.assetId).toBe("asset-456");
    expect(result.createdAt).toBe("2023-01-01T00:00:00.000Z");
    expect(result.stateTimestamp).toBe("2023-01-01T00:01:00.000Z");
    expect(result.transferDirection).toBe("PROVIDER");
    expect(result.transferType).toBe("HttpData-PULL");
    expect(result.correlationId).toBe("corr-abc");
    expect(result.callbackAddresses).toHaveLength(1);
  });

  it("should handle missing optional fields", async () => {
    const mockMinimalJsonLd = {
      "@id": "tp-minimal",
      "@type": "TransferProcess",
      state: "STARTED",
      stateTimestamp: 1672531200000,
      type: "CONSUMER",
      contractId: "contract-789",
      assetId: "asset-456",
    };

    const result = await parseTransferProcessFromJsonLd(mockMinimalJsonLd);
    expect(result.id).toBe("tp-minimal");
    expect(result.transferType).toBeUndefined();
    expect(result.createdAt).toBeUndefined();
    expect(result.updatedAt).toBeUndefined();
    expect(result.correlationId).toBeUndefined();
  });
});
