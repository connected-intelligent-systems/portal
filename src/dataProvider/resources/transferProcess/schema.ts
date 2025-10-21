import { z } from "zod";

export const CoreTransferProcessSchema = z.object({
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
