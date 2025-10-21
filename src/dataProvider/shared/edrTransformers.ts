import { z } from "zod";
import { EndpointDataReference } from "../../types/dataRequest";
import { stripUndefinedValues } from "./helpers";

const EndpointDataReferenceSchema = z.object({
  "@id": z.string(),
  "@type": z.string(),
  providerId: z.string(),
  assetId: z.string(),
  agreementId: z.string(),
  transferProcessId: z.string(),
  createdAt: z.number().transform((val) => new Date(val).toISOString()),
  contractNegotiationId: z.string().optional(),
});

export async function parseDataRequestFromJsonLd(
  jsonLd: any
): Promise<EndpointDataReference> {
  try {
    const parsed = EndpointDataReferenceSchema.parse(jsonLd);
    const edr: EndpointDataReference = {
      id: parsed["@id"],
      type: parsed["@type"],
      providerId: parsed.providerId,
      assetId: parsed.assetId,
      agreementId: parsed.agreementId,
      transferProcessId: parsed.transferProcessId,
      createdAt: parsed.createdAt,
      contractNegotiationId: parsed.contractNegotiationId,
    };
    return stripUndefinedValues(edr);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Failed to transform JSON-LD endpoint data reference: ${errorMessage}`
    );
  }
}

export async function parseDataRequestFromJsonLdArray(
  jsonLdArray: any[]
): Promise<EndpointDataReference[]> {
  return Promise.all(
    jsonLdArray.map((jsonLd) => parseDataRequestFromJsonLd(jsonLd))
  );
}
