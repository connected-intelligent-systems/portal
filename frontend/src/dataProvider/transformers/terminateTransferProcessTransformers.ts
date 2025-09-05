import { z } from "zod";
import { TerminateTransferProcess } from "../../types/terminateTransferProcess";
import { removeUndefinedValues } from "../helpers";

const CoreTerminateTransferProcessSchema = z.object({
  "@id": z.string(),
  "@type": z.string(),
  transferId: z.string(),
  reason: z.string().optional(),
  state: z.string(),
  createdAt: z.number().transform((val) => new Date(val).toISOString()),
});

export async function parseTerminateTransferProcessFromJsonLd(
  jsonLd: any
): Promise<TerminateTransferProcess> {
  try {
    const parsed = CoreTerminateTransferProcessSchema.parse(jsonLd);
    const termination: TerminateTransferProcess = {
      id: parsed["@id"],
      type: parsed["@type"],
      transferId: parsed.transferId,
      reason: parsed.reason || "",
      state: parsed.state,
      createdAt: parsed.createdAt,
    };
    return removeUndefinedValues(termination as any);
  } catch (error) {
    console.error("Error in parseTerminateTransferProcessFromJsonLd:", error);
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
