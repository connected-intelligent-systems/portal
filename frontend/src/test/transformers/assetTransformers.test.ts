import { describe, it, expect } from "vitest";
import {
  parseAssetFromJsonLd,
  serializeAssetToJsonLd,
} from "../../dataProvider/transformers/assetTransformers";

describe("Asset Transformers", () => {
  const sampleJsonLdAsset = {
    "@id": "asset-123",
    properties: {
      "dct:title": "Test Asset",
      "dct:abstract": "Test abstract",
      "dcat:mediaType": "application/json",
      "dcat:keyword": ["data", "test"],
    },
    dataAddress: {
      type: "HttpData",
      baseUrl: "https://example.com/api",
    },
  };

  it("should lift asset from JSON-LD format", async () => {
    const result = await parseAssetFromJsonLd(sampleJsonLdAsset);

    expect(result.id).toBe("asset-123");
    expect(result.title).toBe("Test Asset");
    expect(result.abstract).toBe("Test abstract");
    expect(result.mediaType).toBe("application/json");
    expect(Array.isArray(result.keywords)).toBe(true);
  });

  it("should serialize asset to JSON-LD format", async () => {
    const assetData = {
      id: "asset-abc",
      title: "Test Asset",
      abstract: "Test abstract",
      mediaType: "application/json",
    };

    const result = await serializeAssetToJsonLd(assetData);

    expect(result).toHaveProperty("@id", "asset-abc");
    expect(result.properties["dct:title"]).toBe("Test Asset");
    expect(result.properties["dct:abstract"]).toBe("Test abstract");
    expect(result.properties["dcat:mediaType"]).toBe("application/json");
  });
});
