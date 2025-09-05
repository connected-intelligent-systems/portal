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
  parseContractNegotiationFromJsonLd,
  parseContractNegotiationFromJsonLdArray,
} from "../transformers/contractNegotiationTransformers";

const frame = {
  "@context": {
    "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
  },
  "@type": "ContractNegotiation",
};

export async function getList(params: GetListParams) {
  const { page, perPage } = params.pagination || { page: 1, perPage: 10 };
  const response = await httpClient(
    `/api/management/v3/contractnegotiations/request`,
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

  const contractNegotiations = response.json;
  const framedContractNegotiations = await compactJsonLdArray(
    contractNegotiations,
    frame
  );
  const cleanNegotiations = await parseContractNegotiationFromJsonLdArray(
    framedContractNegotiations
  );

  return {
    data: cleanNegotiations,
    total: cleanNegotiations.length,
  };
}

export async function getOne(params: GetOneParams) {
  const response = await httpClient(
    `/api/management/v3/contractnegotiations/${params.id}`
  );
  const contractNegotiation = response.json;
  const framedContractNegotiation = await compactJsonLd(
    contractNegotiation,
    frame
  );
  const cleanNegotiation = await parseContractNegotiationFromJsonLd(
    framedContractNegotiation
  );

  return {
    data: cleanNegotiation,
  };
}

export async function remove(params: DeleteParams) {
  await httpClient(`/api/management/v3/contractnegotiations/${params.id}`, {
    method: "DELETE",
  });
  return {
    data: {
      id: params.id,
    },
  };
}

export async function create(params: CreateParams) {
  const framedContractNegotiation = await compactJsonLd(params.data, frame);
  const response = await httpClient(`/api/management/v3/contractnegotiations`, {
    method: "POST",
    body: JSON.stringify(framedContractNegotiation),
  });
  const cleanNegotiation = await parseContractNegotiationFromJsonLd(
    response.json
  );
  return {
    data: cleanNegotiation,
  };
}

export async function update(params: UpdateParams) {
  const framedContractNegotiation = await compactJsonLd(params.data, frame);
  await httpClient(`/api/management/v3/contractnegotiations`, {
    method: "PUT",
    body: JSON.stringify(framedContractNegotiation),
  });
  const cleanNegotiation = await parseContractNegotiationFromJsonLd(
    params.data
  );
  return {
    data: cleanNegotiation,
  };
}

export async function getMany(params: GetManyParams) {
  const contractNegotiations = await Promise.all(
    params.ids.map((id: any) =>
      httpClient(`/api/management/v3/contractnegotiations/${id}`).then(
        (res) => res.json
      )
    )
  );
  const framedContractNegotiations = await compactJsonLdArray(
    contractNegotiations,
    frame
  );
  const cleanNegotiations = await parseContractNegotiationFromJsonLdArray(
    framedContractNegotiations
  );
  return {
    data: cleanNegotiations,
  };
}
