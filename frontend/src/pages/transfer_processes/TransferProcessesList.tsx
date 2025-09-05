import {
  Datagrid,
  DateField,
  List,
  ReferenceField,
  TextField,
} from "react-admin";

export const TransferProcessesList = () => (
  <List empty={false} exporter={false}>
    <Datagrid bulkActionButtons={false} rowClick="show">
      <TextField source="id" sortable={false} />
      <ReferenceField
        label="Asset"
        source="assetId"
        reference="assets"
        sortable={false}
        link="show"
      >
        <TextField source="title" />
      </ReferenceField>
      <TextField
        source="transferDirection"
        label="Direction"
        sortable={false}
      />
      <TextField source="state" sortable={false} />
      <TextField source="transferType" sortable={false} label="Transfer Type" />
      <DateField
        label="State Timestamp"
        source="stateTimestamp"
        sortable={true}
        showTime
      />
    </Datagrid>
  </List>
);
