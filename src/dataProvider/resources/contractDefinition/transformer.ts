import {
  ContractDefinition,
  ContractDefinitionFormData,
} from "../../../types/contractDefinition";
import {
  removeUndefinedValues,
  stripUndefinedValues,
} from "../../shared/helpers";
import { CoreContractDefinitionSchema } from "./schema";

export async function parseContractDefinitionFromJsonLd(
  jsonLd: any
): Promise<ContractDefinition> {
  try {
    const parsed = CoreContractDefinitionSchema.parse(jsonLd);

    const contractDefinition: ContractDefinition = {
      id: parsed["@id"],
      type: parsed["@type"],
      privateProperties: parsed.privateProperties
        ? {
            ...parsed.privateProperties,
            name: parsed.privateProperties.name || "Untitled",
          }
        : { name: "Untitled" },
      accessPolicyId: parsed.accessPolicyId || "",
      contractPolicyId: parsed.contractPolicyId || "",
      assetsSelector:
        parsed.assetsSelector.length > 0
          ? parsed.assetsSelector[0].operandRight
          : [],
      assetsSelectorCriteria: parsed.assetsSelector,
      createdAt: parsed.createdAt,
      modifiedAt: parsed.modifiedAt,
    };

    return stripUndefinedValues(contractDefinition);
  } catch (error) {
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
  const assetsSelector = [
    {
      "@type": "Criterion",
      operandLeft: "https://w3id.org/edc/v0.0.1/ns/id",
      operator: "in",
      operandRight: contractDefinition.assetsSelector || [],
    },
  ];

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
