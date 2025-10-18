import { CreateParams } from "react-admin";
import { httpClient } from "../httpClient";
import {
  transformToJsonLd,
  parseTerminateContractNegotiationFromJsonLd,
} from "../transformers/terminateContractNegotiationTransformers";

export async function create(params: CreateParams) {
  const payload = transformToJsonLd({
    id: params.data.id,
    reason: params.data.reason,
  });

  const response = await httpClient(
    `/api/management/v3/contractnegotiations/${params.data.id}/terminate`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );

  // 204 No Content response means success but no body
  if (!response.json || Object.keys(response.json).length === 0) {
    return {
      data: {
        id: params.data.id,
        negotiationId: params.data.id,
        reason: params.data.reason || "",
        state: "TERMINATED",
        type: "TerminateNegotiation",
        createdAt: new Date().toISOString(),
      },
    };
  }

  const cleanData = await parseTerminateContractNegotiationFromJsonLd(
    response.json
  );

  return {
    data: cleanData,
  };
}
