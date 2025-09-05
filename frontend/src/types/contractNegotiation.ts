export interface ContractNegotiation {
  id: string;
  type: string;
  state: string;
  protocol: string;
  counterPartyAddress: string;
  counterPartyId: string;
  errorDetail?: string;
  createdAt: string;
  updatedAt: string;
  contractAgreementId?: string;
}

export interface ContractNegotiationFormData
  extends Partial<ContractNegotiation> {
  [key: string]: any;
}
