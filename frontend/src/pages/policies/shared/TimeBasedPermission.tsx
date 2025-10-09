import {
  useTranslate,
  TextInput,
  SelectInput,
  DateTimeInput,
  required,
} from "react-admin";
import { Typography } from "@mui/material";

export const TimeBasedPermission = () => {
  const translate = useTranslate();

  return (
    <>
      <Typography sx={{ mt: 2 }}>
        {translate("resources.policies.create.permissions.timeBasedPermission")}
      </Typography>
      <TextInput
        source="action"
        label={translate("resources.policies.create.permissions.action")}
        helperText={translate(
          "resources.policies.create.permissions.actionHelper"
        )}
        validate={[required()]}
        defaultValue="odrl:use"
      />
      <SelectInput
        source="constraints[0].operator"
        label={translate("resources.policies.create.permissions.operator")}
        choices={[
          {
            id: "odrl:gt",
            name: translate("resources.policies.create.permissions.after"),
          },
          {
            id: "odrl:lt",
            name: translate("resources.policies.create.permissions.before"),
          },
        ]}
        helperText={translate(
          "resources.policies.create.permissions.operatorHelper"
        )}
        validate={[required()]}
      />
      <DateTimeInput
        source="constraints[0].rightOperand"
        label={translate("resources.policies.create.permissions.dateTime")}
        helperText={translate(
          "resources.policies.create.permissions.selectDate"
        )}
        validate={[required()]}
      />
      <TextInput
        source="constraints[0].leftOperand"
        defaultValue="edc:time"
        style={{ display: "none" }}
      />
    </>
  );
};
