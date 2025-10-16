import {
  Datagrid,
  DateField,
  List,
  TextField,
  useTranslate,
} from "react-admin";

export const ContractAgreementsList = () => {
  const translate = useTranslate();
  return (
    <List empty={false} exporter={false}>
      <Datagrid bulkActionButtons={false} rowClick="show">
        <TextField
          label={translate("resources.contractagreements.fields.id")}
          source="id"
          sortable={false}
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
          sortable={false}
        />
      </Datagrid>
    </List>
  );
};
