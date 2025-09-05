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
      <ReferenceField
        reference="federatedcatalog"
        source="assetId"
        label="Asset"
        sortable={false}
      >
        <TextField source="title" />
      </ReferenceField>
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
