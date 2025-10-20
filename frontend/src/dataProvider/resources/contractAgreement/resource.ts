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
  buildQuerySpec,
  compactJsonLd,
  compactJsonLdArray,
} from "../../shared/helpers";
import {
  parseContractAgreementFromJsonLd,
  parseContractAgreementFromJsonLdArray,
} from "./transformer";
import { frame, filterMapping } from "./schema";

export async function getList(params: GetListParams) {
  const { page = 1, perPage = 10 } = params.pagination || {};
  const querySpec = buildQuerySpec(params, filterMapping);
  const response = await httpClient(
    `/api/management/v3/contractagreements/request`,
    {
      method: "POST",
      body: JSON.stringify(querySpec),
    }
  );

  const contractAgreements = response.json;
  const framedContractAgreements = await compactJsonLdArray(
    contractAgreements,
    frame
  );
  const cleanAgreements = await parseContractAgreementFromJsonLdArray(
    framedContractAgreements
  );

  return {
    data: cleanAgreements,
    pageInfo: {
      hasNextPage: contractAgreements.length === perPage,
      hasPreviousPage: page > 1,
    },
  };
}

export async function getOne(params: GetOneParams) {
  const response = await httpClient(
    `/api/management/v3/contractagreements/${params.id}`
  );
  const contractAgreement = response.json;
  const framedContractAgreement = await compactJsonLd(contractAgreement, frame);
  const cleanAgreement = await parseContractAgreementFromJsonLd(
    framedContractAgreement
  );

  return {
    data: cleanAgreement,
  };
}

export async function remove(params: DeleteParams) {
  await httpClient(`/api/management/v3/contractagreements/${params.id}`, {
    method: "DELETE",
  });
  return {
    data: {
      id: params.id,
    },
  };
}

export async function create(params: CreateParams) {
  const framedContractAgreement = await compactJsonLd(params.data, frame);
  const response = await httpClient(`/api/management/v3/contractagreements`, {
    method: "POST",
    body: JSON.stringify(framedContractAgreement),
  });
  const cleanAgreement = await parseContractAgreementFromJsonLd(response.json);
  return {
    data: cleanAgreement,
  };
}

export async function update(params: UpdateParams) {
  const framedContractAgreement = await compactJsonLd(params.data, frame);
  await httpClient(`/api/management/v3/contractagreements`, {
    method: "PUT",
    body: JSON.stringify(framedContractAgreement),
  });
  const cleanAgreement = await parseContractAgreementFromJsonLd(params.data);
  return {
    data: cleanAgreement,
  };
}

export async function getMany(params: GetManyParams) {
  const contractAgreements = await Promise.all(
    params.ids.map((id: any) =>
      httpClient(`/api/management/v3/contractagreements/${id}`).then(
        (res) => res.json
      )
    )
  );
  const framedContractAgreements = await compactJsonLdArray(
    contractAgreements,
    frame
  );
  const cleanAgreements = await parseContractAgreementFromJsonLdArray(
    framedContractAgreements
  );
  return {
    data: cleanAgreements,
  };
}
