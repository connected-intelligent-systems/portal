import {
  GetListParams,
  GetOneParams,
  DeleteParams,
  CreateParams,
  UpdateParams,
  GetManyParams,
} from "react-admin";
import { httpClient } from "../../shared/httpClient";
import {
  buildQuerySpec,
  compactJsonLd,
  compactJsonLdArray,
} from "../../shared/helpers";
import {
  parseTransferProcessFromJsonLd,
  parseTransferProcessFromJsonLdArray,
} from "./transformer";

const frame = {
  "@context": {
    "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
  },
  "@type": "TransferProcess",
};

// https://raw.githubusercontent.com/eclipse-edc/Connector/refs/heads/main/spi/control-plane/transfer-spi/src/main/java/org/eclipse/edc/connector/controlplane/transfer/spi/types/TransferProcessStates.java
const mapTransferProcessState = (state: string) => {
  switch (state) {
    case "INITIAL":
      return 100;
    case "PROVISIONING":
      return 200;
    case "PROVISIONING_REQUESTED":
      return 250;
    case "PROVISIONED":
      return 300;
    case "REQUESTING":
      return 400;
    case "REQUESTED":
      return 500;
    case "STARTING":
      return 550;
    case "STARTUP_REQUESTED":
      return 570;
    case "STARTED":
      return 600;
    case "SUSPENDING":
      return 650;
    case "SUSPENDING_REQUESTED":
      return 675;
    case "SUSPENDED":
      return 700;
    case "RESUMING":
      return 720;
    case "RESUMED":
      return 725;
    case "COMPLETING":
      return 750;
    case "COMPLETING_REQUESTED":
      return 775;
    case "COMPLETED":
      return 800;
    case "TERMINATING":
      return 825;
    case "TERMINATING_REQUESTED":
      return 840;
    case "TERMINATED":
      return 850;
    case "DEPROVISIONING":
      return 900;
    case "DEPROVISIONING_REQUESTED":
      return 950;
    case "DEPROVISIONED":
      return 1000;
    default:
      return null;
  }
};

const filterMapping = (key: string, value: any) => {
  switch (key) {
    case "transferDirection":
      return {
        field: "type",
        operator: "=",
        value,
      };
    case "transferType":
      return {
        field: "transferType",
        operator: "=",
        value,
      };
    case "state":
      return {
        field: "state",
        operator: "=",
        value: mapTransferProcessState(value),
      };
    default:
      return { field: key, operator: "=", value };
  }
};

export async function getList(params: GetListParams) {
  const { page = 1, perPage = 10 } = params.pagination || {};
  const querySpec = buildQuerySpec(params, filterMapping);
  const response = await httpClient(
    `/api/management/v3/transferprocesses/request`,
    {
      method: "POST",
      body: JSON.stringify(querySpec),
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
    pageInfo: {
      hasNextPage: transferProcesses.length === perPage,
      hasPreviousPage: page > 1,
    },
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
  const requestDto: any = {
    "@context": {
      "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
    },
    "@type": "TransferRequestDto",
    counterPartyAddress: params.data.counterPartyAddress,
    contractId: params.data.contractId,
    assetId: params.data.assetId,
    protocol: params.data.protocol || "dataspace-protocol-http",
    transferType: params.data.transferType,
  };

  // Add dataDestination if provided (for PUSH transfers)
  if (params.data.dataDestination) {
    requestDto.dataDestination = params.data.dataDestination;
  }

  const response = await httpClient(`/api/management/v3/transferprocesses`, {
    method: "POST",
    body: JSON.stringify(requestDto),
  });

  const idResponse = response.json;

  return {
    data: {
      id: idResponse["@id"],
      createdAt: idResponse.createdAt
        ? new Date(idResponse.createdAt).toISOString()
        : new Date().toISOString(),
    },
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
