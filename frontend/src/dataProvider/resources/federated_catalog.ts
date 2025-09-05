import {
  GetListParams,
  GetOneParams,
  DeleteParams,
  CreateParams,
  UpdateParams,
  GetManyParams,
} from "react-admin";
import { httpClient } from "../httpClient";
import { compactJsonLd, compactJsonLdArray } from "../helpers";
import {
  parseCatalogFromJsonLd,
  parseDatasetFromJsonLdArray,
} from "../transformers/catalogTransformers"; // We can reuse the catalog transformer

const frame = {
  "@context": {
    "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
  },
  "@type": "Catalog",
};

export async function getList(params: GetListParams) {
  const response = await httpClient(`/api/management/v3/catalog/request`, {
    method: "POST",
    body: JSON.stringify({
      "@context": {
        "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
      },
      "@type": "QuerySpec",
      offset: 0,
      limit: 20,
      filterExpression: [],
    }),
  });

  const federatedCatalog = response.json;
  const framedFederatedCatalog = await compactJsonLdArray(
    federatedCatalog,
    frame
  );

  // The response is a list of catalog objects, each containing datasets.
  // We need to parse each catalog and then flatten all the datasets together.
  const allDatasets = (
    await Promise.all(
      framedFederatedCatalog.map((catalog) =>
        parseCatalogFromJsonLd(
          catalog,
          Array.isArray(catalog["@id"])
            ? catalog["@id"][0]
            : catalog["@id"] || ""
        )
      )
    )
  ).flatMap((catalog) => catalog.datasets);

  return {
    data: allDatasets,
    total: allDatasets.length,
  };
}

export async function getOne(params: GetOneParams) {
  const response = await httpClient(`/api/management/v3/catalog/${params.id}`);
  const federatedCatalog = response.json;
  const framedFederatedCatalog = await compactJsonLd(federatedCatalog, frame);
  const cleanCatalog = await parseCatalogFromJsonLd(
    framedFederatedCatalog,
    params.id
  );
  return {
    data: cleanCatalog,
  };
}

// The following functions are not typically used for a federated catalog view
// but are kept for completeness, reusing the catalog transformer.

export async function remove(params: DeleteParams) {
  await httpClient(`/api/management/v3/catalog/${params.id}`, {
    method: "DELETE",
  });
  return {
    data: {
      id: params.id,
    },
  };
}

export async function create(params: CreateParams) {
  // Create is not logical for a federated view, but implemented for completeness
  const response = await httpClient(`/api/management/v3/catalog`, {
    method: "POST",
    body: JSON.stringify(params.data), // Assuming data is already in correct JSON-LD
  });
  const cleanCatalog = await parseCatalogFromJsonLd(
    response.json,
    response.json["@id"]
  );
  return {
    data: cleanCatalog,
  };
}

export async function update(params: UpdateParams) {
  await httpClient(`/api/management/v3/catalog`, {
    method: "PUT",
    body: JSON.stringify(params.data), // Assuming data is already in correct JSON-LD
  });
  const cleanCatalog = await parseCatalogFromJsonLd(params.data, params.id);
  return {
    data: cleanCatalog,
  };
}

export async function getMany(params: GetManyParams) {
  const catalogs = await Promise.all(
    params.ids.map((id: any) =>
      httpClient(`/api/management/v3/catalog/${id}`).then((res) => res.json)
    )
  );
  const framedCatalogs = await compactJsonLdArray(catalogs, frame);
  const cleanCatalogs = await Promise.all(
    framedCatalogs.map((c) =>
      parseCatalogFromJsonLd(
        c,
        Array.isArray(c["@id"]) ? c["@id"][0] : c["@id"] || ""
      )
    )
  );
  return {
    data: cleanCatalogs,
  };
}
