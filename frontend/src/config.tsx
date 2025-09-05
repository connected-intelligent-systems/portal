declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    config: {
      federatedCatalogUrl: string;
      // edc settings
      showAssets: boolean;
      showPolicies: boolean;
      showContractDefinitions: boolean;
      showCatalog: boolean;
      showFederatedCatalog: boolean;
      showContractAgreements: boolean;
      showTransferProcesses: boolean;
    };
  }
}

export {};
