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
  parseTransferProcessFromJsonLd,
  parseTransferProcessFromJsonLdArray,
} from "../transformers/transferProcessTransformers";

const frame = {
  "@context": {
    "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
  },
  "@type": "TransferProcess",
};

export async function getList(params: GetListParams) {
  const response = await httpClient(
    `/api/management/v3/transferprocesses/request`,
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

  const transferProcesses = response.json;
  const framedTransferProcesses = await compactJsonLdArray(
    transferProcesses,
    frame
  );
  const cleanData = await parseTransferProcessFromJsonLdArray(
    framedTransferProcesses
  );

  return {
    data: cleanData,
    total: cleanData.length,
  };
}

export async function getOne(params: GetOneParams) {
  const response = await httpClient(
    `/api/management/v3/transferprocesses/${params.id}`
  );
  const transferProcess = response.json;
  const framedTransferProcess = await compactJsonLd(transferProcess, frame);
  const cleanData = await parseTransferProcessFromJsonLd(framedTransferProcess);

  return {
    data: cleanData,
  };
}

export async function remove(params: DeleteParams) {
  await httpClient(`/api/management/v3/transferprocesses/${params.id}`, {
    method: "DELETE",
  });
  return {
    data: {
      id: params.id,
    },
  };
}

export async function create(params: CreateParams) {
  const framedTransferProcess = await compactJsonLd(params.data, frame);
  const response = await httpClient(`/api/management/v3/transferprocesses`, {
    method: "POST",
    body: JSON.stringify(framedTransferProcess),
  });
  const cleanData = await parseTransferProcessFromJsonLd(response.json);
  return {
    data: cleanData,
  };
}

export async function update(params: UpdateParams) {
  const framedTransferProcess = await compactJsonLd(params.data, frame);
  await httpClient(`/api/management/v3/transferprocesses`, {
    method: "PUT",
    body: JSON.stringify(framedTransferProcess),
  });
  const cleanData = await parseTransferProcessFromJsonLd(params.data);
  return {
    data: cleanData,
  };
}

export async function getMany(params: GetManyParams) {
  const transferProcesses = await Promise.all(
    params.ids.map((id: any) =>
      httpClient(`/api/management/v3/transferprocesses/${id}`).then(
        (res) => res.json
      )
    )
  );
  const framedTransferProcesses = await compactJsonLdArray(
    transferProcesses,
    frame
  );
  const cleanData = await parseTransferProcessFromJsonLdArray(
    framedTransferProcesses
  );
  return {
    data: cleanData,
  };
}
