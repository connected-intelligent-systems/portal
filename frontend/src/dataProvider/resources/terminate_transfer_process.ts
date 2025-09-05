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
  parseTerminateTransferProcessFromJsonLd,
  parseTerminateTransferProcessFromJsonLdArray,
} from "../transformers/terminateTransferProcessTransformers";

const frame = {
  "@context": {
    "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
  },
  "@type": "TerminateTransferProcess",
};

export async function getList(params: GetListParams) {
  const response = await httpClient(
    `/api/management/v3/terminatetransferprocess/request`,
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

  const terminations = response.json;
  const framedTerminations = await compactJsonLdArray(terminations, frame);
  const cleanData = await parseTerminateTransferProcessFromJsonLdArray(
    framedTerminations
  );

  return {
    data: cleanData,
    total: cleanData.length,
  };
}

export async function getOne(params: GetOneParams) {
  const response = await httpClient(
    `/api/management/v3/terminatetransferprocess/${params.id}`
  );
  const termination = response.json;
  const framedTermination = await compactJsonLd(termination, frame);
  const cleanData = await parseTerminateTransferProcessFromJsonLd(
    framedTermination
  );

  return {
    data: cleanData,
  };
}

export async function remove(params: DeleteParams) {
  await httpClient(`/api/management/v3/terminatetransferprocess/${params.id}`, {
    method: "DELETE",
  });
  return {
    data: {
      id: params.id,
    },
  };
}

export async function create(params: CreateParams) {
  const framedTermination = await compactJsonLd(params.data, frame);
  const response = await httpClient(
    `/api/management/v3/terminatetransferprocess`,
    {
      method: "POST",
      body: JSON.stringify(framedTermination),
    }
  );
  const cleanData = await parseTerminateTransferProcessFromJsonLd(
    response.json
  );
  return {
    data: cleanData,
  };
}

export async function update(params: UpdateParams) {
  const framedTermination = await compactJsonLd(params.data, frame);
  await httpClient(`/api/management/v3/terminatetransferprocess`, {
    method: "PUT",
    body: JSON.stringify(framedTermination),
  });
  const cleanData = await parseTerminateTransferProcessFromJsonLd(params.data);
  return {
    data: cleanData,
  };
}

export async function getMany(params: GetManyParams) {
  const terminations = await Promise.all(
    params.ids.map((id: any) =>
      httpClient(`/api/management/v3/terminatetransferprocess/${id}`).then(
        (res) => res.json
      )
    )
  );
  const framedTerminations = await compactJsonLdArray(terminations, frame);
  const cleanData = await parseTerminateTransferProcessFromJsonLdArray(
    framedTerminations
  );
  return {
    data: cleanData,
  };
}
