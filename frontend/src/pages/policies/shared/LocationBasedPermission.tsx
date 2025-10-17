import { useEffect } from "react";
import {
  useTranslate,
  useInput,
  ArrayInput,
  SimpleFormIterator,
  SelectInput,
  TextInput,
  required,
} from "react-admin";
import { Typography } from "@mui/material";
import { countries, getEmojiFlag } from "countries-list";

const countriesList = Object.keys(countries).map((key) => ({
  id: key,
  name: `${getEmojiFlag(key as keyof typeof countries)} ${
    countries[key as keyof typeof countries].name
  }`,
}));

export const LocationBasedPermission = () => {
  const translate = useTranslate();
  const {
    field: { onChange: setAction },
  } = useInput({ source: "action", defaultValue: "odrl:use" });
  const {
    field: { value: operatorValue },
  } = useInput({ source: "constraints[0].operator" });
  const selectMultiple =
    operatorValue === "odrl:isNoneOf" || operatorValue === "odrl:isPartOf";

  useEffect(() => {
    setAction("odrl:use");
  }, [setAction]);

  const renderInput = () => {
    if (selectMultiple) {
      return (
        <ArrayInput
          source="constraints[0].rightOperand"
          label={translate(
            "resources.policies.create.permissions.selectCountries"
          )}
        >
          <SimpleFormIterator inline>
            <SelectInput source="" choices={countriesList} />
          </SimpleFormIterator>
        </ArrayInput>
      );
    }
    return (
      <SelectInput
        source="constraints[0].rightOperand"
        choices={countriesList}
        label={translate("resources.policies.create.permissions.selectCountry")}
      />
    );
  };

  return (
    <>
      <Typography sx={{ mt: 2 }}>
        {translate(
          "resources.policies.create.permissions.locationBasedPermission"
        )}
      </Typography>
      <TextInput
        source="constraints[0].leftOperand"
        defaultValue="edc:location"
        style={{ display: "none" }}
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
        validate={[required()]}
      />
      {renderInput()}
    </>
  );
};
