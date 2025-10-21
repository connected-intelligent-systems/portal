import {
  GetListParams,
  GetOneParams,
  DeleteParams,
  CreateParams,
  UpdateParams,
  GetManyParams,
  GetManyReferenceParams,
} from "react-admin";
import { httpClient } from "../../shared/httpClient";
import {
  buildQuerySpec,
  compactJsonLd,
  compactJsonLdArray,
} from "../../shared/helpers";
import {
  parseContractNegotiationFromJsonLd,
  parseContractNegotiationFromJsonLdArray,
  serializeContractNegotiationToJsonLd,
} from "./transformer";

const frame = {
  "@context": {
    "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
  },
  "@type": "ContractNegotiation",
};

// https://raw.githubusercontent.com/eclipse-edc/Connector/refs/heads/main/spi/control-plane/contract-spi/src/main/java/org/eclipse/edc/connector/controlplane/contract/spi/types/negotiation/ContractNegotiationStates.java
const mapContractNegotiationState = (state: string) => {
  switch (state) {
    case "INITIAL":
      return 50;
    case "REQUESTING":
      return 100;
    case "REQUESTED":
      return 200;
    case "OFFERING":
      return 300;
    case "OFFERED":
      return 400;
    case "ACCEPTING":
      return 700;
    case "ACCEPTED":
      return 800;
    case "AGREEING":
      return 825;
    case "AGREED":
      return 850;
    case "VERIFYING":
      return 1050;
    case "VERIFIED":
      return 1100;
    case "FINALIZING":
      return 1150;
    case "FINALIZED":
      return 1200;
    case "TERMINATING":
      return 1300;
    case "TERMINATED":
      return 1400;
    default:
      return null;
  }
};

const filterMapping = (key: string, value: any) => {
  switch (key) {
    case "state":
      return {
        field: "state",
        operator: "=",
        value: mapContractNegotiationState(value),
      };
    default:
      return { field: key, operator: "=", value };
  }
};

export async function getList(params: GetListParams) {
  const { page = 1, perPage = 10 } = params.pagination || {};
  const querySpec = buildQuerySpec(params, filterMapping);
  const response = await httpClient(
    `/api/management/v3/contractnegotiations/request`,
    {
      method: "POST",
      body: JSON.stringify(querySpec),
    }
  );

  const contractNegotiations = response.json;
  const framedContractNegotiations = await compactJsonLdArray(
    contractNegotiations,
    frame
  );
  const cleanNegotiations = await parseContractNegotiationFromJsonLdArray(
    framedContractNegotiations
  );

  return {
    data: cleanNegotiations,
    pageInfo: {
      hasNextPage: contractNegotiations.length === perPage,
      hasPreviousPage: page > 1,
    },
  };
}

export async function getOne(params: GetOneParams) {
  const response = await httpClient(
    `/api/management/v3/contractnegotiations/${params.id}`
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

export async function remove(params: DeleteParams) {
  await httpClient(`/api/management/v3/contractnegotiations/${params.id}`, {
    method: "DELETE",
  });
  return {
    data: {
      id: params.id,
    },
  };
}

export async function create(params: CreateParams) {
  const jsonLdNegotiation = await serializeContractNegotiationToJsonLd(
    params.data
  );
  const response = await httpClient(`/api/management/v3/contractnegotiations`, {
    method: "POST",
    body: JSON.stringify(jsonLdNegotiation),
  });

  const responseId = response.json["@id"];

  if (responseId) {
    const fullNegotiation = await httpClient(
      `/api/management/v3/contractnegotiations/${responseId}`
    );
    const framedResponse = await compactJsonLd(fullNegotiation.json, frame);
    const cleanNegotiation = await parseContractNegotiationFromJsonLd(
      framedResponse
    );
    return {
      data: cleanNegotiation,
    };
  }

  return {
    data: {
      id: responseId || response.json["@id"],
    },
  };
}

export async function update(params: UpdateParams) {
  const framedContractNegotiation = await compactJsonLd(params.data, frame);
  await httpClient(`/api/management/v3/contractnegotiations`, {
    method: "PUT",
    body: JSON.stringify(framedContractNegotiation),
  });
  const cleanNegotiation = await parseContractNegotiationFromJsonLd(
    params.data
  );
  return {
    data: cleanNegotiation,
  };
}

export async function getMany(params: GetManyParams) {
  const contractNegotiations = await Promise.all(
    params.ids.map((id: any) =>
      httpClient(`/api/management/v3/contractnegotiations/${id}`).then(
        (res) => res.json
      )
    )
  );
  const framedContractNegotiations = await compactJsonLdArray(
    contractNegotiations,
    frame
  );
  const cleanNegotiations = await parseContractNegotiationFromJsonLdArray(
    framedContractNegotiations
  );
  return {
    data: cleanNegotiations,
  };
}

export async function getManyReference(params: GetManyReferenceParams) {
  const { page, perPage } = params.pagination || { page: 1, perPage: 10 };
  const response = await httpClient(
    `/api/management/v3/contractnegotiations/request`,
    {
      method: "POST",
      body: JSON.stringify({
        "@context": {
          "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
        },
        "@type": "QuerySpec",
        offset: (page - 1) * perPage,
        limit: perPage,
        filterExpression: [
          {
            operandLeft: params.target,
            operator: "=",
            operandRight: params.id,
          },
        ],
      }),
    }
  );

  const contractNegotiations = response.json;
  const framedContractNegotiations = await compactJsonLdArray(
    contractNegotiations,
    frame
  );
  const cleanNegotiations = await parseContractNegotiationFromJsonLdArray(
    framedContractNegotiations
  );

  return {
    data: cleanNegotiations,
    total: cleanNegotiations.length,
  };
}
