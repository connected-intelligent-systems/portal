import { z } from "zod";
import { DataConsumerPull } from "../../types/dataConsumerPull";
import { removeUndefinedValues } from "../helpers";

const CoreDataConsumerPullSchema = z.object({
  "@id": z.string(),
  "@type": z.string(),
  transferProcessId: z.string(),
  state: z.string(),
  createdAt: z.number().transform((val) => new Date(val).toISOString()),
  updatedAt: z.number().transform((val) => new Date(val).toISOString()),
});

export async function parseDataConsumerPullFromJsonLd(
  jsonLd: any
): Promise<DataConsumerPull> {
  try {
    const parsed = CoreDataConsumerPullSchema.parse(jsonLd);
    const pull: DataConsumerPull = {
      id: parsed["@id"],
      type: parsed["@type"],
      transferProcessId: parsed.transferProcessId,
      state: parsed.state,
      createdAt: parsed.createdAt,
      updatedAt: parsed.updatedAt,
    };
    return removeUndefinedValues(pull as any);
  } catch (error) {
    console.error("Error in parseDataConsumerPullFromJsonLd:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Failed to transform JSON-LD data consumer pull: ${errorMessage}`
    );
  }
}

export async function parseDataConsumerPullFromJsonLdArray(
  jsonLdArray: any[]
): Promise<DataConsumerPull[]> {
  return Promise.all(
    jsonLdArray.map((jsonLd) => parseDataConsumerPullFromJsonLd(jsonLd))
  );
}
