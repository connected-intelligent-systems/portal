import {
  GetListParams,
  GetOneParams,
  DeleteParams,
  CreateParams,
  GetManyParams,
} from "react-admin";
import {
  createAsset,
  deleteAsset,
  fetchAsset,
  fetchAssets,
} from "../api/assets";

export async function getList(params: GetListParams) {
  const assets = await fetchAssets(params.pagination);
  return {
    data: assets.map((asset: any) => ({
      ...asset,
      id: asset["@id"],
    })),
    total: assets.length,
  };
}

export async function getOne(params: GetOneParams) {
  const asset = await fetchAsset(params.id);
  return {
    data: {
      ...asset,
      id: asset["@id"],
    },
  };
}

export async function remove(params: DeleteParams) {
  await deleteAsset(params.id);
  return {
    data: {
      id: params.id,
    },
  };
}

export async function create(params: CreateParams) {
  await createAsset({
    ...params.data,
    "@context": {
      "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
      "dct": "http://purl.org/dc/terms/",
      "dcat": "http://www.w3.org/ns/dcat#",
      "prov": "http://www.w3.org/ns/prov#",
      "odrl": "http://www.w3.org/ns/odrl/2/",
      "dqv": "http://www.w3.org/ns/dqv#",
      "wot": "https://www.w3.org/2019/wot/td#",
      "dpv": "https://w3id.org/dpv#",
      "schema": "http://schema.org/",
      "owl": "http://www.w3.org/2002/07/owl#"
    }
  });

  return {
    data: {
      ...params.data,
      id: params.data["@id"]
    },
  };
}

export async function getMany(params: GetManyParams) {
  const assets = await Promise.all(params.ids.map((id: any) => fetchAsset(id)));
  return {
    data: assets.map((asset: any) => ({
      ...asset,
      id: asset["@id"],
    })),
  };
}
