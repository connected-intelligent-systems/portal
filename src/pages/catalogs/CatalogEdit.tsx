import {
  Edit,
  SimpleForm,
  TextInput,
  required,
  useTranslate,
} from "react-admin";

export const CatalogEdit = () => {
  const translate = useTranslate();
  return (
    <Edit>
      <SimpleForm>
        <TextInput
          source="url"
          label={translate("resources.catalog.add.url")}
          helperText={translate("resources.catalog.forms.editUrlHelper")}
          fullWidth
          validate={required()}
        />
        <TextInput
          source="name"
          label={translate("resources.catalog.add.name")}
          helperText={translate("resources.catalog.forms.nameHelper")}
          fullWidth
          validate={required()}
        />
        <TextInput
          source="description"
          label={translate("resources.catalog.fields.description")}
          helperText={translate("resources.catalog.forms.descriptionHelper")}
          multiline
          rows={3}
          fullWidth
        />
      </SimpleForm>
    </Edit>
  );
};
