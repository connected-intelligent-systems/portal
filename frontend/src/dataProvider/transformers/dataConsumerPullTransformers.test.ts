import { describe, it, expect } from "vitest";
import { parseDataConsumerPullFromJsonLd } from "./dataConsumerPullTransformers";

describe("dataConsumerPullTransformers", () => {
  const mockJsonLd = {
    "@id": "pull-123",
    "@type": "DataConsumerPull",
    transferProcessId: "tp-456",
    state: "COMPLETED",
    createdAt: 1672531200000, // 2023-01-01T00:00:00.000Z
    updatedAt: 1672531260000, // 2023-01-01T00:01:00.000Z
  };

  it("should parse data consumer pull from JSON-LD", async () => {
    const result = await parseDataConsumerPullFromJsonLd(mockJsonLd);

    expect(result.id).toBe("pull-123");
    expect(result.type).toBe("DataConsumerPull");
    expect(result.transferProcessId).toBe("tp-456");
    expect(result.state).toBe("COMPLETED");
    expect(result.createdAt).toBe("2023-01-01T00:00:00.000Z");
  });
});
