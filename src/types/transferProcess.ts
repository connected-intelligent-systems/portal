export interface TransferProcess {
  id: string;
  jsonLdType: string; // Renamed from 'type' to avoid conflict
  state: string;
  stateTimestamp: string;
  transferDirection: string; // The new 'type' field from the API
  transferType?: string;
  contractId: string;
  assetId: string;
  correlationId?: string;
  callbackAddresses?: any[];
  errorDetail?: string;
  createdAt?: string;
  updatedAt?: string;
}
