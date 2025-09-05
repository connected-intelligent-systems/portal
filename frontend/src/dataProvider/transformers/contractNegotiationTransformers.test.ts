import { describe, it, expect } from "vitest";
import { parseContractNegotiationFromJsonLd } from "./contractNegotiationTransformers";

describe("contractNegotiationTransformers", () => {
  const mockJsonLdNegotiation = {
    "@id": "neg-123",
    "@type": "ContractNegotiation",
    state: "FINALIZED",
    protocol: "dataspace-protocol-http",
    counterPartyAddress: "http://some-connector.com/api/v1/ids/data",
    counterPartyId: "some-connector",
    errorDetail: undefined,
    createdAt: 1672531200000, // 2023-01-01T00:00:00.000Z
    updatedAt: 1672531260000, // 2023-01-01T00:01:00.000Z
  };

  it("should parse contract negotiation from JSON-LD", async () => {
    const result = await parseContractNegotiationFromJsonLd(
      mockJsonLdNegotiation
    );

    expect(result.id).toBe("neg-123");
    expect(result.type).toBe("ContractNegotiation");
    expect(result.state).toBe("FINALIZED");
    expect(result.protocol).toBe("dataspace-protocol-http");
    expect(result.counterPartyAddress).toBe(
      "http://some-connector.com/api/v1/ids/data"
    );
    expect(result.createdAt).toBe("2023-01-01T00:00:00.000Z");
    expect(result.updatedAt).toBe("2023-01-01T00:01:00.000Z");
  });
});
