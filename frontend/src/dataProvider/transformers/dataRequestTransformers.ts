import { z } from "zod";
import { DataRequest } from "../../types/dataRequest";
import { removeUndefinedValues } from "../helpers";

const CoreDataRequestSchema = z.object({
  "@id": z.string(),
  "@type": z.string(),
  assetId: z.string(),
  contractId: z.string(),
  state: z.string(),
  createdAt: z.number().transform((val) => new Date(val).toISOString()),
  updatedAt: z.number().transform((val) => new Date(val).toISOString()),
});

export async function parseDataRequestFromJsonLd(
  jsonLd: any
): Promise<DataRequest> {
  try {
    const parsed = CoreDataRequestSchema.parse(jsonLd);
    const request: DataRequest = {
      id: parsed["@id"],
      type: parsed["@type"],
      assetId: parsed.assetId,
      contractId: parsed.contractId,
      state: parsed.state,
      createdAt: parsed.createdAt,
      updatedAt: parsed.updatedAt,
    };
    return removeUndefinedValues(request as any);
  } catch (error) {
    console.error("Error in parseDataRequestFromJsonLd:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Failed to transform JSON-LD data request: ${errorMessage}`
    );
  }
}

export async function parseDataRequestFromJsonLdArray(
  jsonLdArray: any[]
): Promise<DataRequest[]> {
  return Promise.all(
    jsonLdArray.map((jsonLd) => parseDataRequestFromJsonLd(jsonLd))
  );
}
