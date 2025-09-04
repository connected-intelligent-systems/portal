import {
  List,
  Datagrid,
  TextField,
} from "react-admin";

export const ContractDefinitionsList = () => (
  <List empty={false} hasCreate={true} exporter={false}>
    <Datagrid
      bulkActionButtons={false}
      rowClick="show"
      style={{ tableLayout: "fixed" }}
    >
      <TextField source="id" sortable={false} />
      <TextField
        label="Name"
        source="privateProperties.name"
        sortable={false}
      />
    </Datagrid>
  </List>
);