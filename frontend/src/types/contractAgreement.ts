import { Policy } from "./policy";

export interface ContractAgreement {
  id: string;
  type: string;
  providerId: string;
  consumerId: string;
  assetId: string;
  contractSigningDate: string;
  policy: Policy;
}

export interface ContractAgreementFormData extends Partial<ContractAgreement> {
  [key: string]: any;
}
