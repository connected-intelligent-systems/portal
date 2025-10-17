import { z } from "zod";
import { ContractAgreement } from "../../types/contractAgreement";
import { stripUndefinedValues } from "../helpers";
import { parsePolicyFromJsonLd } from "./policyTransformers";

// This schema is simplified as the policy object is complex and handled by its own transformer
const CoreContractAgreementSchema = z.object({
  "@id": z.string(),
  "@type": z.string(),
  providerId: z.string(),
  consumerId: z.string(),
  assetId: z.string(),
  contractSigningDate: z
    .number()
    .transform((val) => new Date(val * 1000).toISOString()),
  policy: z.any(), // The policy is parsed by its own transformer
});

export async function parseContractAgreementFromJsonLd(
  jsonLd: any
): Promise<ContractAgreement> {
  try {
    // The API returns a nested structure, so we target the inner contractAgreement object
    const agreementData = jsonLd.contractAgreement || jsonLd;

    const parsed = CoreContractAgreementSchema.parse(agreementData);

    const parsedPolicy = await parsePolicyFromJsonLd(parsed.policy);

    const agreement: ContractAgreement = {
      id: parsed["@id"],
      type: parsed["@type"],
      providerId: parsed.providerId,
      consumerId: parsed.consumerId,
      assetId: parsed.assetId,
      contractSigningDate: parsed.contractSigningDate,
      policy: parsedPolicy,
    };
    return stripUndefinedValues(agreement);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Failed to transform JSON-LD contract agreement: ${errorMessage}`
    );
  }
}

export async function parseContractAgreementFromJsonLdArray(
  jsonLdArray: any[]
): Promise<ContractAgreement[]> {
  return Promise.all(
    jsonLdArray.map((jsonLd) => parseContractAgreementFromJsonLd(jsonLd))
  );
}
