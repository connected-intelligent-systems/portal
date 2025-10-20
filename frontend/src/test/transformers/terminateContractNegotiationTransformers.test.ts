import { describe, expect, it } from "vitest";
import { parseTerminateContractNegotiationFromJsonLd } from "../../dataProvider/resources/terminateContractNegotiation";

describe("terminateContractNegotiationTransformers", () => {
  const mockJsonLd = {
    "@id": "term-123",
    "@type": "TerminateContractNegotiation",
    negotiationId: "neg-456",
    reason: "User cancelled",
    state: "COMPLETED",
    createdAt: 1672531200000,
  };

  it("should parse termination command from JSON-LD", async () => {
    const result = await parseTerminateContractNegotiationFromJsonLd(
      mockJsonLd
    );

    expect(result.id).toBe("term-123");
    expect(result.negotiationId).toBe("neg-456");
    expect(result.reason).toBe("User cancelled");
    expect(result.state).toBe("COMPLETED");
    expect(result.createdAt).toBe("2023-01-01T00:00:00.000Z");
  });
});
