import {
  Create,
  TextInput,
  SimpleForm,
  ReferenceInput,
  AutocompleteInput,
  required,
  FormDataConsumer,
} from "react-admin";
import { AssetByIdSelector } from "./AssetByIdSelector";
import { Alert } from "@mui/material";

export const ContractDefinitionCreate = (props: any) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput
        source="privateProperties.name"
        label="Name"
        fullWidth
        validate={[required()]}
        helperText="Enter a unique name for this contract definition"
      />
      <TextInput
        source="privateProperties.description"
        label="Description"
        fullWidth
        multiline
        rows={4}
        helperText="Provide a detailed description of this contract definition"
      />
      <ReferenceInput source="accessPolicyId" reference="policies">
        <AutocompleteInput
          label="Access Policy"
          optionText="privateProperties.name"
          fullWidth
          validate={[required()]}
          helperText="Checked before contract negotiation - decides who is allowed to request a contract for the asset"
        />
      </ReferenceInput>
      <ReferenceInput source="contractPolicyId" reference="policies">
        <AutocompleteInput
          label="Contract Policy"
          optionText="privateProperties.name"
          fullWidth
          validate={[required()]}
          helperText="Applied after contract agreement - defines the usage conditions of the data"
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
          Asset Selector
        </h3>
        <p
          style={{
            margin: "0 0 16px 0",
            fontSize: "0.875rem",
            color: "rgba(0, 0, 0, 0.6)",
          }}
        >
          Select the specific assets that this contract definition will apply
          to.
        </p>
      </div>
      <FormDataConsumer>
        {({ formData }) => {
          const assetsSelector = formData?.assetsSelector?.[0];
          const hasSelectedAssets =
            assetsSelector?.operandRight &&
            Array.isArray(assetsSelector.operandRight) &&
            assetsSelector.operandRight.length > 0;

          return !hasSelectedAssets ? (
            <Alert severity="warning" sx={{ mb: 2 }}>
              ⚠️ Warning: No assets selected - this contract definition will
              apply to ALL assets.
            </Alert>
          ) : null;
        }}
      </FormDataConsumer>
      <AssetByIdSelector
        source="assetsSelector"
        label="Asset By ID Selector"
        fullWidth
        helperText="Select the assets that this contract definition applies to"
      />
    </SimpleForm>
  </Create>
);
