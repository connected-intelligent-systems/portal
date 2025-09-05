export interface ContractDefinitionAssetSelector {
  type: "Criterion";
  operandLeft: string;
  operator: string;
  operandRight: string;
}

export interface ContractDefinitionPrivateProperties {
  name: string;
  description?: string;
  [key: string]: any;
}

export interface ContractDefinition {
  id: string;

  // Type information
  type: string;

  // Private properties (internal metadata)
  privateProperties: ContractDefinitionPrivateProperties;

  // Policy references
  accessPolicyId: string;
  contractPolicyId: string;

  // Asset selection criteria
  assetsSelector: string[]; // Array of asset IDs for the UI
  assetsSelectorCriteria?: ContractDefinitionAssetSelector[]; // Internal JSON-LD format

  // Timestamps
  createdAt?: string;
  modifiedAt?: string;

  // Additional properties that might be present
  [key: string]: any;
}

// Form data interface for create/edit operations
export interface ContractDefinitionFormData
  extends Partial<ContractDefinition> {
  // Allow additional fields during form editing
  [key: string]: any;
}

// Display interface for list views with computed properties
export interface ContractDefinitionDisplay extends ContractDefinition {
  // Computed properties for display
  hasAssets: boolean;
  assetsCount: number;
}
