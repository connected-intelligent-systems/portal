import { List, Datagrid, TextField, FunctionField } from "react-admin";

export const AssetsList = () => (
  <List empty={false}>
    <Datagrid
      style={{ tableLayout: "fixed" }}
      bulkActionButtons={false}
      rowClick="show"
    >
      <TextField source="id" sortable={false} />
      <FunctionField
        label="Title"
        sortable={false}
        render={(record: any) =>
          record?.properties?.["http://purl.org/dc/terms/title"] || "Untitled"
        }
      />
      <TextField
        source="dataAddress.type"
        label="Data Address Type"
        sortable={false}
      />
    </Datagrid>
  </List>
);
