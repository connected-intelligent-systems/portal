import { List, Datagrid, TextField, DateField } from "react-admin";

export const PoliciesList = () => (
  <List empty={false} exporter={false}>
    <Datagrid
      style={{ tableLayout: "fixed" }}
      bulkActionButtons={false}
      rowClick="show"
    >
      <TextField source="id" sortable={false} />
      <TextField
        source="privateProperties.name"
        label="Name"
        sortable={false}
      />
      <DateField
        showTime={true}
        source="createdAt"
        label="Created At"
        sortable={false}
      />
    </Datagrid>
  </List>
);
