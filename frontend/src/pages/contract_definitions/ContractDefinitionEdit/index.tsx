import {
  Edit,
  TextInput,
  SimpleForm,
  ReferenceInput,
  AutocompleteInput,
  required,
  FormDataConsumer,
  useTranslate,
  AutocompleteArrayInput,
  ReferenceArrayInput,
} from "react-admin";
import { Alert } from "@mui/material";
import { ContractDefinitionFormData } from "../../../types/contractDefinition";

export const ContractDefinitionEdit = (props: any) => {
  const translate = useTranslate();

  return (
    <Edit {...props}>
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
        <div style={{ marginTop: 24, marginBottom: 2 }}>
          <h3
            style={{
              margin: "0 0 8px 0",
              fontSize: "1.25rem",
              fontWeight: 500,
              color: "rgba(0, 0, 0, 0.87)",
            }}
          >
            {translate(
              "resources.contract_definitions.create.fields.assetSelector"
            )}
          </h3>
          <p
            style={{
              margin: "0 0 16px 0",
              fontSize: "0.875rem",
              color: "rgba(0, 0, 0, 0.6)",
            }}
          >
            {translate(
              "resources.contract_definitions.create.fields.assetSelectorDescription"
            )}
          </p>
        </div>
        <FormDataConsumer>
          {({ formData }: { formData: ContractDefinitionFormData }) => {
            const hasSelectedAssets =
              Array.isArray(formData?.assetsSelector) &&
              formData.assetsSelector.length > 0;

            return !hasSelectedAssets ? (
              <Alert severity="warning" sx={{ mb: 2 }}>
                {translate(
                  "resources.contract_definitions.create.warnings.noAssetsSelected"
                )}
              </Alert>
            ) : null;
          }}
        </FormDataConsumer>
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
            filterToQuery={(searchText) => {
              return {
                title: searchText,
              };
            }}
          />
        </ReferenceArrayInput>
      </SimpleForm>
    </Edit>
  );
};
