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
  parseContractDefinitionFromJsonLd,
  parseContractDefinitionFromJsonLdArray,
  serializeContractDefinitionToJsonLd,
} from "./transformer";

export async function getList(params: GetListParams) {
  const { page = 1, perPage = 10 } = params.pagination || {};
  const querySpec = buildQuerySpec(params);
  const response = await httpClient(
    `/api/management/v3/contractdefinitions/request`,
    {
      method: "POST",
      body: JSON.stringify(querySpec),
    }
  );

  const contractDefinitions = response.json;
  const cleanContractDefinitions = await parseContractDefinitionFromJsonLdArray(
    contractDefinitions
  );

  return {
    data: cleanContractDefinitions,
    pageInfo: {
      hasNextPage: contractDefinitions.length === perPage,
      hasPreviousPage: page > 1,
    },
  };
}

export async function getOne(params: GetOneParams) {
  const response = await httpClient(
    `/api/management/v3/contractdefinitions/${params.id}`
  );
  const contractDefinition = response.json;
  const cleanContractDefinition = await parseContractDefinitionFromJsonLd(
    contractDefinition
  );

  return {
    data: cleanContractDefinition,
  };
}

export async function remove(params: DeleteParams) {
  await httpClient(`/api/management/v3/contractdefinitions/${params.id}`, {
    method: "DELETE",
  });
  return {
    data: {
      id: params.id,
    },
  };
}

export async function create(params: CreateParams) {
  const jsonLdContractDefinition = await serializeContractDefinitionToJsonLd(
    params.data
  );

  const response = await httpClient(`/api/management/v3/contractdefinitions`, {
    method: "POST",
    body: JSON.stringify(jsonLdContractDefinition),
  });

  const cleanContractDefinition = await parseContractDefinitionFromJsonLd(
    response.json
  );

  return {
    data: cleanContractDefinition,
  };
}

export async function update(params: UpdateParams) {
  const jsonLdContractDefinition = await serializeContractDefinitionToJsonLd(
    params.data
  );

  await httpClient(`/api/management/v3/contractdefinitions`, {
    method: "PUT",
    body: JSON.stringify(jsonLdContractDefinition),
  });

  return {
    data: {
      ...params.data,
      id: params.id,
    },
  };
}

export async function getMany(params: GetManyParams) {
  const contractDefinitions = await Promise.all(
    params.ids.map((id: any) =>
      httpClient(`/api/management/v3/contractdefinitions/${id}`).then(
        (res) => res.json
      )
    )
  );

  const cleanContractDefinitions = await parseContractDefinitionFromJsonLdArray(
    contractDefinitions
  );

  return {
    data: cleanContractDefinitions,
  };
}
