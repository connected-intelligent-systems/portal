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
  parseDataConsumerPullFromJsonLd,
  parseDataConsumerPullFromJsonLdArray,
} from "../transformers/dataConsumerPullTransformers";

const frame = {
  "@context": {
    "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
  },
  "@type": "DataConsumerPull",
};

export async function getList(params: GetListParams) {
  const response = await httpClient(
    `/api/management/v3/dataconsumerpull/request`,
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

  const dataConsumerPull = response.json;
  const framedDataConsumerPull = await compactJsonLdArray(
    dataConsumerPull,
    frame
  );
  const cleanData = await parseDataConsumerPullFromJsonLdArray(
    framedDataConsumerPull
  );

  return {
    data: cleanData,
    total: cleanData.length,
  };
}

export async function getOne(params: GetOneParams) {
  const response = await httpClient(
    `/api/management/v3/dataconsumerpull/${params.id}`
  );
  const dataConsumerPull = response.json;
  const framedDataConsumerPull = await compactJsonLd(dataConsumerPull, frame);
  const cleanData = await parseDataConsumerPullFromJsonLd(
    framedDataConsumerPull
  );

  return {
    data: cleanData,
  };
}

export async function remove(params: DeleteParams) {
  await httpClient(`/api/management/v3/dataconsumerpull/${params.id}`, {
    method: "DELETE",
  });
  return {
    data: {
      id: params.id,
    },
  };
}

export async function create(params: CreateParams) {
  const framedDataConsumerPull = await compactJsonLd(params.data, frame);
  const response = await httpClient(`/api/management/v3/dataconsumerpull`, {
    method: "POST",
    body: JSON.stringify(framedDataConsumerPull),
  });
  const cleanData = await parseDataConsumerPullFromJsonLd(response.json);
  return {
    data: cleanData,
  };
}

export async function update(params: UpdateParams) {
  const framedDataConsumerPull = await compactJsonLd(params.data, frame);
  await httpClient(`/api/management/v3/dataconsumerpull`, {
    method: "PUT",
    body: JSON.stringify(framedDataConsumerPull),
  });
  const cleanData = await parseDataConsumerPullFromJsonLd(params.data);
  return {
    data: cleanData,
  };
}

export async function getMany(params: GetManyParams) {
  const dataConsumerPull = await Promise.all(
    params.ids.map((id: any) =>
      httpClient(`/api/management/v3/dataconsumerpull/${id}`).then(
        (res) => res.json
      )
    )
  );
  const framedDataConsumerPull = await compactJsonLdArray(
    dataConsumerPull,
    frame
  );
  const cleanData = await parseDataConsumerPullFromJsonLdArray(
    framedDataConsumerPull
  );
  return {
    data: cleanData,
  };
}
