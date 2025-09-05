import { GetOneParams } from "react-admin";
import { parseCatalogFromJsonLd } from "../transformers/catalogTransformers";

/**
 * Fetch a catalog by counterparty address
 * This is the main function used by the catalog pages
 */
export async function getOne(params: GetOneParams) {
  try {
    const response = await fetch(`/api/management/v3/catalog/request`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        "@context": {
          "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
        },
        counterPartyAddress: params.id,
        protocol: "dataspace-protocol-http",
      }),
    });

    const catalogData = await response.json();

    if (!response.ok) {
      throw new Error(
        catalogData.message || `HTTP error! status: ${response.status}`
      );
    }

    // Transform JSON-LD catalog to clean Catalog object with normalized datasets
    const cleanCatalog = await parseCatalogFromJsonLd(catalogData, params.id);

    return {
      data: cleanCatalog,
    };
  } catch (error) {
    console.error("Error fetching catalog:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to fetch catalog: ${errorMessage}`);
  }
}

// Note: Based on the current usage pattern, only getOne is implemented
// Other CRUD operations are not needed for catalog functionality
export async function getList() {
  throw new Error(
    "Catalog getList is not implemented. Use federated_catalog resource instead."
  );
}

export async function getMany() {
  throw new Error(
    "Catalog getMany is not implemented. Use federated_catalog resource instead."
  );
}

export async function create() {
  throw new Error(
    "Catalog create is not implemented. Use federated_catalog resource instead."
  );
}

export async function update() {
  throw new Error(
    "Catalog update is not implemented. Use federated_catalog resource instead."
  );
}

export async function remove() {
  throw new Error(
    "Catalog delete is not implemented. Use federated_catalog resource instead."
  );
}
