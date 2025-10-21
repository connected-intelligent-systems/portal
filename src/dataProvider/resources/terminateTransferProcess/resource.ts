import { CreateParams } from "react-admin";
import { httpClient } from "../../shared/httpClient";

export async function create(params: CreateParams) {
  const payload = {
    "@context": {
      "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
    },
    "@type": "TerminateTransfer",
    reason: params.data.reason,
  };

  await httpClient(
    `/api/management/v3/transferprocesses/${params.data.id}/terminate`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );

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
