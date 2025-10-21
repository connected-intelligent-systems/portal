import {
  Create,
  TextInput,
  SimpleForm,
  ReferenceInput,
  AutocompleteInput,
  required,
  useTranslate,
  ReferenceArrayInput,
  AutocompleteArrayInput,
} from "react-admin";
import { Box, Typography } from "@mui/material";

export const ContractDefinitionCreate = (props: any) => {
  const translate = useTranslate();

  return (
    <Create {...props}>
      <SimpleForm>
        <TextInput
          source="privateProperties.name"
          label={translate("resources.contract_definitions.create.fields.name")}
          fullWidth
          validate={[required()]}
          helperText={translate(
            "resources.contract_definitions.create.fields.nameHelper"
          )}
        />
        <TextInput
          source="privateProperties.description"
          label={translate(
            "resources.contract_definitions.create.fields.description"
          )}
          fullWidth
          multiline
          rows={4}
          helperText={translate(
            "resources.contract_definitions.create.fields.descriptionHelper"
          )}
        />
        <ReferenceInput source="accessPolicyId" reference="policies">
          <AutocompleteInput
            label={translate(
              "resources.contract_definitions.create.fields.accessPolicy"
            )}
            optionText="name"
            fullWidth
            validate={[required()]}
            helperText={translate(
              "resources.contract_definitions.create.fields.accessPolicyHelper"
            )}
          />
        </ReferenceInput>
        <ReferenceInput source="contractPolicyId" reference="policies">
          <AutocompleteInput
            label={translate(
              "resources.contract_definitions.create.fields.contractPolicy"
            )}
            optionText="name"
            fullWidth
            validate={[required()]}
            helperText={translate(
              "resources.contract_definitions.create.fields.contractPolicyHelper"
            )}
          />
        </ReferenceInput>
        <Box sx={{ mt: 3, mb: 1 }}>
          <Typography variant="h6" gutterBottom>
            {translate(
              "resources.contract_definitions.create.fields.assetSelector"
            )}
          </Typography>
          <Typography variant="body2">
            {translate(
              "resources.contract_definitions.create.fields.assetSelectorDescription"
            )}
          </Typography>
        </Box>
        <ReferenceArrayInput source="assetsSelector" reference="assets">
          <AutocompleteArrayInput
            optionText="title"
            label={translate(
              "resources.contract_definitions.create.fields.assetByIdSelector"
            )}
            fullWidth
            helperText={translate(
              "resources.contract_definitions.create.fields.assetByIdSelectorHelper"
            )}
            validate={[required()]}
            filterToQuery={(searchText) => ({
              title: searchText,
            })}
          />
        </ReferenceArrayInput>
      </SimpleForm>
    </Create>
  );
};
