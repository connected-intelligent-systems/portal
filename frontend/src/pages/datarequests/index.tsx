import { TextField, Show, SimpleShowLayout } from "react-admin";
import { PasswordField } from "../../components/password_field";

export const DataRequestShow = () => {
  return (
    <Show>
      <SimpleShowLayout>
        <TextField source="id" />
        <TextField source="endpoint" />
        <TextField source="authType" label="Authentication Type" />
        <PasswordField source="authorization" />
      </SimpleShowLayout>
    </Show>
  );
};
