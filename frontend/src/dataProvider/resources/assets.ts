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
  parseAssetFromJsonLd,
  serializeAssetToJsonLd,
} from "../transformers/assetTransformers";

const frame = {
  "@context": {
    "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
    dct: "http://purl.org/dc/terms/",
    dcat: "http://www.w3.org/ns/dcat#",
    prov: "http://www.w3.org/ns/prov#",
    odrl: "http://www.w3.org/ns/odrl/2/",
    dqv: "http://www.w3.org/ns/dqv#",
    wot: "https://www.w3.org/2019/wot/td#",
    dpv: "https://w3id.org/dpv#",
    schema: "http://schema.org/",
    owl: "http://www.w3.org/2002/07/owl#",
  },
};

export async function getList(params: GetListParams) {
  const { page, perPage } = params.pagination || { page: 1, perPage: 10 };
  const response = await httpClient(`/api/management/v3/assets/request`, {
    method: "POST",
    body: JSON.stringify({
      "@context": {
        "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
      },
      "@type": "QuerySpec",
      offset: (page - 1) * perPage,
      limit: perPage,
      filterExpression: [],
    }),
  });

  const assets = response.json;
  const framedAssets = await compactJsonLdArray(assets, frame);

  // Transform JSON-LD assets to clean Asset objects
  const cleanAssets = await Promise.all(
    framedAssets.map((asset: any) => parseAssetFromJsonLd(asset))
  );

  return {
    data: cleanAssets,
    pageInfo: {
      hasNextPage: assets.length === perPage,
      hasPreviousPage: page > 1,
    },
  };
}

export async function getOne(params: GetOneParams) {
  const response = await httpClient(`/api/management/v3/assets/${params.id}`);
  const asset = response.json;
  const framedAsset = await compactJsonLd(asset, frame);

  // Transform JSON-LD asset to clean Asset object
  const cleanAsset = await parseAssetFromJsonLd(framedAsset);

  return {
    data: cleanAsset,
  };
}

export async function remove(params: DeleteParams) {
  await httpClient(`/api/management/v3/assets/${params.id}`, {
    method: "DELETE",
  });
  return {
    data: {
      id: params.id,
    },
  };
}

export async function create(params: CreateParams) {
  // Transform clean Asset data to JSON-LD format
  const jsonLdAsset = await serializeAssetToJsonLd(params.data);

  const response = await httpClient(`/api/management/v3/assets`, {
    method: "POST",
    body: JSON.stringify(jsonLdAsset),
  });

  // Transform response back to clean Asset object
  const cleanAsset = await parseAssetFromJsonLd(response.json);

  return {
    data: cleanAsset,
  };
}

export async function update(params: UpdateParams) {
  // Transform clean Asset data to JSON-LD format
  const jsonLdAsset = await serializeAssetToJsonLd(params.data);

  await httpClient(`/api/management/v3/assets`, {
    method: "PUT",
    body: JSON.stringify(jsonLdAsset),
  });

  // Return the clean Asset data with the ID
  return {
    data: {
      ...params.data,
      id: params.id,
    },
  };
}

export async function getMany(params: GetManyParams) {
  const assets = await Promise.all(
    params.ids.map((id: any) =>
      httpClient(`/api/management/v3/assets/${id}`).then((res) => res.json)
    )
  );
  const framedAssets = await compactJsonLdArray(assets, frame);

  // Transform JSON-LD assets to clean Asset objects
  const cleanAssets = await Promise.all(
    framedAssets.map((asset: any) => parseAssetFromJsonLd(asset))
  );

  return {
    data: cleanAssets,
  };
}
