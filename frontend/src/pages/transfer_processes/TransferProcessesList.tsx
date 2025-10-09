import { Datagrid, DateField, List, TextField } from "react-admin";

export const TransferProcessesList = () => (
  <List empty={false} exporter={false}>
    <Datagrid bulkActionButtons={false} rowClick="show">
      <TextField
        label="resources.transferprocesses.fields.id"
        source="id"
        sortable={false}
      />
      <TextField
        label="resources.transferprocesses.fields.assetId"
        source="assetId"
        sortable={false}
      />
      <TextField
        label="resources.transferprocesses.fields.transferDirection"
        source="transferDirection"
        sortable={false}
      />
      <TextField
        label="resources.transferprocesses.fields.state"
        source="state"
        sortable={false}
      />
      <TextField
        label="resources.transferprocesses.fields.transferType"
        source="transferType"
        sortable={false}
      />
      <DateField
        label="resources.transferprocesses.fields.stateTimestamp"
        source="stateTimestamp"
        sortable={true}
        showTime
      />
    </Datagrid>
  </List>
);
