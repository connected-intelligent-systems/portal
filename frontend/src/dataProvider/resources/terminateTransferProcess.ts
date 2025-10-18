import { CreateParams } from "react-admin";
import { httpClient } from "../httpClient";
import {
  transformToJsonLd,
  parseTerminateTransferProcessFromJsonLd,
} from "../transformers/terminateTransferProcessTransformers";

export async function create(params: CreateParams) {
  const payload = transformToJsonLd({
    reason: params.data.reason,
  });

  const response = await httpClient(
    `/api/management/v3/transferprocesses/${params.data.id}/terminate`,
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
        transferId: params.data.id,
        reason: params.data.reason || "",
        state: "TERMINATED",
        type: "TerminateTransfer",
        createdAt: new Date().toISOString(),
      },
    };
  }

  const cleanData = await parseTerminateTransferProcessFromJsonLd(
    response.json
  );

  return {
    data: cleanData,
  };
}
