import React from "react";
import {
  Create,
  TextInput,
  SimpleForm,
  SelectInput,
  required,
  ArrayInput,
  SimpleFormIterator,
  DateTimeInput,
  useInput,
  FormDataConsumer,
  useArrayInput,
} from "react-admin";
import { countries, getEmojiFlag } from "countries-list";
import {
  Grid,
  Menu,
  IconButton,
  ListItemIcon,
  MenuItem,
  Typography,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const countriesList = Object.keys(countries).map((key) => ({
  id: key,
  name: `${getEmojiFlag(key as keyof typeof countries)} ${
    countries[key as keyof typeof countries].name
  }`,
}));

const CustomAddButton = () => {
  const context = useArrayInput();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleAdd = (event: React.MouseEvent<HTMLElement>) => {
    const value = (event.target as HTMLElement).getAttribute("value");
    context.append({ type: value });
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton color="primary" onClick={handleClick}>
        <AddCircleOutlineIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem value="time" onClick={handleAdd} disableRipple>
          <ListItemIcon>
            <AccessTimeIcon />
          </ListItemIcon>
          Time Based
        </MenuItem>
        <MenuItem value="identity" onClick={handleAdd} disableRipple>
          <ListItemIcon>
            <PermIdentityIcon />
          </ListItemIcon>
          Identity Based
        </MenuItem>
        <MenuItem value="location" onClick={handleAdd} disableRipple>
          <ListItemIcon>
            <LocationOnIcon />
          </ListItemIcon>
          Location Based
        </MenuItem>
      </Menu>
    </>
  );
};

const IdentityBasedPermission = () => {
  const {
    field: { value: operatorValue },
  } = useInput({ source: "operator" });
  const selectMultiple =
    operatorValue === "odrl:isNoneOf" || operatorValue === "odrl:isPartOf";

  const renderInput = () => {
    if (selectMultiple) {
      return (
        <ArrayInput source="rightOperand" label="Identities">
          <SimpleFormIterator inline>
            <TextInput source="" label="Identity" />
          </SimpleFormIterator>
        </ArrayInput>
      );
    }
    return <TextInput source="rightOperand" label="Identity" />;
  };

  return (
    <>
      <Typography sx={{ mt: 2 }}>Identity Based Permission</Typography>
      <TextInput
        source="leftOperand"
        defaultValue="edc:participantId"
        label={false}
        sx={{ display: "none" }}
      />
      <SelectInput
        source="operator"
        label="Operator"
        choices={[
          { id: "odrl:eq", name: "Equals" },
          { id: "odrl:neq", name: "Not Equals" },
          { id: "odrl:isNoneOf", name: "Is None Of" },
          { id: "odrl:isPartOf", name: "Is Part Of" },
        ]}
        helperText="Select the operator"
        validate={[required()]}
      />
      {renderInput()}
    </>
  );
};

const TimeBasedPermission = () => {
  return (
    <>
      <Typography sx={{ mt: 2 }}>Time Based Permission</Typography>
      <TextInput
        source="leftOperand"
        defaultValue="edc:policyEvaluationTime"
        label={false}
        sx={{ display: "none" }}
      />
      <SelectInput
        source="operator"
        choices={[
          { id: "odrl:gt", name: "After" },
          { id: "odrl:lt", name: "Before" },
        ]}
        helperText="Select the operator"
        validate={[required()]}
      />
      <DateTimeInput
        source="rightOperand"
        helperText="Select the date"
        validate={[required()]}
      />
    </>
  );
};

const LocationBasedPermission = () => {
  const {
    field: { value: operatorValue },
  } = useInput({ source: "operator" });
  const selectMultiple =
    operatorValue === "odrl:isNoneOf" || operatorValue === "odrl:isPartOf";

  const renderInput = () => {
    if (selectMultiple) {
      return (
        <ArrayInput source="rightOperand" label="Select the countries">
          <SimpleFormIterator inline>
            <SelectInput source="" choices={countriesList} />
          </SimpleFormIterator>
        </ArrayInput>
      );
    }
    return (
      <SelectInput
        source="rightOperand"
        choices={countriesList}
        label="Select the country"
      />
    );
  };

  return (
    <>
      <Typography sx={{ mt: 2 }}>Location Based Permission</Typography>
      <TextInput
        source="leftOperand"
        defaultValue="edc:country"
        label={false}
        sx={{ display: "none" }}
      />
      <SelectInput
        source="operator"
        choices={[
          { id: "odrl:eq", name: "Equals" },
          { id: "odrl:neq", name: "Not Equals" },
          { id: "odrl:isNoneOf", name: "Is None Of" },
          { id: "odrl:isPartOf", name: "Is Part Of" },
        ]}
        validate={[required()]}
      />
      {renderInput()}
    </>
  );
};

const PermissionCreate = () => {
  const renderPermission = ({ type }: { type: string }) => {
    if (type === "time") {
      return <TimeBasedPermission />;
    }
    if (type === "identity") {
      return <IdentityBasedPermission />;
    }
    if (type === "location") {
      return <LocationBasedPermission />;
    }
    return null;
  };

  return (
    <SimpleFormIterator addButton={<CustomAddButton />}>
      <FormDataConsumer>
        {({ scopedFormData }) => {
          return renderPermission({ type: scopedFormData?.type || "" });
        }}
      </FormDataConsumer>
    </SimpleFormIterator>
  );
};

export const PolicyCreate = (props: any) => (
  <Create {...props}>
    <SimpleForm>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextInput
            source="privateProperties.name"
            label="Name"
            required
            fullWidth
            helperText="Enter a unique name for this policy"
          />
        </Grid>
        <Grid item xs={12}>
          <TextInput
            source="privateProperties.description"
            label="Description"
            fullWidth
            multiline
            rows={3}
            helperText="Provide a detailed description of this policy's purpose and scope"
          />
        </Grid>
        <Grid item xs={12}>
          <ArrayInput source="permissions">
            <PermissionCreate />
          </ArrayInput>
        </Grid>
      </Grid>
    </SimpleForm>
  </Create>
);
