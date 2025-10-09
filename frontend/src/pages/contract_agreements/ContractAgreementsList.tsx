import { Datagrid, DateField, List, TextField } from "react-admin";

export const ContractAgreementsList = () => (
  <List empty={false} exporter={false}>
    <Datagrid bulkActionButtons={false} rowClick="show">
      <TextField
        label="resources.contractagreements.fields.id"
        source="id"
        sortable={false}
      />
      <TextField
        label="resources.contractagreements.fields.assetId"
        source="assetId"
        sortable={false}
      />
      <TextField
        label="resources.contractagreements.fields.consumerId"
        source="consumerId"
        sortable={false}
      />
      <TextField
        label="resources.contractagreements.fields.providerId"
        source="providerId"
        sortable={false}
      />
      <DateField
        label="resources.contractagreements.fields.contractSigningDate"
        source="contractSigningDate"
        showTime
        sortable={false}
      />
    </Datagrid>
  </List>
);
