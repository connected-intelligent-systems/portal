import { ContractNegotiationsList } from "./ContractNegotiationsList";
import { ContractNegotiationShow } from "./ContractNegotiationShow";
import { ContractNegotiationCreate } from "./ContractNegotiationCreate";
import { ContractNegotiationTerminate } from "./ContractNegotiationTerminate";

export default {
  list: ContractNegotiationsList,
  show: ContractNegotiationShow,
  create: ContractNegotiationCreate,
  terminate: ContractNegotiationTerminate,
};
