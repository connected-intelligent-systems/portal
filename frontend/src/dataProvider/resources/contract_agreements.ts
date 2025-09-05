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
  parseContractAgreementFromJsonLd,
  parseContractAgreementFromJsonLdArray,
} from "../transformers/contractAgreementTransformers";

const frame = {
  "@context": {
    "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
  },
  "@type": "ContractAgreement",
};

export async function getList(params: GetListParams) {
  const response = await httpClient(
    `/api/management/v3/contractagreements/request`,
    {
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
    total: cleanAgreements.length,
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
