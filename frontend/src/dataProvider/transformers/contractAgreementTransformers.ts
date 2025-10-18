import { z } from "zod";
import * as jsonld from "jsonld";
import { ContractAgreement } from "../../types/contractAgreement";
import { stripUndefinedValues } from "../helpers";
import { PolicySchema } from "./catalogTransformers";

const CoreContractAgreementSchema = z.object({
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

async function compactPolicy(policy: any): Promise<any> {
  try {
    const context = {
      edc: "https://w3id.org/edc/v0.0.1/ns/",
      odrl: "http://www.w3.org/ns/odrl/2/",
    };

    const compacted = await jsonld.compact(
      {
        "@context": {
          odrl: "http://www.w3.org/ns/odrl/2/",
        },
        ...policy,
      },
      context
    );

    return compacted;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to compact JSON-LD policy: ${errorMessage}`);
  }
}

export async function parseContractAgreementFromJsonLd(
  jsonLd: any
): Promise<ContractAgreement> {
  try {
    const agreementData = jsonLd.contractAgreement || jsonLd;
    const compactedPolicy = await compactPolicy(
      agreementData.policy || jsonLd.policy
    );
    const parsed = CoreContractAgreementSchema.parse({
      ...agreementData,
      policy: compactedPolicy,
    });

    const agreement: ContractAgreement = {
      id: parsed["@id"],
      type: parsed["@type"],
      providerId: parsed.providerId,
      consumerId: parsed.consumerId,
      assetId: parsed.assetId,
      contractSigningDate: parsed.contractSigningDate,
      policy: parsed.policy,
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
