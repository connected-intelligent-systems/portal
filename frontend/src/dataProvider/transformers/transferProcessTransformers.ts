import { z } from "zod";
import { TransferProcess } from "../../types/transferProcess";
import { removeUndefinedValues } from "../helpers";

const CoreTransferProcessSchema = z.object({
  "@id": z.string(),
  "@type": z.string(),
  state: z.string(),
  stateTimestamp: z.number().transform((val) => new Date(val).toISOString()),
  type: z.string(), // This is the transfer direction (PROVIDER/CONSUMER)
  transferType: z.string().optional(), // This is the protocol (HttpData-PULL)
  contractId: z.string(),
  assetId: z.string(),
  correlationId: z.string().optional(),
  callbackAddresses: z.array(z.any()).optional(),
  errorDetail: z.string().optional(),
  createdAt: z
    .number()
    .optional()
    .transform((val) => (val ? new Date(val).toISOString() : undefined)),
  updatedAt: z
    .number()
    .optional()
    .transform((val) => (val ? new Date(val).toISOString() : undefined)),
});

export async function parseTransferProcessFromJsonLd(
  jsonLd: any
): Promise<TransferProcess> {
  try {
    const parsed = CoreTransferProcessSchema.parse(jsonLd);
    const transfer: TransferProcess = {
      id: parsed["@id"],
      jsonLdType: parsed["@type"],
      state: parsed.state,
      stateTimestamp: parsed.stateTimestamp,
      transferDirection: parsed.type,
      transferType: parsed.transferType,
      contractId: parsed.contractId,
      assetId: parsed.assetId,
      correlationId: parsed.correlationId,
      callbackAddresses: parsed.callbackAddresses,
      errorDetail: parsed.errorDetail,
      createdAt: parsed.createdAt,
      updatedAt: parsed.updatedAt,
    };
    return removeUndefinedValues(transfer as any);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Failed to transform JSON-LD transfer process: ${errorMessage}`
    );
  }
}

export async function parseTransferProcessFromJsonLdArray(
  jsonLdArray: any[]
): Promise<TransferProcess[]> {
  return Promise.all(
    jsonLdArray.map((jsonLd) => parseTransferProcessFromJsonLd(jsonLd))
  );
}
