import {
  GetListParams,
  GetOneParams,
  DeleteParams,
  CreateParams,
  UpdateParams,
  GetManyParams,
} from "react-admin";
import { httpClient } from "../../shared/httpClient";
import { buildQuerySpec } from "../../shared/helpers";
import {
  parsePolicyFromJsonLd,
  parsePolicyFromJsonLdArray,
  serializePolicyToJsonLd,
} from "./transformer";

export async function getList(params: GetListParams) {
  const { page = 1, perPage = 10 } = params.pagination || {};
  const querySpec = buildQuerySpec(params);
  const response = await httpClient(
    `/api/management/v3/policydefinitions/request`,
    {
      method: "POST",
      body: JSON.stringify(querySpec),
    }
  );

  const policies = response.json;
  const cleanPolicies = await parsePolicyFromJsonLdArray(policies);

  return {
    data: cleanPolicies,
    pageInfo: {
      hasNextPage: policies.length === perPage,
      hasPreviousPage: page > 1,
    },
  };
}

export async function getOne(params: GetOneParams) {
  const response = await httpClient(
    `/api/management/v3/policydefinitions/${params.id}`
  );
  const policy = response.json;
  const cleanPolicy = await parsePolicyFromJsonLd(policy);

  return {
    data: {
      ...cleanPolicy,
      raw: policy,
    },
  };
}

export async function remove(params: DeleteParams) {
  await httpClient(`/api/management/v3/policydefinitions/${params.id}`, {
    method: "DELETE",
  });
  return {
    data: {
      id: params.id,
    },
  };
}

export async function create(params: CreateParams) {
  const jsonLdPolicy = await serializePolicyToJsonLd(params.data);
  const response = await httpClient(`/api/management/v3/policydefinitions`, {
    method: "POST",
    body: JSON.stringify(jsonLdPolicy),
  });
  const cleanPolicy = await parsePolicyFromJsonLd(response.json);

  return {
    data: cleanPolicy,
  };
}

export async function update(params: UpdateParams) {
  const jsonLdPolicy = await serializePolicyToJsonLd(params.data);

  await httpClient(`/api/management/v3/policydefinitions/${params.id}`, {
    method: "PUT",
    body: JSON.stringify(jsonLdPolicy),
  });

  return {
    data: {
      ...params.data,
      id: params.id,
    },
  };
}

export async function getMany(params: GetManyParams) {
  const policies = await Promise.all(
    params.ids.map((id: any) =>
      httpClient(`/api/management/v3/policydefinitions/${id}`).then(
        (res) => res.json
      )
    )
  );

  const cleanPolicies = await parsePolicyFromJsonLdArray(policies);

  return {
    data: cleanPolicies,
  };
}
