import { z } from "zod";
import { TerminateContractNegotiation } from "../../types/terminateContractNegotiation";
import { removeUndefinedValues } from "../helpers";

const CoreTerminateContractNegotiationSchema = z.object({
  "@id": z.string(),
  "@type": z.string(),
  negotiationId: z.string().optional(),
  reason: z.string().optional(),
  state: z.string().optional(),
  createdAt: z
    .number()
    .optional()
    .transform((val) => (val ? new Date(val).toISOString() : undefined)),
});

export function transformToJsonLd(data: { id: string; reason?: string }): any {
  return {
    "@context": {
      "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
    },
    "@type": "https://w3id.org/edc/v0.0.1/ns/TerminateNegotiation",
    "@id": data.id,
    reason: data.reason || "",
  };
}

export async function parseTerminateContractNegotiationFromJsonLd(
  jsonLd: any
): Promise<TerminateContractNegotiation> {
  try {
    const parsed = CoreTerminateContractNegotiationSchema.parse(jsonLd);
    const termination: TerminateContractNegotiation = {
      id: parsed["@id"],
      type: parsed["@type"],
      negotiationId: parsed.negotiationId || parsed["@id"],
      reason: parsed.reason || "",
      state: parsed.state || "UNKNOWN",
      createdAt: parsed.createdAt || new Date().toISOString(),
    };
    return removeUndefinedValues(termination as any);
  } catch (error) {
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
