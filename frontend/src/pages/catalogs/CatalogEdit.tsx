import { Edit, SimpleForm, TextInput, required } from 'react-admin';

export const CatalogEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <TextInput
          source="url"
          label="Catalog URL"
          helperText="The EDC catalog endpoint URL"
          fullWidth
          validate={required()}
        />
        <TextInput
          source="name"
          label="Catalog Name"
          helperText="A friendly name for this catalog"
          fullWidth
          validate={required()}
        />
        <TextInput
          source="description"
          label="Description"
          helperText="Optional description"
          multiline
          rows={3}
          fullWidth
        />
      </SimpleForm>
    </Edit>
  );
};
