import * as assets from "./resources/assets";
import * as policies from "./resources/policies";
import * as contract_agreements from "./resources/contract_agreements";
import * as contract_definitions from "./resources/contract_definitions";
import * as contract_negotiations from "./resources/contract_negotiations";
import * as catalog from "./resources/catalog";
import * as federated_catalog from "./resources/federated_catalog";
import * as transfer_processes from "./resources/transfer_processes";
import * as data_consumer_pull from "./resources/data_consumer_pull";
import * as data_requests from "./resources/data_requests";
import * as terminate_transfer_process from "./resources/terminate_transfer_process";

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
    } else if (resource === "catalog") {
      return catalog.getList(params);
    } else if (resource === "federatedcatalog") {
      return federated_catalog.getList(params);
    } else if (resource === "transferprocesses") {
      return transfer_processes.getList(params);
    } else if (resource === "dataconsumerpull") {
      return data_consumer_pull.getList(params);
    } else if (resource === "datarequests") {
      return data_requests.getList(params);
    } else if (resource === "terminatetransferprocess") {
      return terminate_transfer_process.getList(params);
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
    } else if (resource === "catalog") {
      return catalog.getOne(params);
    } else if (resource === "federatedcatalog") {
      return federated_catalog.getOne(params);
    } else if (resource === "transferprocesses") {
      return transfer_processes.getOne(params);
    } else if (resource === "dataconsumerpull") {
      return data_consumer_pull.getOne(params);
    } else if (resource === "datarequests") {
      return data_requests.getOne(params);
    } else if (resource === "terminatetransferprocess") {
      return terminate_transfer_process.getOne(params);
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
    } else if (resource === "catalog") {
      return catalog.getMany(params);
    } else if (resource === "federatedcatalog") {
      return federated_catalog.getMany(params);
    } else if (resource === "transferprocesses") {
      return transfer_processes.getMany(params);
    } else if (resource === "dataconsumerpull") {
      return data_consumer_pull.getMany(params);
    } else if (resource === "datarequests") {
      return data_requests.getMany(params);
    } else if (resource === "terminatetransferprocess") {
      return terminate_transfer_process.getMany(params);
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
    } else if (resource === "catalog") {
      return catalog.create(params);
    } else if (resource === "federatedcatalog") {
      return federated_catalog.create(params);
    } else if (resource === "transferprocesses") {
      return transfer_processes.create(params);
    } else if (resource === "dataconsumerpull") {
      return data_consumer_pull.create(params);
    } else if (resource === "datarequests") {
      return data_requests.create(params);
    } else if (resource === "terminatetransferprocess") {
      return terminate_transfer_process.create(params);
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
    } else if (resource === "catalog") {
      return catalog.update(params);
    } else if (resource === "federatedcatalog") {
      return federated_catalog.update(params);
    } else if (resource === "transferprocesses") {
      return transfer_processes.update(params);
    } else if (resource === "dataconsumerpull") {
      return data_consumer_pull.update(params);
    } else if (resource === "datarequests") {
      return data_requests.update(params);
    } else if (resource === "terminatetransferprocess") {
      return terminate_transfer_process.update(params);
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
    } else if (resource === "catalog") {
      return Promise.all(
        params.ids.map((id: string) => catalog.update({ ...params, id }))
      ).then((responses) => ({
        data: responses.map((response) => response.data.id),
      }));
    } else if (resource === "federatedcatalog") {
      return Promise.all(
        params.ids.map((id: string) =>
          federated_catalog.update({ ...params, id })
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
    } else if (resource === "dataconsumerpull") {
      return Promise.all(
        params.ids.map((id: string) =>
          data_consumer_pull.update({ ...params, id })
        )
      ).then((responses) => ({
        data: responses.map((response) => response.data.id),
      }));
    } else if (resource === "datarequests") {
      return Promise.all(
        params.ids.map((id: string) => data_requests.update({ ...params, id }))
      ).then((responses) => ({
        data: responses.map((response) => response.data.id),
      }));
    } else if (resource === "terminatetransferprocess") {
      return Promise.all(
        params.ids.map((id: string) =>
          terminate_transfer_process.update({ ...params, id })
        )
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
    } else if (resource === "catalog") {
      return Promise.all(
        params.ids.map((id: string) => catalog.remove({ id }))
      ).then((responses) => ({
        data: responses.map((response) => response.data.id),
      }));
    } else if (resource === "federatedcatalog") {
      return Promise.all(
        params.ids.map((id: string) => federated_catalog.remove({ id }))
      ).then((responses) => ({
        data: responses.map((response) => response.data.id),
      }));
    } else if (resource === "transferprocesses") {
      return Promise.all(
        params.ids.map((id: string) => transfer_processes.remove({ id }))
      ).then((responses) => ({
        data: responses.map((response) => response.data.id),
      }));
    } else if (resource === "dataconsumerpull") {
      return Promise.all(
        params.ids.map((id: string) => data_consumer_pull.remove({ id }))
      ).then((responses) => ({
        data: responses.map((response) => response.data.id),
      }));
    } else if (resource === "datarequests") {
      return Promise.all(
        params.ids.map((id: string) => data_requests.remove({ id }))
      ).then((responses) => ({
        data: responses.map((response) => response.data.id),
      }));
    } else if (resource === "terminatetransferprocess") {
      return Promise.all(
        params.ids.map((id: string) =>
          terminate_transfer_process.remove({ id })
        )
      ).then((responses) => ({
        data: responses.map((response) => response.data.id),
      }));
    }
    throw new Error(`Unknown resource: ${resource}`);
  },
};

export default dataProvider;
