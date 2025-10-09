import {
  Show,
  SimpleShowLayout,
  DateField,
  FunctionField,
  useTranslate,
  Labeled,
  TextField,
} from "react-admin";
import { PolicyShowBar } from "./PolicyShowBar";
import { PolicyRulesTabs } from "../../../components/PolicyRulesTabs";

export const PolicyShow = () => {
  const translate = useTranslate();

  return (
    <Show actions={<PolicyShowBar />}>
      <SimpleShowLayout>
        <Labeled label={translate("resources.policies.fields.createdAt")}>
          <DateField source="createdAt" showTime emptyText="-" />
        </Labeled>

        <Labeled label={translate("resources.policies.fields.name")}>
          <TextField
            source="name"
            emptyText="-"
            variant="h6"
            sx={{ mt: 0.5 }}
          />
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

            return (
              <PolicyRulesTabs
                permissions={permissions}
                obligations={obligations}
                prohibitions={prohibitions}
              />
            );
          }}
        />
      </SimpleShowLayout>
    </Show>
  );
};
