import { DatasetPolicy } from "./catalog";

export interface ContractAgreement {
  id: string;
  type: string;
  providerId: string;
  consumerId: string;
  assetId: string;
  contractSigningDate: string;
  policy: DatasetPolicy;
}

export interface ContractAgreementFormData extends Partial<ContractAgreement> {
  [key: string]: any;
}
