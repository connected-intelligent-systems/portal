import { z } from "zod";
import { TerminateTransferProcess } from "../../types/terminateTransferProcess";
import { stripUndefinedValues } from "../helpers";

const CoreTerminateTransferProcessSchema = z.object({
  "@id": z.string(),
  "@type": z.string(),
  transferId: z.string().optional(),
  reason: z.string().optional(),
  state: z.string().optional(),
  createdAt: z
    .number()
    .optional()
    .transform((val) => (val ? new Date(val).toISOString() : undefined)),
});

export function transformToJsonLd(data: { reason?: string }): any {
  return {
    "@context": {
      "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
    },
    "@type": "https://w3id.org/edc/v0.0.1/ns/TerminateTransfer",
    reason: data.reason || "",
  };
}

export async function parseTerminateTransferProcessFromJsonLd(
  jsonLd: any
): Promise<TerminateTransferProcess> {
  try {
    const parsed = CoreTerminateTransferProcessSchema.parse(jsonLd);
    const termination: TerminateTransferProcess = {
      id: parsed["@id"],
      type: parsed["@type"],
      transferId: parsed.transferId || parsed["@id"],
      reason: parsed.reason || "",
      state: parsed.state || "UNKNOWN",
      createdAt: parsed.createdAt || new Date().toISOString(),
    };
    return stripUndefinedValues(termination);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to transform JSON-LD: ${errorMessage}`);
  }
}

export async function parseTerminateTransferProcessFromJsonLdArray(
  jsonLdArray: any[]
): Promise<TerminateTransferProcess[]> {
  return Promise.all(
    jsonLdArray.map((jsonLd) => parseTerminateTransferProcessFromJsonLd(jsonLd))
  );
}
