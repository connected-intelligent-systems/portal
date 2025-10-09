export interface EndpointDataReference {
  id: string;
  type: string;
  providerId: string;
  assetId: string;
  agreementId: string;
  transferProcessId: string;
  createdAt: string;
  contractNegotiationId?: string;
}

// Legacy alias for backwards compatibility
export type DataRequest = EndpointDataReference;
