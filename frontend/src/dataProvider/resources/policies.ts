import {
  GetListParams,
  GetOneParams,
  DeleteParams,
  CreateParams,
  UpdateParams,
  GetManyParams,
} from "react-admin";
import { httpClient } from "../httpClient";
import {
  parsePolicyFromJsonLd,
  parsePolicyFromJsonLdArray,
  serializePolicyToJsonLd,
} from "../transformers/policyTransformers";

export async function getList(params: GetListParams) {
  const { page, perPage } = params.pagination || { page: 1, perPage: 10 };
  const response = await httpClient(
    `/api/management/v3/policydefinitions/request`,
    {
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
    }
  );

  const policies = response.json;

  // Transform JSON-LD policies to clean Policy objects directly
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

  // Transform JSON-LD policy to clean Policy object directly
  const cleanPolicy = await parsePolicyFromJsonLd(policy);

  return {
    data: cleanPolicy,
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
  // Transform clean Policy data to JSON-LD format
  const jsonLdPolicy = await serializePolicyToJsonLd(params.data);

  const response = await httpClient(`/api/management/v3/policydefinitions`, {
    method: "POST",
    body: JSON.stringify(jsonLdPolicy),
  });

  // Transform response back to clean Policy object
  const cleanPolicy = await parsePolicyFromJsonLd(response.json);

  return {
    data: cleanPolicy,
  };
}

export async function update(params: UpdateParams) {
  // Transform clean Policy data to JSON-LD format
  const jsonLdPolicy = await serializePolicyToJsonLd(params.data);

  await httpClient(`/api/management/v3/policydefinitions/${params.id}`, {
    method: "PUT",
    body: JSON.stringify(jsonLdPolicy),
  });

  // Return the clean Policy data with the ID
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

  // Transform JSON-LD policies to clean Policy objects directly
  const cleanPolicies = await parsePolicyFromJsonLdArray(policies);

  return {
    data: cleanPolicies,
  };
}
