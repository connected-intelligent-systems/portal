import { describe, expect, it } from "vitest";
import { parseTerminateTransferProcessFromJsonLd } from "../../dataProvider/resources/terminateTransferProcess";

describe("terminateTransferProcessTransformers", () => {
  const mockJsonLd = {
    "@id": "term-123",
    "@type": "TerminateTransferProcess",
    transferId: "transfer-456",
    reason: "User cancelled",
    state: "COMPLETED",
    createdAt: 1672531200000,
  };

  it("should parse termination command from JSON-LD", async () => {
    const result = await parseTerminateTransferProcessFromJsonLd(mockJsonLd);

    expect(result.id).toBe("term-123");
    expect(result.transferId).toBe("transfer-456");
    expect(result.reason).toBe("User cancelled");
    expect(result.state).toBe("COMPLETED");
    expect(result.createdAt).toBe("2023-01-01T00:00:00.000Z");
  });
});
