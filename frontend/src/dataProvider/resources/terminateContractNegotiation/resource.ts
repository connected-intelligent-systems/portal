import { CreateParams } from "react-admin";
import { httpClient } from "../../shared/httpClient";

export async function create(params: CreateParams) {
  const payload = {
    "@context": {
      "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
    },
    "@type": "TerminateNegotiation",
    "@id": params.data.id,
    reason: params.data.reason,
  };

  const response = await httpClient(
    `/api/management/v3/contractnegotiations/${params.data.id}/terminate`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );

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
