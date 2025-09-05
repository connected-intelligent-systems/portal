import { Datagrid, List, TextField, DateField } from "react-admin";

export const ContractNegotiationsList = () => (
  <List>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="state" />
      <TextField source="type" />
      <DateField source="createdAt" showTime label="Created At" />
      <DateField source="updatedAt" showTime label="Updated At" />
    </Datagrid>
  </List>
);
