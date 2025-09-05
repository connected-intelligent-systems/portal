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
  parseDataRequestFromJsonLd,
  parseDataRequestFromJsonLdArray,
} from "../transformers/dataRequestTransformers";

const frame = {
  "@context": {
    "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
  },
  "@type": "DataRequest",
};

export async function getList(params: GetListParams) {
  const response = await httpClient(`/api/management/v3/datarequests/request`, {
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
  });

  const dataRequests = response.json;
  const framedDataRequests = await compactJsonLdArray(dataRequests, frame);
  const cleanData = await parseDataRequestFromJsonLdArray(framedDataRequests);

  return {
    data: cleanData,
    total: cleanData.length,
  };
}

export async function getOne(params: GetOneParams) {
  const response = await httpClient(
    `/api/management/v3/datarequests/${params.id}`
  );
  const dataRequests = response.json;
  const framedDataRequests = await compactJsonLd(dataRequests, frame);
  const cleanData = await parseDataRequestFromJsonLd(framedDataRequests);

  return {
    data: cleanData,
  };
}

export async function remove(params: DeleteParams) {
  await httpClient(`/api/management/v3/datarequests/${params.id}`, {
    method: "DELETE",
  });
  return {
    data: {
      id: params.id,
    },
  };
}

export async function create(params: CreateParams) {
  const framedDataRequests = await compactJsonLd(params.data, frame);
  const response = await httpClient(`/api/management/v3/datarequests`, {
    method: "POST",
    body: JSON.stringify(framedDataRequests),
  });
  const cleanData = await parseDataRequestFromJsonLd(response.json);
  return {
    data: cleanData,
  };
}

export async function update(params: UpdateParams) {
  const framedDataRequests = await compactJsonLd(params.data, frame);
  await httpClient(`/api/management/v3/datarequests`, {
    method: "PUT",
    body: JSON.stringify(framedDataRequests),
  });
  const cleanData = await parseDataRequestFromJsonLd(params.data);
  return {
    data: cleanData,
  };
}

export async function getMany(params: GetManyParams) {
  const dataRequests = await Promise.all(
    params.ids.map((id: any) =>
      httpClient(`/api/management/v3/datarequests/${id}`).then(
        (res) => res.json
      )
    )
  );
  const framedDataRequests = await compactJsonLdArray(dataRequests, frame);
  const cleanData = await parseDataRequestFromJsonLdArray(framedDataRequests);
  return {
    data: cleanData,
  };
}
