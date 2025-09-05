import React from "react";
import {
  useTranslate,
  useInput,
  ArrayInput,
  SimpleFormIterator,
  TextInput,
  SelectInput,
  required,
  useRecordContext,
} from "react-admin";
import { Typography } from "@mui/material";

export const IdentityBasedPermission = () => {
  const translate = useTranslate();
  const {
    field: { value: operatorValue },
  } = useInput({ source: "constraints[0].operator" });
  const selectMultiple =
    operatorValue === "odrl:isNoneOf" || operatorValue === "odrl:isPartOf";

  const renderInput = () => {
    if (selectMultiple) {
      return (
        <ArrayInput
          source="constraints[0].rightOperand"
          label={translate("resources.policies.create.permissions.identities")}
        >
          <SimpleFormIterator inline>
            <TextInput
              source=""
              label={translate(
                "resources.policies.create.permissions.identity"
              )}
            />
          </SimpleFormIterator>
        </ArrayInput>
      );
    }
    return (
      <TextInput
        source="constraints[0].rightOperand"
        label={translate("resources.policies.create.permissions.identity")}
      />
    );
  };

  return (
    <>
      <Typography sx={{ mt: 2 }}>
        {translate(
          "resources.policies.create.permissions.identityBasedPermission"
        )}
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
            id: "odrl:eq",
            name: translate("resources.policies.create.permissions.equals"),
          },
          {
            id: "odrl:neq",
            name: translate("resources.policies.create.permissions.notEquals"),
          },
          {
            id: "odrl:isNoneOf",
            name: translate("resources.policies.create.permissions.isNoneOf"),
          },
          {
            id: "odrl:isPartOf",
            name: translate("resources.policies.create.permissions.isPartOf"),
          },
        ]}
        helperText={translate(
          "resources.policies.create.permissions.operatorHelper"
        )}
        validate={[required()]}
      />
      {renderInput()}
      <TextInput
        source="constraints[0].leftOperand"
        defaultValue="edc:participantId"
        style={{ display: "none" }}
      />
    </>
  );
};
