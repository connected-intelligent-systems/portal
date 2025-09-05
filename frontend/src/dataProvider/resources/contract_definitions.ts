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
  parseContractDefinitionFromJsonLd,
  parseContractDefinitionFromJsonLdArray,
  serializeContractDefinitionToJsonLd,
} from "../transformers/contractDefinitionTransformers";

export async function getList(params: GetListParams) {
  const { page, perPage } = params.pagination || { page: 1, perPage: 10 };
  const response = await httpClient(
    `/api/management/v3/contractdefinitions/request`,
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

  const contractDefinitions = response.json;

  // Transform JSON-LD contract definitions to clean ContractDefinition objects
  const cleanContractDefinitions = await parseContractDefinitionFromJsonLdArray(
    contractDefinitions
  );

  return {
    data: cleanContractDefinitions,
    total: cleanContractDefinitions.length,
  };
}

export async function getOne(params: GetOneParams) {
  const response = await httpClient(
    `/api/management/v3/contractdefinitions/${params.id}`
  );
  const contractDefinition = response.json;

  // Transform JSON-LD contract definition to clean ContractDefinition object
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
  // Transform clean ContractDefinition data to JSON-LD format
  const jsonLdContractDefinition = await serializeContractDefinitionToJsonLd(
    params.data
  );

  const response = await httpClient(`/api/management/v3/contractdefinitions`, {
    method: "POST",
    body: JSON.stringify(jsonLdContractDefinition),
  });

  // Transform response back to clean ContractDefinition object
  const cleanContractDefinition = await parseContractDefinitionFromJsonLd(
    response.json
  );

  return {
    data: cleanContractDefinition,
  };
}

export async function update(params: UpdateParams) {
  // Transform clean ContractDefinition data to JSON-LD format
  const jsonLdContractDefinition = await serializeContractDefinitionToJsonLd(
    params.data
  );

  await httpClient(`/api/management/v3/contractdefinitions`, {
    method: "PUT",
    body: JSON.stringify(jsonLdContractDefinition),
  });

  // Return the clean ContractDefinition data with the ID
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

  // Transform JSON-LD contract definitions to clean ContractDefinition objects
  const cleanContractDefinitions = await parseContractDefinitionFromJsonLdArray(
    contractDefinitions
  );

  return {
    data: cleanContractDefinitions,
  };
}
