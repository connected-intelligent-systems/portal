import {
  Datagrid,
  DateField,
  List,
  ReferenceField,
  TextField,
} from "react-admin";

export const ContractAgreementsList = () => (
  <List empty={false} exporter={false}>
    <Datagrid bulkActionButtons={false} rowClick="show">
      <TextField source="id" sortable={false} />
      <TextField source="assetId" sortable={false} label="Asset" />
      <TextField source="consumerId" sortable={false} label="Consumer" />
      <TextField source="providerId" sortable={false} label="Provider" />
      <DateField
        label="Signing Date"
        source="contractSigningDate"
        showTime
        sortable={false}
      />
    </Datagrid>
  </List>
);
