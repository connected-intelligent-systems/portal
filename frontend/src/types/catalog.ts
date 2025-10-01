export interface PolicyConstraint {
  leftOperand: string;
  operator: string;
  rightOperand: string | number | Date;
}

export interface PolicyRule {
  action: string;
  constraints?: PolicyConstraint[];
}

export interface DatasetPolicy {
  id: string;
  type: string;
  permissions?: PolicyRule[];
  prohibitions?: PolicyRule[];
  obligations?: PolicyRule[];
}

export interface DatasetTheme {
  title?: string;
  id?: string;
}

export interface Dataset {
  // Core identifiers
  id: string;

  // Basic metadata
  title?: string;
  abstract?: string;
  description?: string;

  // Classification
  type?: string;
  contenttype?: string;
  mediaType?: string;
  theme?: DatasetTheme;
  keywords?: string[];

  // Participant information
  participantId?: string;

  // Policies attached to this dataset
  policies?: DatasetPolicy[];

  // Additional properties that might be present in JSON-LD
  [key: string]: any;
}

export interface Catalog {
  id: string;

  // Catalog metadata
  title?: string;
  description?: string;

  // The datasets in this catalog
  datasets: Dataset[];

  // Additional catalog properties
  [key: string]: any;
}

// Form data interfaces for create/edit operations
export interface DatasetFormData extends Partial<Dataset> {
  [key: string]: any;
}

export interface CatalogFormData extends Partial<Catalog> {
  [key: string]: any;
}

// Local catalog management interfaces
export interface LocalCatalog {
  id: string;
  url: string;
  name: string;
  description?: string;
  dateAdded: string;
  lastConnected?: string;
  isActive: boolean;
}

export interface CatalogConnection {
  id: string;
  status: 'connected' | 'disconnected' | 'error';
  error?: string;
}
