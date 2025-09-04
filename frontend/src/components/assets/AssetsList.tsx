import {
  List,
  Datagrid,
  TextField,
} from "react-admin";

export const AssetsList = () => (
  <List empty={false}>
    <Datagrid
      style={{ tableLayout: "fixed" }}
      bulkActionButtons={false}
      rowClick="show"
    >
      <TextField source="id" sortable={false} />
      <TextField source="properties.name" label="Name" sortable={false} />
      <TextField
        source="properties.type"
        label="Type"
        sortable={false}
        defaultValue="-"
      />
      <TextField
        source="dataAddress.type"
        label="Data Address Type"
        sortable={false}
      />
    </Datagrid>
  </List>
);
