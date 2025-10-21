import { TransferProcess } from "../../../types/transferProcess";
import { stripUndefinedValues } from "../../shared/helpers";
import { CoreTransferProcessSchema } from "./schema";

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
    return stripUndefinedValues(transfer);
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
