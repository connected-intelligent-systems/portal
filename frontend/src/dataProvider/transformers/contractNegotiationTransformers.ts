import { z } from "zod";
import { ContractNegotiation } from "../../types/contractNegotiation";
import { removeUndefinedValues } from "../helpers";

const CoreContractNegotiationSchema = z.object({
  "@id": z.string(),
  "@type": z.string(),
  state: z.string(),
  protocol: z.string(),
  counterPartyAddress: z.string(),
  counterPartyId: z.string(),
  errorDetail: z.string().optional(),
  createdAt: z.number().transform((val) => new Date(val).toISOString()),
  updatedAt: z.number().transform((val) => new Date(val).toISOString()),
  contractAgreementId: z.string().optional(),
});

export async function parseContractNegotiationFromJsonLd(
  jsonLd: any
): Promise<ContractNegotiation> {
  try {
    const parsed = CoreContractNegotiationSchema.parse(jsonLd);
    const negotiation: ContractNegotiation = {
      id: parsed["@id"],
      type: parsed["@type"],
      state: parsed.state,
      protocol: parsed.protocol,
      counterPartyAddress: parsed.counterPartyAddress,
      counterPartyId: parsed.counterPartyId,
      errorDetail: parsed.errorDetail,
      createdAt: parsed.createdAt,
      updatedAt: parsed.updatedAt,
      contractAgreementId: parsed.contractAgreementId,
    };
    return removeUndefinedValues(negotiation as any);
  } catch (error) {
    console.error("Error in parseContractNegotiationFromJsonLd:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Failed to transform JSON-LD contract negotiation: ${errorMessage}`
    );
  }
}

export async function parseContractNegotiationFromJsonLdArray(
  jsonLdArray: any[]
): Promise<ContractNegotiation[]> {
  return Promise.all(
    jsonLdArray.map((jsonLd) => parseContractNegotiationFromJsonLd(jsonLd))
  );
}
