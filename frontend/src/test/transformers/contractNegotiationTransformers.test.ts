import { describe, expect, it } from "vitest";
import { parseContractNegotiationFromJsonLd } from "../../dataProvider/transformers/contractNegotiationTransformers";

describe("contractNegotiationTransformers", () => {
  const mockJsonLdNegotiation = {
    "@id": "neg-123",
    "@type": "ContractNegotiation",
    type: "CONSUMER",
    state: "FINALIZED",
    protocol: "dataspace-protocol-http",
    counterPartyAddress: "http://some-connector.com/api/v1/ids/data",
    counterPartyId: "some-connector",
    errorDetail: undefined,
    createdAt: 1672531200000,
    updatedAt: 1672531260000,
  };

  it("should parse contract negotiation from JSON-LD", async () => {
    const result = await parseContractNegotiationFromJsonLd(
      mockJsonLdNegotiation
    );

    expect(result.id).toBe("neg-123");
    expect(result.type).toBe("CONSUMER");
    expect(result.state).toBe("FINALIZED");
    expect(result.protocol).toBe("dataspace-protocol-http");
    expect(result.counterPartyAddress).toBe(
      "http://some-connector.com/api/v1/ids/data"
    );
    expect(result.createdAt).toBe("2023-01-01T00:00:00.000Z");
    expect(result.updatedAt).toBe("2023-01-01T00:01:00.000Z");
  });
});
