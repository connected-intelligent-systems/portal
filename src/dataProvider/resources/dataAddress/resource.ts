import { GetOneParams, GetManyParams } from "react-admin";
import { httpClient } from "../../shared/httpClient";

export async function getOne(params: GetOneParams) {
  const response = await httpClient(
    `/api/management/v3/edrs/${params.id}/dataaddress`
  );
  return {
    data: { id: params.id, ...response.json },
  };
}

export async function getMany(params: GetManyParams) {
  const dataAddresses = await Promise.all(
    params.ids.map((id: any) =>
      httpClient(`/api/management/v3/edrs/${id}/dataaddress`).then((res) => ({
        id,
        ...res.json,
      }))
    )
  );
  return {
    data: dataAddresses,
  };
}
