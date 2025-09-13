declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    config: {
      // edc settings
      showAssets: boolean;
      showPolicies: boolean;
      showContractDefinitions: boolean;
      showCatalog: boolean;
      showContractAgreements: boolean;
      showTransferProcesses: boolean;
    };
  }
}

export {};
