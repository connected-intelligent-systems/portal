import {
  GetListParams,
  GetOneParams,
  DeleteParams,
  CreateParams,
  UpdateParams,
  GetManyParams,
} from "react-admin";
import { httpClient } from "../../shared/httpClient";
import {
  compactJsonLd,
  compactJsonLdArray,
  buildQuerySpec,
} from "../../shared/helpers";
import { parseAssetFromJsonLd, serializeAssetToJsonLd } from "./transformer";
import { AssetFrame } from "./schema";

export async function getList(params: GetListParams) {
  const { page = 1, perPage = 10 } = params.pagination || {};
  const querySpec = buildQuerySpec(params);
  const response = await httpClient(`/api/management/v3/assets/request`, {
    method: "POST",
    body: JSON.stringify(querySpec),
  });

  const assets = response.json;
  const framedAssets = await compactJsonLdArray(assets, AssetFrame);
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
  const framedAsset = await compactJsonLd(asset, AssetFrame);
  const cleanAsset = await parseAssetFromJsonLd(framedAsset);

  return {
    data: {
      ...cleanAsset,
      raw: framedAsset,
    },
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
  const jsonLdAsset = await serializeAssetToJsonLd(params.data);
  const response = await httpClient(`/api/management/v3/assets`, {
    method: "POST",
    body: JSON.stringify(jsonLdAsset),
  });

  const cleanAsset = await parseAssetFromJsonLd(response.json);

  return {
    data: cleanAsset,
  };
}

export async function update(params: UpdateParams) {
  const jsonLdAsset = await serializeAssetToJsonLd(params.data);

  await httpClient(`/api/management/v3/assets`, {
    method: "PUT",
    body: JSON.stringify(jsonLdAsset),
  });

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
  const framedAssets = await compactJsonLdArray(assets, AssetFrame);
  const cleanAssets = await Promise.all(
    framedAssets.map((asset: any) => parseAssetFromJsonLd(asset))
  );

  return {
    data: cleanAssets,
  };
}
