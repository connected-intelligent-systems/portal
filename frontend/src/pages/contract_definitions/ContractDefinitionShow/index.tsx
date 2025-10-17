import {
  Show,
  SimpleShowLayout,
  TopToolbar,
  DeleteButton,
  TextField,
  ReferenceField,
  ReferenceArrayField,
  FunctionField,
  SingleFieldList,
  useTranslate,
  EditButton,
} from "react-admin";

const ContractDefinitionShowBar = () => (
  <TopToolbar>
    <DeleteButton mutationMode="pessimistic" />
    <EditButton />
  </TopToolbar>
);

export const ContractDefinitionShow = () => {
  const translate = useTranslate();

  return (
    <Show actions={<ContractDefinitionShowBar />}>
      <SimpleShowLayout>
        <TextField
          variant="h4"
          label={translate("resources.contract_definitions.fields.name")}
          source="privateProperties.name"
          gutterBottom
        />
        <TextField source="id" />
        <TextField
          label={translate("resources.contract_definitions.fields.description")}
          source="privateProperties.description"
          emptyText="-"
        />
        <TextField
          label={translate("resources.contract_definitions.fields.type")}
          source="type"
        />
        <ReferenceField
          source="accessPolicyId"
          reference="policies"
          link="show"
          label={translate(
            "resources.contract_definitions.fields.accessPolicy"
          )}
        >
          <TextField source="name" />
        </ReferenceField>
        <ReferenceField
          source="contractPolicyId"
          reference="policies"
          label={translate(
            "resources.contract_definitions.fields.contractPolicy"
          )}
          link="show"
        >
          <TextField source="name" />
        </ReferenceField>
        <ReferenceArrayField
          source="assetsSelector"
          reference="assets"
          label={translate(
            "resources.contract_definitions.fields.selectedAssets"
          )}
        >
          <SingleFieldList linkType="show">
            <FunctionField render={(asset: any) => asset?.title || asset.id} />
          </SingleFieldList>
        </ReferenceArrayField>
      </SimpleShowLayout>
    </Show>
  );
};
