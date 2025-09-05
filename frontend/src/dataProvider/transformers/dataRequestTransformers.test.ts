import { describe, it, expect } from "vitest";
import { parseDataRequestFromJsonLd } from "./dataRequestTransformers";

describe("dataRequestTransformers", () => {
  const mockJsonLd = {
    "@id": "req-123",
    "@type": "DataRequest",
    assetId: "asset-456",
    contractId: "contract-789",
    state: "REQUESTED",
    createdAt: 1672531200000, // 2023-01-01T00:00:00.000Z
    updatedAt: 1672531260000, // 2023-01-01T00:01:00.000Z
  };

  it("should parse data request from JSON-LD", async () => {
    const result = await parseDataRequestFromJsonLd(mockJsonLd);

    expect(result.id).toBe("req-123");
    expect(result.type).toBe("DataRequest");
    expect(result.assetId).toBe("asset-456");
    expect(result.contractId).toBe("contract-789");
    expect(result.state).toBe("REQUESTED");
    expect(result.createdAt).toBe("2023-01-01T00:00:00.000Z");
  });
});
