import { z } from "zod";

export const AssetFrame = {
  "@context": {
    "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
    dct: "http://purl.org/dc/terms/",
    dcat: "http://www.w3.org/ns/dcat#",
    prov: "http://www.w3.org/ns/prov#",
    odrl: "http://www.w3.org/ns/odrl/2/",
    dqv: "http://www.w3.org/ns/dqv#",
    td: "https://www.w3.org/2019/wot/td#",
    dpv: "https://w3id.org/dpv#",
    schema: "http://schema.org/",
    owl: "http://www.w3.org/2002/07/owl#",
  },
};

export const CoreAssetSchema = z
  .object({
    "@id": z.string(),
    properties: z.record(z.unknown()).optional(),
    dataAddress: z.record(z.unknown()).optional(),
  })
  .passthrough();

export type CoreAsset = z.infer<typeof CoreAssetSchema>;
