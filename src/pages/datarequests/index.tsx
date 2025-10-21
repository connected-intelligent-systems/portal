import { TextField, Show, SimpleShowLayout, useTranslate } from "react-admin";
import { PasswordField } from "../../components/password_field";

export const DataRequestShow = () => {
  const translate = useTranslate();
  return (
    <Show>
      <SimpleShowLayout>
        <TextField
          label={translate("resources.datarequests.fields.id")}
          source="id"
        />
        <TextField
          label={translate("resources.datarequests.fields.endpoint")}
          source="endpoint"
        />
        <TextField
          label={translate("resources.datarequests.fields.authType")}
          source="authType"
        />
        <PasswordField
          label={translate("resources.datarequests.fields.authorization")}
          source="authorization"
        />
      </SimpleShowLayout>
    </Show>
  );
};
