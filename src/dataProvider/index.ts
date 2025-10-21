import * as asset from "./resources/asset";
import * as policy from "./resources/policy";
import * as contractAgreement from "./resources/contractAgreement";
import * as contractDefinition from "./resources/contractDefinition";
import * as contractNegotiation from "./resources/contractNegotiation";
import * as catalog from "./resources/catalog";
import * as dataset from "./resources/dataset";
import * as transferProcess from "./resources/transferProcess";
import * as dataAddress from "./resources/dataAddress";
import * as terminateTransferProcess from "./resources/terminateTransferProcess";
import * as terminateContractNegotiation from "./resources/terminateContractNegotiation";
import * as contractAgreementNegotiation from "./resources/contractAgreementNegotiation";

type ResourceModule = {
  getList?: (params: any) => Promise<any>;
  getOne?: (params: any) => Promise<any>;
  getMany?: (params: any) => Promise<any>;
  create?: (params: any) => Promise<any>;
  update?: (params: any) => Promise<any>;
  remove?: (params: any) => Promise<any>;
  getManyReference?: (params: any) => Promise<any>;
};

const resourceRegistry: Record<string, ResourceModule> = {
  assets: asset,
  policies: policy,
  contractagreements: contractAgreement,
  contractdefinitions: contractDefinition,
  contractnegotiations: contractNegotiation,
  catalogs: catalog,
  datasets: dataset,
  transferprocesses: transferProcess,
  datarequests: dataAddress,
  terminatetransferprocess: terminateTransferProcess,
  terminatecontractnegotiation: terminateContractNegotiation,
  contractagreementnegotiation: contractAgreementNegotiation,
};

const dataProvider = {
  getList: (resource: string, params: any) => {
    const resourceModule = resourceRegistry[resource];
    if (resourceModule?.getList) {
      return resourceModule.getList(params);
    }
    throw new Error(`Unknown resource: ${resource}`);
  },
  getOne: (resource: string, params: any) => {
    const resourceModule = resourceRegistry[resource];
    if (resourceModule?.getOne) {
      return resourceModule.getOne(params);
    }
    throw new Error(`Unknown resource: ${resource}`);
  },
  getMany: (resource: string, params: any) => {
    const resourceModule = resourceRegistry[resource];
    if (resourceModule?.getMany) {
      return resourceModule.getMany(params);
    }
    throw new Error(`Unknown resource: ${resource}`);
  },
  create: (resource: string, params: any) => {
    const resourceModule = resourceRegistry[resource];
    if (resourceModule?.create) {
      return resourceModule.create(params);
    }
    throw new Error(`Unknown resource: ${resource}`);
  },
  update: (resource: string, params: any) => {
    const resourceModule = resourceRegistry[resource];
    if (resourceModule?.update) {
      return resourceModule.update(params);
    }
    throw new Error(`Unknown resource: ${resource}`);
  },
  updateMany: (resource: string, params: any) => {
    const resourceModule = resourceRegistry[resource];
    if (resourceModule?.update) {
      return Promise.all(
        params.ids.map((id: string) =>
          resourceModule.update!({ ...params, id })
        )
      ).then((responses) => ({
        data: responses.map((response) => response.data.id),
      }));
    }
    throw new Error(`Unknown resource: ${resource}`);
  },
  delete: (resource: string, params: any) => {
    const resourceModule = resourceRegistry[resource];
    if (resourceModule?.remove) {
      return resourceModule.remove(params);
    }
    throw new Error(`Unknown resource: ${resource}`);
  },
  deleteMany: (resource: string, params: any) => {
    const resourceModule = resourceRegistry[resource];
    if (resourceModule?.remove) {
      return Promise.all(
        params.ids.map((id: string) => resourceModule.remove!({ id }))
      ).then((responses) => ({
        data: responses.map((response) => response.data.id),
      }));
    }
    throw new Error(`Unknown resource: ${resource}`);
  },
  getManyReference: (resource: string, params: any) => {
    const resourceModule = resourceRegistry[resource];
    if (resourceModule?.getManyReference) {
      return resourceModule.getManyReference(params);
    }
    throw new Error(`Unknown resource: ${resource}`);
  },
};

export default dataProvider;
