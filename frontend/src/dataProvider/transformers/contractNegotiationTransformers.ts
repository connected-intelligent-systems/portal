import { z } from "zod";
import { ContractNegotiation } from "../../types/contractNegotiation";
import { removeUndefinedValues, stripUndefinedValues } from "../helpers";

const CoreContractNegotiationSchema = z.object({
  "@id": z.string(),
  "@type": z.string(),
  type: z.string(),
  state: z.string(),
  protocol: z.string(),
  counterPartyAddress: z.string(),
  counterPartyId: z.string(),
  errorDetail: z.string().optional(),
  createdAt: z.number().transform((val) => new Date(val).toISOString()),
  updatedAt: z
    .number()
    .transform((val) => new Date(val).toISOString())
    .optional(),
  contractAgreementId: z.string().optional(),
});

export async function parseContractNegotiationFromJsonLd(
  jsonLd: any
): Promise<ContractNegotiation> {
  try {
    const parsed = CoreContractNegotiationSchema.parse(jsonLd);
    const negotiation: ContractNegotiation = {
      id: parsed["@id"],
      type: parsed.type,
      state: parsed.state,
      protocol: parsed.protocol,
      counterPartyAddress: parsed.counterPartyAddress,
      counterPartyId: parsed.counterPartyId,
      errorDetail: parsed.errorDetail,
      createdAt: parsed.createdAt,
      updatedAt: parsed.updatedAt ?? parsed.createdAt,
      contractAgreementId: parsed.contractAgreementId,
    };
    return stripUndefinedValues(negotiation);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Failed to transform JSON-LD contract negotiation: ${errorMessage}`
    );
  }
}

export async function parseContractNegotiationFromJsonLdArray(
  jsonLdArray: any[]
): Promise<ContractNegotiation[]> {
  return Promise.all(
    jsonLdArray.map((jsonLd) => parseContractNegotiationFromJsonLd(jsonLd))
  );
}

export async function serializeContractNegotiationToJsonLd(
  data: any
): Promise<any> {
  // Build the policy object with proper ODRL structure
  const policy: any = {
    "@context": "http://www.w3.org/ns/odrl.jsonld",
    "@type": data.policy?.type,
    "@id": data.policy?.id,
    assigner: data.policy?.assigner,
    target: data.policy?.target,
  };

  // Add optional policy fields if they exist
  if (data.policy?.obligations) {
    policy.obligation = data.policy.obligations;
  }

  if (data.policy?.permissions) {
    policy.permission = data.policy.permissions.map((permission: any) => {
      return {
        action: {
          "@id": permission.action,
        },
        constraint: permission.constraints.map((constraint: any) => ({
          "@type": "odrl:Constraint",
          leftOperand: {
            "@id": constraint.leftOperand,
          },
          operator: {
            "@id": constraint.operator,
          },
          rightOperand: constraint.rightOperand,
        })),
      };
    });
  }

  if (data.policy?.prohibitions) {
    policy.prohibition = data.policy.prohibitions;
  }

  const jsonLd = {
    "@context": {
      "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
      edc: "https://w3id.org/edc/v0.0.1/ns/",
    },
    "@type": "ContractRequest",
    counterPartyAddress: data.counterPartyAddress,
    protocol: data.protocol || "dataspace-protocol-http",
    policy: removeUndefinedValues(policy),
  };

  return removeUndefinedValues(jsonLd);
}
