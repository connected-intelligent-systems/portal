import {
  Edit,
  TextInput,
  SimpleForm,
  ArrayInput,
  useTranslate,
} from "react-admin";
import { PermissionCreate } from "../shared/PermissionCreate";

export const PolicyEdit = (props: any) => {
  const translate = useTranslate();

  return (
    <Edit {...props}>
      <SimpleForm>
        <TextInput
          source="name"
          label={translate("resources.policies.create.fields.name")}
          required
          fullWidth
          helperText={translate("resources.policies.create.fields.nameHelper")}
        />
        <TextInput
          source="description"
          label={translate("resources.policies.create.fields.description")}
          fullWidth
          multiline
          rows={3}
          helperText={translate(
            "resources.policies.create.fields.descriptionHelper"
          )}
        />
        <ArrayInput source="rules.permissions">
          <PermissionCreate />
        </ArrayInput>
      </SimpleForm>
    </Edit>
  );
};
