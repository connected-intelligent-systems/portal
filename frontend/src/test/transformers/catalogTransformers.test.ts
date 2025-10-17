import { describe, expect, test } from "vitest";
import {
  parseDatasetFromJsonLd,
  parseCatalogFromJsonLd,
} from "../../dataProvider/transformers/catalogTransformers";

describe("catalogTransformers", () => {
  const mockJsonLdDataset = {
    "@id": "dataset-123",
    "dct:title": "Test Dataset",
    "dct:abstract": "A test dataset for unit testing",
    "dct:description": "Detailed description of the test dataset",
    type: "Dataset",
    contenttype: "application/json",
    "dcat:mediaType": "application/json",
    "dcat:theme": {
      "dct:title": "Technology",
      "@id": "theme-tech",
    },
    "dcat:keyword": ["test", "dataset", "example"],
    "dspace:participantId": "participant-456",
    "odrl:hasPolicy": [
      {
        "@id": "policy-789",
        "@type": "odrl:Policy",
        "odrl:permission": [
          {
            "odrl:action": {
              "@id": "odrl:use",
            },
            "odrl:constraint": [
              {
                "odrl:leftOperand": {
                  "@id": "odrl:dateTime",
                },
                "odrl:operator": {
                  "@id": "odrl:lt",
                },
                "odrl:rightOperand": "2024-12-31T23:59:59Z",
              },
            ],
          },
        ],
        "odrl:prohibition": [
          {
            "odrl:action": {
              "@id": "odrl:distribute",
            },
          },
        ],
      },
    ],
  };

  const mockJsonLdCatalog = {
    "dct:title": "Test Catalog",
    "dct:description": "A test catalog",
    "dcat:dataset": [mockJsonLdDataset],
  };

  test("should parse JSON-LD dataset to clean Dataset object", async () => {
    const result = await parseDatasetFromJsonLd(mockJsonLdDataset);

    expect(result.id).toBe("dataset-123");
    expect(result.title).toBe("Test Dataset");
    expect(result.abstract).toBe("A test dataset for unit testing");
    expect(result.description).toBe("Detailed description of the test dataset");
    expect(result.type).toBe("Dataset");
    expect(result.contenttype).toBe("application/json");
    expect(result.mediaType).toBe("application/json");
    expect(result.keywords).toEqual(["test", "dataset", "example"]);
    expect(result.theme).toEqual({
      title: "Technology",
      id: "theme-tech",
    });

    // Check policies transformation
    expect(result.policies).toHaveLength(1);
    expect(result.policies![0].id).toBe("policy-789");
    expect(result.policies![0].type).toBe("odrl:Policy");
    expect(result.policies![0].permissions).toHaveLength(1);
    expect(result.policies![0].permissions![0].action).toBe("odrl:use");
    expect(result.policies![0].permissions![0].constraints).toHaveLength(1);
    expect(result.policies![0].permissions![0].constraints![0]).toEqual({
      leftOperand: "odrl:dateTime",
      operator: "odrl:lt",
      rightOperand: "2024-12-31T23:59:59Z",
    });
    expect(result.policies![0].prohibitions).toHaveLength(1);
    expect(result.policies![0].prohibitions![0].action).toBe("odrl:distribute");
  });

  test("should parse JSON-LD catalog to clean Catalog object", async () => {
    const catalogId = "catalog-test-id";
    const result = await parseCatalogFromJsonLd(mockJsonLdCatalog, catalogId);

    expect(result.id).toBe(catalogId);
    expect(result.title).toBe("Test Catalog");
    expect(result.description).toBe("A test catalog");
    expect(result.datasets).toHaveLength(1);
    expect(result.datasets[0].id).toBe("dataset-123");
    expect(result.datasets[0].title).toBe("Test Dataset");
  });

  test("should handle single dataset (not array)", async () => {
    const catalogWithSingleDataset = {
      "dct:title": "Single Dataset Catalog",
      "dcat:dataset": mockJsonLdDataset, // Single object, not array
    };

    const catalogId = "catalog-single";
    const result = await parseCatalogFromJsonLd(
      catalogWithSingleDataset,
      catalogId
    );

    expect(result.datasets).toHaveLength(1);
    expect(result.datasets[0].id).toBe("dataset-123");
  });

  test("should handle empty catalog", async () => {
    const emptyCatalog = {
      "dct:title": "Empty Catalog",
    };

    const catalogId = "catalog-empty";
    const result = await parseCatalogFromJsonLd(emptyCatalog, catalogId);

    expect(result.id).toBe(catalogId);
    expect(result.title).toBe("Empty Catalog");
    expect(result.datasets).toEqual([]);
  });

  test("should handle dataset with single policy (not array)", async () => {
    const datasetWithSinglePolicy = {
      ...mockJsonLdDataset,
      "odrl:hasPolicy": {
        "@id": "policy-single",
        "@type": "odrl:Policy",
        "odrl:permission": {
          "odrl:action": {
            "@id": "odrl:read",
          },
        },
      },
    };

    const result = await parseDatasetFromJsonLd(datasetWithSinglePolicy);

    expect(result.policies).toHaveLength(1);
    expect(result.policies![0].id).toBe("policy-single");
    expect(result.policies![0].permissions).toHaveLength(1);
    expect(result.policies![0].permissions![0].action).toBe("odrl:read");
  });

  test("should handle dataset without policies", async () => {
    const datasetWithoutPolicies = {
      "@id": "dataset-no-policies",
      "dct:title": "Dataset Without Policies",
      "dct:abstract": "A dataset with no policies",
    };

    const result = await parseDatasetFromJsonLd(datasetWithoutPolicies);

    expect(result.id).toBe("dataset-no-policies");
    expect(result.title).toBe("Dataset Without Policies");
    expect(result.policies).toEqual([]);
  });

  test("should handle dataset with missing or null id", async () => {
    const datasetWithNoId = {
      "dct:title": "Dataset with no ID",
      "dct:abstract": "This dataset has no @id field.",
    };
    const datasetWithNullId = {
      "@id": null,
      "dct:title": "Dataset with null ID",
      "dct:abstract": "This dataset has a null @id field.",
    };

    const resultNoId = await parseDatasetFromJsonLd(datasetWithNoId);
    expect(resultNoId.id).toBe("unknown-id");
    expect(resultNoId.title).toBe("Dataset with no ID");

    const resultNullId = await parseDatasetFromJsonLd(datasetWithNullId);
    expect(resultNullId.id).toBe("unknown-id");
    expect(resultNullId.title).toBe("Dataset with null ID");
  });
});
