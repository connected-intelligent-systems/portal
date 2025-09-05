export interface AssetDataAddress {
  type: string;
  [key: string]: any;
}

export interface AssetQualityMeasurement {
  measurementOf: {
    title: string;
  };
  value: string | number;
  unit?: string;
}

export interface AssetVersion {
  id: string;
  version: string;
  description?: string;
  releaseDate?: string;
}

export interface AssetCreator {
  name: string;
  id?: string;
}

export interface AssetProvenance {
  derivedFromId?: string;
  generatedByDescription?: string;
  attributedToId?: string;
}

export interface AssetTheme {
  title: string;
}

export interface Asset {
  id: string;

  // Basic Information
  title: string;
  abstract: string;
  description?: string;
  keywords?: string[];
  theme?: AssetTheme;
  mediaType?: string;

  // Data Address
  dataAddress?: AssetDataAddress;

  // Versioning
  creator?: AssetCreator;
  created?: string;
  modified?: string;
  hasVersion?: AssetVersion[];

  // Provenance
  provenance?: AssetProvenance;

  // Data Quality
  qualityMeasurements?: AssetQualityMeasurement[];

  // Privacy/Legal (extend as needed)
  privacySettings?: {
    [key: string]: any;
  };
}

// Form data interface for create/edit operations
export interface AssetFormData extends Partial<Asset> {
  // Allow additional fields during form editing
  [key: string]: any;
}
