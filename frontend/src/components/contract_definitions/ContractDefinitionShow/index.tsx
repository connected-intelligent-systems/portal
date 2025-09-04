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
} from "react-admin";
import { toArray } from "lodash-es";
import { Alert } from "@mui/material";

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
        <TextField source="privateProperties.name" />
      </ReferenceField>
      <ReferenceField
        source="contractPolicyId"
        reference="policies"
        label="Contract Policy"
        link="show"
      >
        <TextField source="privateProperties.name" />
      </ReferenceField>
      <FunctionField
        label="Selected Assets"
        render={(record: any) => {
          const assetsSelector = toArray(record?.assetsSelector);
          console.log(
            assetsSelector,
            !assetsSelector || assetsSelector.length === 0
          );
          if (!assetsSelector || assetsSelector.length === 0) {
            return (
              <Alert severity="warning" sx={{ mt: 1 }}>
                This contract definition applies to ALL assets (no assets
                selected)
              </Alert>
            );
          }

          // Create a temporary record with the asset IDs for ReferenceArrayField
          const tempRecord = {
            id: "temp",
            selectedAssetIds: assetsSelector.map((a) => a.operandRight),
          };

          return (
            <ReferenceArrayField
              source="selectedAssetIds"
              reference="assets"
              record={tempRecord}
            >
              <SingleFieldList linkType="show">
                <FunctionField
                  render={(asset: any) =>
                    asset?.properties?.["http://purl.org/dc/terms/title"] ||
                    asset.id
                  }
                />
              </SingleFieldList>
            </ReferenceArrayField>
          );
        }}
      />
    </SimpleShowLayout>
  </Show>
);
