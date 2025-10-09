import {
  Datagrid,
  List,
  TextField,
  DateField,
  ListActions,
  useTranslate,
} from "react-admin";

export const ContractNegotiationsList = () => {
  const translate = useTranslate();
  return (
    <List exporter={false} actions={<ListActions hasCreate={false} />}>
      <Datagrid rowClick="show" bulkActionButtons={false}>
        <TextField
          source="id"
          label={translate("resources.contractnegotiations.fields.id")}
        />
        <TextField
          source="state"
          label={translate("resources.contractnegotiations.fields.state")}
        />
        <TextField
          source="type"
          label={translate("resources.contractnegotiations.fields.type")}
        />
        <DateField
          source="createdAt"
          showTime
          label={translate("resources.contractnegotiations.fields.createdAt")}
        />
      </Datagrid>
    </List>
  );
};
