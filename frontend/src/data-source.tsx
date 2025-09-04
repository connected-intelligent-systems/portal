import {
  policiesDatasource,
  assetsDatasource,
  customersDatasource,
  devicesDatasource,
  catalogDatasource,
  contractAgreementsDatasource,
  contractDefinitionsDatasource,
  contractNegotiationsDatasource,
  federatedCatalogDatasource,
  thingRegistryDatasource,
  transferProcessesDatasource,
  dataConsumerPullDatasource,
  rawDataConsumerPullDatasource,
  usersDatasource,
  terminateContractNegotiationDatasource,
  terminateTransferProcessDatasource,
  dataRequestDatasource,
} from "./data_sources";
import { DataProvider } from "react-admin";

const datasourceMapping: { [key: string]: any } = {
  thingDescriptions: thingRegistryDatasource,
  assets: assetsDatasource,
  customers: customersDatasource,
  devices: devicesDatasource,
  policies: policiesDatasource,
  contractdefinitions: contractDefinitionsDatasource,
  contractagreements: contractAgreementsDatasource,
  contractnegotiations: contractNegotiationsDatasource,
  transferprocesses: transferProcessesDatasource,
  dataconsumerpull: dataConsumerPullDatasource,
  rawdataconsumerpull: rawDataConsumerPullDatasource,
  users: usersDatasource,
  federatedcatalog: federatedCatalogDatasource,
  catalog: catalogDatasource,
  datarequests: dataRequestDatasource,
  terminatecontractnegotiation: terminateContractNegotiationDatasource,
  terminatetransferprocess: terminateTransferProcessDatasource,
};

const handleRequest = async (method: string, resource: string, params: any) => {
  const datasource = datasourceMapping[resource];
  if (datasource && datasource[method]) {
    return datasource[method](params);
  }
  throw new Error(`Invalid resource or method: ${resource}, ${method}`);
};

export default {
  getList: (resource, params) => handleRequest("getList", resource, params),
  getOne: (resource, params) => handleRequest("getOne", resource, params),
  getMany: (resource, params) => handleRequest("getMany", resource, params),
  getManyReference: (resource, params) =>
    handleRequest("getManyReference", resource, params),
  update: (resource, params) => handleRequest("update", resource, params),
  updateMany: (resource, params) =>
    handleRequest("updateMany", resource, params),
  create: (resource, params) => handleRequest("create", resource, params),
  delete: (resource, params) => handleRequest("remove", resource, params),
  deleteMany: (resource, params) =>
    handleRequest("deleteMany", resource, params),
} as DataProvider;
