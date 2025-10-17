import * as assets from "./resources/assets";
import * as policies from "./resources/policies";
import * as contract_agreements from "./resources/contract_agreements";
import * as contract_definitions from "./resources/contract_definitions";
import * as contract_negotiations from "./resources/contract_negotiations";
import * as catalogs from "./resources/catalogs";
import * as datasets from "./resources/datasets";
import * as transfer_processes from "./resources/transfer_processes";
import * as data_address from "./resources/data_address";
import * as terminate_transfer_process from "./resources/terminate_transfer_process";
import * as terminate_contract_negotiation from "./resources/terminate_contract_negotiation";
import * as contract_agreement_negotiation from "./resources/contract_agreement_negotiation";

const dataProvider = {
  getList: (resource: string, params: any) => {
    if (resource === "assets") {
      return assets.getList(params);
    } else if (resource === "policies") {
      return policies.getList(params);
    } else if (resource === "contractagreements") {
      return contract_agreements.getList(params);
    } else if (resource === "contractdefinitions") {
      return contract_definitions.getList(params);
    } else if (resource === "contractnegotiations") {
      return contract_negotiations.getList(params);
    } else if (resource === "catalogs") {
      return catalogs.getList();
    } else if (resource === "transferprocesses") {
      return transfer_processes.getList(params);
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
      return contract_agreements.getOne(params);
    } else if (resource === "contractdefinitions") {
      return contract_definitions.getOne(params);
    } else if (resource === "contractnegotiations") {
      return contract_negotiations.getOne(params);
    } else if (resource === "catalogs") {
      return catalogs.getOne(params);
    } else if (resource === "transferprocesses") {
      return transfer_processes.getOne(params);
    } else if (resource === "datarequests") {
      return data_address.getOne(params);
    } else if (resource === "datasets") {
      return datasets.getOne(params);
    } else if (resource === "contractagreementnegotiation") {
      return contract_agreement_negotiation.getOne(params);
    }
    throw new Error(`Unknown resource: ${resource}`);
  },
  getMany: (resource: string, params: any) => {
    if (resource === "assets") {
      return assets.getMany(params);
    } else if (resource === "policies") {
      return policies.getMany(params);
    } else if (resource === "contractagreements") {
      return contract_agreements.getMany(params);
    } else if (resource === "contractdefinitions") {
      return contract_definitions.getMany(params);
    } else if (resource === "contractnegotiations") {
      return contract_negotiations.getMany(params);
    } else if (resource === "catalogs") {
      return catalogs.getMany();
    } else if (resource === "transferprocesses") {
      return transfer_processes.getMany(params);
    } else if (resource === "datarequests") {
      return data_address.getMany(params);
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
      return contract_agreements.create(params);
    } else if (resource === "contractdefinitions") {
      return contract_definitions.create(params);
    } else if (resource === "contractnegotiations") {
      return contract_negotiations.create(params);
    } else if (resource === "catalogs") {
      return catalogs.create(params);
    } else if (resource === "transferprocesses") {
      return transfer_processes.create(params);
    } else if (resource === "datarequests") {
      throw new Error("datarequests create is not implemented");
    } else if (resource === "terminatetransferprocess") {
      return terminate_transfer_process.create(params);
    } else if (resource === "terminatecontractnegotiation") {
      return terminate_contract_negotiation.create(params);
    }
    throw new Error(`Unknown resource: ${resource}`);
  },
  update: (resource: string, params: any) => {
    if (resource === "assets") {
      return assets.update(params);
    } else if (resource === "policies") {
      return policies.update(params);
    } else if (resource === "contractagreements") {
      return contract_agreements.update(params);
    } else if (resource === "contractdefinitions") {
      return contract_definitions.update(params);
    } else if (resource === "contractnegotiations") {
      return contract_negotiations.update(params);
    } else if (resource === "catalogs") {
      return catalogs.update(params);
    } else if (resource === "transferprocesses") {
      return transfer_processes.update(params);
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
          contract_agreements.update({ ...params, id })
        )
      ).then((responses) => ({
        data: responses.map((response) => response.data.id),
      }));
    } else if (resource === "contractdefinitions") {
      return Promise.all(
        params.ids.map((id: string) =>
          contract_definitions.update({ ...params, id })
        )
      ).then((responses) => ({
        data: responses.map((response) => response.data.id),
      }));
    } else if (resource === "contractnegotiations") {
      return Promise.all(
        params.ids.map((id: string) =>
          contract_negotiations.update({ ...params, id })
        )
      ).then((responses) => ({
        data: responses.map((response) => response.data.id),
      }));
    } else if (resource === "transferprocesses") {
      return Promise.all(
        params.ids.map((id: string) =>
          transfer_processes.update({ ...params, id })
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
      return contract_definitions.remove(params);
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
        params.ids.map((id: string) => contract_agreements.remove({ id }))
      ).then((responses) => ({
        data: responses.map((response) => response.data.id),
      }));
    } else if (resource === "contractdefinitions") {
      return Promise.all(
        params.ids.map((id: string) => contract_definitions.remove({ id }))
      ).then((responses) => ({
        data: responses.map((response) => response.data.id),
      }));
    } else if (resource === "contractnegotiations") {
      return Promise.all(
        params.ids.map((id: string) => contract_negotiations.remove({ id }))
      ).then((responses) => ({
        data: responses.map((response) => response.data.id),
      }));
    } else if (resource === "transferprocesses") {
      return Promise.all(
        params.ids.map((id: string) => transfer_processes.remove({ id }))
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
      return contract_negotiations.getManyReference(params);
    }
    throw new Error(`Unknown resource: ${resource}`);
  },
};

export default dataProvider;
