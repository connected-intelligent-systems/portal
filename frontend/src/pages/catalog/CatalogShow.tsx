import { useRecordContext } from "react-admin";
import { CatalogList } from "../catalog_list";

export const CatalogShow = () => {
  const record = useRecordContext();
  return <CatalogList record={record?.datasets} counterPartyAddress={record?.id} />;
};
