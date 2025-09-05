import { z } from "zod";
import { TerminateContractNegotiation } from "../../types/terminateContractNegotiation";
import { removeUndefinedValues } from "../helpers";

const CoreTerminateContractNegotiationSchema = z.object({
  "@id": z.string(),
  "@type": z.string(),
  negotiationId: z.string(),
  reason: z.string().optional(),
  state: z.string(),
  createdAt: z.number().transform((val) => new Date(val).toISOString()),
});

export async function parseTerminateContractNegotiationFromJsonLd(
  jsonLd: any
): Promise<TerminateContractNegotiation> {
  try {
    const parsed = CoreTerminateContractNegotiationSchema.parse(jsonLd);
    const termination: TerminateContractNegotiation = {
      id: parsed["@id"],
      type: parsed["@type"],
      negotiationId: parsed.negotiationId,
      reason: parsed.reason || "",
      state: parsed.state,
      createdAt: parsed.createdAt,
    };
    return removeUndefinedValues(termination as any);
  } catch (error) {
    console.error(
      "Error in parseTerminateContractNegotiationFromJsonLd:",
      error
    );
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to transform JSON-LD: ${errorMessage}`);
  }
}

export async function parseTerminateContractNegotiationFromJsonLdArray(
  jsonLdArray: any[]
): Promise<TerminateContractNegotiation[]> {
  return Promise.all(
    jsonLdArray.map((jsonLd) =>
      parseTerminateContractNegotiationFromJsonLd(jsonLd)
    )
  );
}
