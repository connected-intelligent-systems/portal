import { describe, expect, it } from "vitest";
import { parseDataConsumerPullFromJsonLd } from "../../dataProvider/shared/dataConsumerPullTransformers";

describe("dataConsumerPullTransformers", () => {
  const mockJsonLd = {
    "@id": "pull-123",
    "@type": "DataConsumerPull",
    transferProcessId: "tp-456",
    state: "COMPLETED",
    createdAt: 1672531200000,
    updatedAt: 1672531260000,
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
