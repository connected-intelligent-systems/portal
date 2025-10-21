import { z } from "zod";
import { PolicySchema } from "../catalog/schema";

export const CoreContractAgreementSchema = z.object({
  "@id": z.string(),
  "@type": z.string(),
  providerId: z.string(),
  consumerId: z.string(),
  assetId: z.string(),
  contractSigningDate: z
    .number()
    .transform((val) => new Date(val * 1000).toISOString()),
  policy: PolicySchema,
});

export const frame = {
  "@context": {
    "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
    odrl: "http://www.w3.org/ns/odrl/2/",
  },
  "@type": "ContractAgreement",
};

export const filterMapping = (key: string, value: any) => {
  switch (key) {
    case "consumerId":
      return {
        field: "consumerId",
        operator: "like",
        value: `%${value}%`,
      };
    case "providerId":
      return {
        field: "providerId",
        operator: "like",
        value: `%${value}%`,
      };
    default:
      return {
        field: key,
        operator: "=",
        value,
      };
  }
};
