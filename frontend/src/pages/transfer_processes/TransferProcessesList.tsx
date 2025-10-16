import {
  Datagrid,
  DateField,
  List,
  TextField,
  useTranslate,
} from "react-admin";

export const TransferProcessesList = () => {
  const translate = useTranslate();
  return (
    <List empty={false} exporter={false}>
      <Datagrid bulkActionButtons={false} rowClick="show">
        <TextField
          label={translate("resources.transferprocesses.fields.id")}
          source="id"
          sortable={false}
        />
        <TextField
          label={translate("resources.transferprocesses.fields.assetId")}
          source="assetId"
          sortable={false}
        />
        <TextField
          label={translate(
            "resources.transferprocesses.fields.transferDirection"
          )}
          source="transferDirection"
          sortable={false}
        />
        <TextField
          label={translate("resources.transferprocesses.fields.state")}
          source="state"
          sortable={false}
        />
        <TextField
          label={translate("resources.transferprocesses.fields.transferType")}
          source="transferType"
          sortable={false}
        />
        <DateField
          label={translate("resources.transferprocesses.fields.stateTimestamp")}
          source="stateTimestamp"
          sortable={true}
          showTime
        />
      </Datagrid>
    </List>
  );
};
