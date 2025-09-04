import {
  Show,
  SimpleShowLayout,
  TopToolbar,
  DeleteButton,
  TextField,
  ReferenceField,
  ArrayField,
  Datagrid,
  FunctionField,
} from "react-admin";

const ContractDefinitionShowBar = () => (
  <TopToolbar>
    <DeleteButton mutationMode="pessimistic" />
  </TopToolbar>
);

export const ContractDefinitionShow = () => (
  <Show actions={<ContractDefinitionShowBar />}>
    <SimpleShowLayout>
      <TextField label="Name" source="privateProperties.name" />
      <TextField source="id" />
      <TextField
        label="Description"
        source="privateProperties.description"
        emptyText="-"
      />
      <TextField label="Type" source="@type" />
      <ReferenceField
        source="accessPolicyId"
        reference="policies"
        link="show"
        label="Access Policy"
      >
        <TextField source="id" />
      </ReferenceField>
      <ReferenceField
        source="contractPolicyId"
        reference="policies"
        label="Contract Policy"
        link="show"
      >
        <TextField source="id" />
      </ReferenceField>
      <FunctionField 
        label="Selected Assets"
        render={(record: any) => {
          const assetsSelector = record?.assetsSelector?.[0];
          if (!assetsSelector?.operandRight || !Array.isArray(assetsSelector.operandRight)) {
            return "No assets selected";
          }
          return `${assetsSelector.operandRight.length} asset(s) selected`;
        }}
      />
    </SimpleShowLayout>
  </Show>
);