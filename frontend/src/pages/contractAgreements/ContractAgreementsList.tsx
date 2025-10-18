import { ReactElement, useMemo } from "react";
import {
  Datagrid,
  DateField,
  FilterButton,
  List,
  TextField,
  TextInput,
  TopToolbar,
  useTranslate,
} from "react-admin";

const ContractAgreementsListActions = ({
  filters,
}: {
  filters: ReactElement[];
}) => (
  <TopToolbar>
    <FilterButton filters={filters} />
  </TopToolbar>
);

export const ContractAgreementsList = () => {
  const translate = useTranslate();
  const filters = useMemo(
    () => [
      <TextInput
        key="consumerId"
        source="consumerId"
        label={translate("resources.contractagreements.filters.consumerId")}
        resettable
      />,
      <TextInput
        key="providerId"
        source="providerId"
        label={translate("resources.contractagreements.filters.providerId")}
        resettable
      />,
    ],
    [translate]
  );
  return (
    <List
      empty={false}
      exporter={false}
      filters={filters}
      actions={<ContractAgreementsListActions filters={filters} />}
    >
      <Datagrid bulkActionButtons={false} rowClick="show">
        <TextField
          label={translate("resources.contractagreements.fields.id")}
          source="id"
          sortable={true}
        />
        <TextField
          label={translate("resources.contractagreements.fields.assetId")}
          source="assetId"
          sortable={false}
        />
        <TextField
          label={translate("resources.contractagreements.fields.consumerId")}
          source="consumerId"
          sortable={false}
        />
        <TextField
          label={translate("resources.contractagreements.fields.providerId")}
          source="providerId"
          sortable={false}
        />
        <DateField
          label={translate(
            "resources.contractagreements.fields.contractSigningDate"
          )}
          source="contractSigningDate"
          showTime
          sortable={true}
        />
      </Datagrid>
    </List>
  );
};
