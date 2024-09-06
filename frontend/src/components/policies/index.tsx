import React from "react";
import {
  List,
  Datagrid,
  TextField,
  Show,
  SimpleShowLayout,
  TopToolbar,
  DeleteButton,
  Create,
  TextInput,
  SimpleForm,
  SelectInput,
  DateField,
  ArrayField,
  required,
  AutocompleteInput,
  ArrayInput,
  SimpleFormIterator,
  DateTimeInput,
  useInput,
  AutocompleteArrayInput,
  FormDataConsumer,
  useArrayInput,
} from "react-admin";
import { countries, getEmojiFlag } from "countries-list";
import Grid from "@mui/material/Grid";
import Menu from "@mui/material/Menu";
import {
  IconButton,
  ListItemIcon,
  MenuItem,
  MenuList,
  Typography,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const countriesList = Object.keys(countries).map((key) => ({
  id: key,
  name: `${getEmojiFlag(key)} ${countries[key].name}`,
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
  const handleAdd = (event) => {
    context.append({ type: event.target.getAttribute("value") });
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
    operatorValue === "odrl:isAnyOf" ||
    operatorValue === "odrl:isAllOf" ||
    operatorValue === "odrl:isNoneOf";

  const renderInput = () => {
    if (selectMultiple) {
      return (
        <ArrayInput source="rightOperand" label="Identities">
          <SimpleFormIterator inline>
            <TextInput label="Identity" />
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
        defaultValue="edc:edc_identity"
        label={false}
        sx={{ display: "none" }}
      />
      <SelectInput
        source="operator"
        label="Operator"
        choices={[
          { id: "odrl:eq", name: "Equals" },
          { id: "odrl:neq", name: "Not Equals" },
          { id: "odrl:isAnyOf", name: "Is Any Of" },
          { id: "odrl:isAllOf", name: "Is All Of" },
          { id: "odrl:isNoneOf", name: "Is None Of" },
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
        defaultValue="edc:POLICY_EVALUATION_TIME"
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
    operatorValue === "odrl:isAnyOf" ||
    operatorValue === "odrl:isAllOf" ||
    operatorValue === "odrl:isNoneOf";

  const renderInput = () => {
    if (selectMultiple) {
      return (
        <AutocompleteArrayInput
          source="rightOperand"
          choices={countriesList}
          label="Select the countries"
        />
      );
    }
    return (
      <AutocompleteInput
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
        defaultValue="edc:location"
        label={false}
        sx={{ display: "none" }}
      />
      <SelectInput
        source="operator"
        choices={[
          { id: "odrl:eq", name: "Equals" },
          { id: "odrl:neq", name: "Not Equals" },
          { id: "odrl:isAnyOf", name: "Is Any Of" },
          { id: "odrl:isAllOf", name: "Is All Of" },
          { id: "odrl:isNoneOf", name: "Is None Of" },
        ]}
        validate={[required()]}
      />
      {renderInput()}
    </>
  );
};

const PolicyShowBar = () => {
  return (
    <TopToolbar>
      <DeleteButton mutationMode="pessimistic" />
    </TopToolbar>
  );
};

export const PoliciesList = () => (
  <List empty={false} exporter={false}>
    <Datagrid
      style={{ tableLayout: "fixed" }}
      bulkActionButtons={false}
      rowClick="show"
    >
      <TextField source="id" sortable={false} />
      <TextField
        source="privateProperties.name"
        label="Name"
        sortable={false}
      />
      <DateField
        showTime={true}
        source="createdAt"
        label="Created At"
        sortable={false}
      />
    </Datagrid>
  </List>
);

export const PolicyShow = () => (
  <Show actions={<PolicyShowBar />}>
    <SimpleShowLayout>
      <SimpleShowLayout>
        <TextField source="id" />
        <TextField label="Name" source="privateProperties.name" />
        <TextField
          label="Description"
          source="privateProperties.description"
          emptyText="-"
        />
        <DateField source="createdAt" label="Created At" showTime />
        <TextField label="Type" source="@type" />
        <TextField label="Policy Type" source="policy.@type" />
        <ArrayField source="policy.odrl:permission" label="Permissions">
          <Datagrid bulkActionButtons={false} rowClick={false} hover={false}>
            <TextField
              source="odrl:action.@id"
              label="Action"
              sortable={false}
            />
            <ArrayField
              source="odrl:constraint"
              label="Constraint"
              sortable={false}
            >
              <Datagrid
                bulkActionButtons={false}
                rowClick={false}
                style={{ tableLayout: "fixed" }}
                hover={false}
              >
                <TextField
                  source="odrl:leftOperand.@id"
                  label="Left Operand"
                  sortable={false}
                />
                <TextField
                  source="odrl:operator.@id"
                  label="Operator"
                  sortable={false}
                />
                <TextField
                  source="odrl:rightOperand"
                  label="Right Operand"
                  sortable={false}
                />
              </Datagrid>
            </ArrayField>
          </Datagrid>
        </ArrayField>
      </SimpleShowLayout>
    </SimpleShowLayout>
  </Show>
);

const PermissionCreate = (props: any) => {
  const renderPermission = ({ type }) => {
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
          return renderPermission({ type: scopedFormData.type });
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
          />
        </Grid>
        <Grid item xs={12}>
          <TextInput
            source="privateProperties.description"
            label="Description"
            fullWidth
            multiline
            rows={3}
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
