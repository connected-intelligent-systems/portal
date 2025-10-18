import { GetOneParams } from "react-admin";
import { httpClient } from "../httpClient";
import { compactJsonLd } from "../helpers";
import { parseContractNegotiationFromJsonLd } from "../transformers/contractNegotiationTransformers";

const frame = {
  "@context": {
    "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
  },
  "@type": "ContractNegotiation",
};

export async function getOne(params: GetOneParams) {
  const response = await httpClient(
    `/api/management/v3/contractagreements/${params.id}/negotiation`
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
