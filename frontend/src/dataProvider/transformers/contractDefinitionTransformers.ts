import { z } from "zod";
import {
  ContractDefinition,
  ContractDefinitionFormData,
  ContractDefinitionAssetSelector,
} from "../../types/contractDefinition";
import { removeUndefinedValues } from "../helpers";

// --- Zod Schemas for Contract Definition Structure ---

const AssetSelectorCriterionSchema = z
  .object({
    "@type": z.literal("Criterion"),
    operandLeft: z.string(),
    operator: z.string(),
    operandRight: z.string(),
  })
  .transform((c) => ({
    type: c["@type"],
    operandLeft: c.operandLeft,
    operator: c.operator,
    operandRight: c.operandRight,
  }));

const CoreContractDefinitionSchema = z.object({
  "@id": z.string(),
  "@type": z.string().default("ContractDefinition"),
  privateProperties: z
    .object({
      name: z.string(),
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

// --- Main Transformation Functions ---

export async function parseContractDefinitionFromJsonLd(
  jsonLd: any
): Promise<ContractDefinition> {
  try {
    const parsed = CoreContractDefinitionSchema.parse(jsonLd);

    const contractDefinition: ContractDefinition = {
      id: parsed["@id"],
      type: parsed["@type"],
      privateProperties: parsed.privateProperties || { name: "Untitled" },
      accessPolicyId: parsed.accessPolicyId || "",
      contractPolicyId: parsed.contractPolicyId || "",
      assetsSelector: parsed.assetsSelector.map((c) => c.operandRight),
      assetsSelectorCriteria: parsed.assetsSelector,
      createdAt: parsed.createdAt,
      modifiedAt: parsed.modifiedAt,
    };

    return removeUndefinedValues(contractDefinition as any);
  } catch (error) {
    console.error("Error in parseContractDefinitionFromJsonLd:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Failed to transform JSON-LD contract definition: ${errorMessage}`
    );
  }
}

export async function parseContractDefinitionFromJsonLdArray(
  jsonLdArray: any[]
): Promise<ContractDefinition[]> {
  return Promise.all(
    jsonLdArray.map((jsonLd) => parseContractDefinitionFromJsonLd(jsonLd))
  );
}

export async function serializeContractDefinitionToJsonLd(
  contractDefinition: ContractDefinitionFormData
): Promise<any> {
  const assetsSelector =
    contractDefinition.assetsSelector?.map((assetId) => ({
      "@type": "Criterion",
      operandLeft: "https://w3id.org/edc/v0.0.1/ns/id",
      operator: "in",
      operandRight: assetId,
    })) || [];

  const privateProperties = contractDefinition.privateProperties
    ? contractDefinition.privateProperties
    : {
        name: contractDefinition.name,
        description: contractDefinition.description,
      };

  const jsonLd = {
    "@context": {
      "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
      edc: "https://w3id.org/edc/v0.0.1/ns/",
      odrl: "http://www.w3.org/ns/odrl/2/",
    },
    "@type": contractDefinition.type || "ContractDefinition",
    "@id": contractDefinition.id,
    privateProperties: privateProperties,
    accessPolicyId: contractDefinition.accessPolicyId,
    contractPolicyId: contractDefinition.contractPolicyId,
    assetsSelector: assetsSelector,
    createdAt: contractDefinition.createdAt,
    modifiedAt: contractDefinition.modifiedAt,
  };

  return removeUndefinedValues(jsonLd);
}
