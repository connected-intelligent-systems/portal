import { z } from "zod";

const AssetSelectorCriterionSchema = z
  .object({
    "@type": z.literal("Criterion"),
    operandLeft: z.string(),
    operator: z.string(),
    operandRight: z.union([z.string(), z.array(z.string())]),
  })
  .transform((c) => ({
    type: c["@type"],
    operandLeft: c.operandLeft,
    operator: c.operator,
    operandRight: Array.isArray(c.operandRight)
      ? c.operandRight
      : [c.operandRight],
  }));

export const CoreContractDefinitionSchema = z.object({
  "@id": z.string(),
  "@type": z.string().default("ContractDefinition"),
  privateProperties: z
    .object({
      name: z.string().optional(),
      description: z.string().optional(),
    })
    .passthrough()
    .optional(),
  accessPolicyId: z.string().optional(),
  contractPolicyId: z.string().optional(),
  assetsSelector: z
    .union([
      AssetSelectorCriterionSchema,
      z.array(AssetSelectorCriterionSchema),
    ])
    .optional()
    .transform((val) => {
      if (!val) return [];
      return Array.isArray(val) ? val : [val];
    }),
  createdAt: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) =>
      val
        ? typeof val === "number"
          ? new Date(val).toISOString()
          : val
        : undefined
    ),
  modifiedAt: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) =>
      val
        ? typeof val === "number"
          ? new Date(val).toISOString()
          : val
        : undefined
    ),
});
