import * as assets from "./resources/assets";
import * as policies from "./resources/policies";
import * as contractAgreements from "./resources/contractAgreements";
import * as contractDefinitions from "./resources/contractDefinitions";
import * as contractNegotiations from "./resources/contractNegotiations";
import * as catalogs from "./resources/catalogs";
import * as datasets from "./resources/datasets";
import * as transferProcesses from "./resources/transferProcesses";
import * as dataAddress from "./resources/dataAddress";
import * as terminateTransferProcess from "./resources/terminateTransferProcess";
import * as terminateContractNegotiation from "./resources/terminateContractNegotiation";
import * as contractAgreementNegotiation from "./resources/contractAgreementNegotiation";

const dataProvider = {
  getList: (resource: string, params: any) => {
    if (resource === "assets") {
      return assets.getList(params);
    } else if (resource === "policies") {
      return policies.getList(params);
    } else if (resource === "contractagreements") {
      return contractAgreements.getList(params);
    } else if (resource === "contractdefinitions") {
      return contractDefinitions.getList(params);
    } else if (resource === "contractnegotiations") {
      return contractNegotiations.getList(params);
    } else if (resource === "catalogs") {
      return catalogs.getList();
    } else if (resource === "transferprocesses") {
      return transferProcesses.getList(params);
    } else if (resource === "datarequests") {
      throw new Error("datarequests getList is not implemented");
    }
    throw new Error(`Unknown resource: ${resource}`);
  },
  getOne: (resource: string, params: any) => {
    if (resource === "assets") {
      return assets.getOne(params);
    } else if (resource === "policies") {
      return policies.getOne(params);
    } else if (resource === "contractagreements") {
      return contractAgreements.getOne(params);
    } else if (resource === "contractdefinitions") {
      return contractDefinitions.getOne(params);
    } else if (resource === "contractnegotiations") {
      return contractNegotiations.getOne(params);
    } else if (resource === "catalogs") {
      return catalogs.getOne(params);
    } else if (resource === "transferprocesses") {
      return transferProcesses.getOne(params);
    } else if (resource === "datarequests") {
      return dataAddress.getOne(params);
    } else if (resource === "datasets") {
      return datasets.getOne(params);
    } else if (resource === "contractagreementnegotiation") {
      return contractAgreementNegotiation.getOne(params);
    }
    throw new Error(`Unknown resource: ${resource}`);
  },
  getMany: (resource: string, params: any) => {
    if (resource === "assets") {
      return assets.getMany(params);
    } else if (resource === "policies") {
      return policies.getMany(params);
    } else if (resource === "contractagreements") {
      return contractAgreements.getMany(params);
    } else if (resource === "contractdefinitions") {
      return contractDefinitions.getMany(params);
    } else if (resource === "contractnegotiations") {
      return contractNegotiations.getMany(params);
    } else if (resource === "catalogs") {
      return catalogs.getMany();
    } else if (resource === "transferprocesses") {
      return transferProcesses.getMany(params);
    } else if (resource === "datarequests") {
      return dataAddress.getMany(params);
    } else if (resource === "datasets") {
      return datasets.getMany(params);
    }
    throw new Error(`Unknown resource: ${resource}`);
  },
  create: (resource: string, params: any) => {
    if (resource === "assets") {
      return assets.create(params);
    } else if (resource === "policies") {
      return policies.create(params);
    } else if (resource === "contractagreements") {
      return contractAgreements.create(params);
    } else if (resource === "contractdefinitions") {
      return contractDefinitions.create(params);
    } else if (resource === "contractnegotiations") {
      return contractNegotiations.create(params);
    } else if (resource === "catalogs") {
      return catalogs.create(params);
    } else if (resource === "transferprocesses") {
      return transferProcesses.create(params);
    } else if (resource === "datarequests") {
      throw new Error("datarequests create is not implemented");
    } else if (resource === "terminatetransferprocess") {
      return terminateTransferProcess.create(params);
    } else if (resource === "terminatecontractnegotiation") {
      return terminateContractNegotiation.create(params);
    }
    throw new Error(`Unknown resource: ${resource}`);
  },
  update: (resource: string, params: any) => {
    if (resource === "assets") {
      return assets.update(params);
    } else if (resource === "policies") {
      return policies.update(params);
    } else if (resource === "contractagreements") {
      return contractAgreements.update(params);
    } else if (resource === "contractdefinitions") {
      return contractDefinitions.update(params);
    } else if (resource === "contractnegotiations") {
      return contractNegotiations.update(params);
    } else if (resource === "catalogs") {
      return catalogs.update(params);
    } else if (resource === "transferprocesses") {
      return transferProcesses.update(params);
    } else if (resource === "datarequests") {
      throw new Error("datarequests update is not implemented");
    }
    throw new Error(`Unknown resource: ${resource}`);
  },
  updateMany: (resource: string, params: any) => {
    if (resource === "assets") {
      return Promise.all(
        params.ids.map((id: string) => assets.update({ ...params, id }))
      ).then((responses) => ({
        data: responses.map((response) => response.data.id),
      }));
    } else if (resource === "policies") {
      return Promise.all(
        params.ids.map((id: string) => policies.update({ ...params, id }))
      ).then((responses) => ({
        data: responses.map((response) => response.data.id),
      }));
    } else if (resource === "contractagreements") {
      return Promise.all(
        params.ids.map((id: string) =>
          contractAgreements.update({ ...params, id })
        )
      ).then((responses) => ({
        data: responses.map((response) => response.data.id),
      }));
    } else if (resource === "contractdefinitions") {
      return Promise.all(
        params.ids.map((id: string) =>
          contractDefinitions.update({ ...params, id })
        )
      ).then((responses) => ({
        data: responses.map((response) => response.data.id),
      }));
    } else if (resource === "contractnegotiations") {
      return Promise.all(
        params.ids.map((id: string) =>
          contractNegotiations.update({ ...params, id })
        )
      ).then((responses) => ({
        data: responses.map((response) => response.data.id),
      }));
    } else if (resource === "transferprocesses") {
      return Promise.all(
        params.ids.map((id: string) =>
          transferProcesses.update({ ...params, id })
        )
      ).then((responses) => ({
        data: responses.map((response) => response.data.id),
      }));
    } else if (resource === "datarequests") {
      return Promise.all(
        Promise.reject(new Error("datarequests updateMany is not implemented"))
      ).then((responses) => ({
        data: responses.map((response) => response.data.id),
      }));
    }
    throw new Error(`Unknown resource: ${resource}`);
  },
  delete: (resource: string, params: any) => {
    if (resource === "assets") {
      return assets.remove(params);
    } else if (resource === "policies") {
      return policies.remove(params);
    } else if (resource === "catalogs") {
      return catalogs.remove(params);
    } else if (resource === "contractdefinitions") {
      return contractDefinitions.remove(params);
    }
    throw new Error(`Unknown resource: ${resource}`);
  },
  deleteMany: (resource: string, params: any) => {
    if (resource === "assets") {
      return Promise.all(
        params.ids.map((id: string) => assets.remove({ id }))
      ).then((responses) => ({
        data: responses.map((response) => response.data.id),
      }));
    } else if (resource === "policies") {
      return Promise.all(
        params.ids.map((id: string) => policies.remove({ id }))
      ).then((responses) => ({
        data: responses.map((response) => response.data.id),
      }));
    } else if (resource === "contractagreements") {
      return Promise.all(
        params.ids.map((id: string) => contractAgreements.remove({ id }))
      ).then((responses) => ({
        data: responses.map((response) => response.data.id),
      }));
    } else if (resource === "contractdefinitions") {
      return Promise.all(
        params.ids.map((id: string) => contractDefinitions.remove({ id }))
      ).then((responses) => ({
        data: responses.map((response) => response.data.id),
      }));
    } else if (resource === "contractnegotiations") {
      return Promise.all(
        params.ids.map((id: string) => contractNegotiations.remove({ id }))
      ).then((responses) => ({
        data: responses.map((response) => response.data.id),
      }));
    } else if (resource === "transferprocesses") {
      return Promise.all(
        params.ids.map((id: string) => transferProcesses.remove({ id }))
      ).then((responses) => ({
        data: responses.map((response) => response.data.id),
      }));
    } else if (resource === "datarequests") {
      return Promise.all(
        Promise.reject(new Error("datarequests deleteMany is not implemented"))
      ).then((responses) => ({
        data: responses.map((response) => response.data.id),
      }));
    }
    throw new Error(`Unknown resource: ${resource}`);
  },
  getManyReference: (resource: string, params: any) => {
    if (resource === "datasets") {
      return datasets.getManyReference(params);
    } else if (resource === "contractnegotiations") {
      return contractNegotiations.getManyReference(params);
    }
    throw new Error(`Unknown resource: ${resource}`);
  },
};

export default dataProvider;
