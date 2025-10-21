import { describe, expect, it } from "vitest";
import { parseDataRequestFromJsonLd } from "../../dataProvider/shared/edrTransformers";

describe("edrTransformers", () => {
  const mockJsonLd = {
    "@id": "389b88bc-2a56-4451-8c46-d324d11e2384",
    "@type": "EndpointDataReferenceEntry",
    providerId: "company1",
    assetId: "375adab2-a2c7-4bca-bbb1-e72c9108d539",
    agreementId: "4c2ee08d-1b94-47d1-a7ff-76c40120514b",
    transferProcessId: "389b88bc-2a56-4451-8c46-d324d11e2384",
    createdAt: 1760104740961,
    contractNegotiationId: "325b6100-1db2-4ff6-9c94-79289eff102a",
  };

  it("should parse endpoint data reference from JSON-LD", async () => {
    const result = await parseDataRequestFromJsonLd(mockJsonLd);

    expect(result.id).toBe("389b88bc-2a56-4451-8c46-d324d11e2384");
    expect(result.type).toBe("EndpointDataReferenceEntry");
    expect(result.providerId).toBe("company1");
    expect(result.assetId).toBe("375adab2-a2c7-4bca-bbb1-e72c9108d539");
    expect(result.agreementId).toBe("4c2ee08d-1b94-47d1-a7ff-76c40120514b");
    expect(result.transferProcessId).toBe(
      "389b88bc-2a56-4451-8c46-d324d11e2384"
    );
    expect(result.contractNegotiationId).toBe(
      "325b6100-1db2-4ff6-9c94-79289eff102a"
    );
    expect(result.createdAt).toBe("2025-10-10T13:59:00.961Z");
  });
});
