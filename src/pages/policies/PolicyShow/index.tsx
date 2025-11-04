import {
  Show,
  SimpleShowLayout,
  DateField,
  FunctionField,
  useTranslate,
  Labeled,
  TextField,
  TopToolbar,
  DeleteButton,
  EditButton,
} from "react-admin";
import { PolicyRulesTabs } from "../../../components/policies/PolicyRulesTabs";

export const PolicyShowBar = () => {
  return (
    <TopToolbar>
      <EditButton />
      <DeleteButton mutationMode="pessimistic" />
    </TopToolbar>
  );
};

export const PolicyShow = () => {
  const translate = useTranslate();

  return (
    <Show actions={<PolicyShowBar />}>
      <SimpleShowLayout>
        <Labeled label={translate("resources.policies.fields.name")}>
          <TextField source="name" emptyText="-" variant="h4" />
        </Labeled>

        <Labeled label={translate("resources.policies.fields.id")}>
          <TextField source="id" emptyText="-" variant="caption" />
        </Labeled>

        <Labeled label={translate("resources.policies.fields.createdAt")}>
          <DateField source="createdAt" showTime emptyText="-" />
        </Labeled>

        <Labeled label={translate("resources.policies.fields.description")}>
          <TextField
            source="description"
            emptyText={translate("resources.policies.show.noDescription")}
            variant="body2"
            sx={{ mt: 0.5 }}
          />
        </Labeled>

        <FunctionField
          render={(record: any) => {
            const permissions = record?.rules?.permissions || [];
            const obligations = record?.rules?.obligations || [];
            const prohibitions = record?.rules?.prohibitions || [];
            const raw = record?.raw;

            return (
              <PolicyRulesTabs
                permissions={permissions}
                obligations={obligations}
                prohibitions={prohibitions}
                raw={raw}
              />
            );
          }}
        />
      </SimpleShowLayout>
    </Show>
  );
};
