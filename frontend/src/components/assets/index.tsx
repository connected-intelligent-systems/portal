import { useEffect, useState } from "react";
import {
  Labeled,
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
  BooleanInput,
  BooleanField,
  SelectInput,
  required,
  FunctionField,
  FormDataConsumer,
  useShowController,
} from "react-admin";
import PropTypes from "prop-types";
import InputAdornment from "@mui/material/InputAdornment";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useFormContext } from "react-hook-form";
import { MarkdownField, MarkdownInput } from "../markdown";
import { PasswordField } from "../password_field";

const ThingEndpointsQuery = `
PREFIX iot: <http://iotschema.org/>
PREFIX td: <https://www.w3.org/2019/wot/td#>

SELECT ?thing ?title ?target ?name ?type WHERE {
  GRAPH ?g {
    ?thing ?type ?affordance .
    ?affordance td:name ?name .
    ?affordance td:hasForm ?form .
    ?form <https://www.w3.org/2019/wot/hypermedia#hasTarget> ?target .
    ?thing td:hasActionAffordance ?affordance .
    ?thing td:title ?title .
  }
} 
`;

const SelectThingEndpoints = () => {
  const [endpoints, setEndpoints] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/registry/sparql", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ query: ThingEndpointsQuery }),
      });
      const data = await response.json();
      setEndpoints(data.results.bindings);
    };
    fetchData();
  }, []);

  return (
    <SelectInput
      validate={required()}
      source="dataAddress.baseUrl"
      label="Thing Endpoint"
      choices={endpoints.map((e) => ({
        id: e.target.value,
        name: e.target.value + " - " + e.title.value,
      }))}
    />
  );
};

export const AssetsList = () => (
  <List empty={false} hasCreate={true} exporter={false}>
    <Datagrid
      style={{ tableLayout: "fixed" }}
      bulkActionButtons={false}
      rowClick="show"
    >
      <TextField source="id" sortable={false} />
      <TextField source="properties.name" label="Name" sortable={false} />
      <TextField
        source="properties.type"
        label="Type"
        sortable={false}
        defaultValue="-"
      />
      <TextField
        source="dataAddress.type"
        label="Data Address Type"
        sortable={false}
      />
    </Datagrid>
  </List>
);

const AssetShowBar = () => {
  return (
    <TopToolbar>
      <DeleteButton mutationMode="pessimistic" />
    </TopToolbar>
  );
};

const HttpDataShow = () => {
  return (
    <SimpleShowLayout sx={{ mt: 0, pt: 0 }}>
      <Labeled fullWidth label="Base URL">
        <TextField source="dataAddress.baseUrl" />
      </Labeled>
      <Labeled fullWidth label="Accept Header">
        <TextField source="dataAddress.header:Accept" emptyText="-" />
      </Labeled>
      <Labeled fullWidth label="Proxy Path">
        <FunctionField
          source="dataAddress.proxyPath"
          render={(record) => (
            <BooleanField
              record={{ value: record.dataAddress.proxyPath === "true" }}
              source="value"
            />
          )}
        />
      </Labeled>
      <Labeled fullWidth label="Proxy Query Params">
        <FunctionField
          source="dataAddress.proxyQueryParams"
          render={(record) => (
            <BooleanField
              record={{
                value: record.dataAddress.proxyQueryParams === "true",
              }}
              source="value"
            />
          )}
        />
      </Labeled>
      <Labeled fullWidth label="Proxy Body">
        <FunctionField
          source="dataAddress.proxyBody"
          render={(record) => (
            <BooleanField
              record={{ value: record.dataAddress.proxyBody === "true" }}
              source="value"
            />
          )}
        />
      </Labeled>
      <Labeled fullWidth label="Proxy Method">
        <FunctionField
          source="dataAddress.proxyMethod"
          render={(record) => (
            <BooleanField
              record={{
                value: record.dataAddress.proxyMethod === "true",
              }}
              source="value"
            />
          )}
        />
      </Labeled>
      <Labeled fullWidth label="Authorization Key">
        <TextField source="dataAddress.authKey" emptyText="-" />
      </Labeled>
      <Labeled fullWidth label="Authorization Token">
        <FunctionField
          source="dataAddress.authCode"
          render={(record) => {
            return record.dataAddress.authCode ? (
              <PasswordField source="dataAddress.authCode"></PasswordField>
            ) : (
              <TextField source="dataAddress.authCode" emptyText="-" />
            );
          }}
        ></FunctionField>
      </Labeled>
    </SimpleShowLayout>
  );
};

HttpDataShow.propTypes = {
  record: PropTypes.object,
};

const AmazonS3Show = () => {
  return (
    <SimpleShowLayout sx={{ mt: 0, pt: 0 }}>
      <Labeled fullWidth label="Region">
        <TextField source="dataAddress.region" />
      </Labeled>
      <Labeled fullWidth label="Endpoint Override">
        <TextField source="dataAddress.endpointOverride" emptyText="-" />
      </Labeled>
      <Labeled fullWidth label="Bucket Name">
        <TextField source="dataAddress.bucketName" />
      </Labeled>
      <Labeled fullWidth label="Object Name">
        <TextField source="dataAddress.objectName" emptyText="-" />
      </Labeled>
      <Labeled fullWidth label="Object Prefix">
        <TextField source="dataAddress.objectPrefix" emptyText="-" />
      </Labeled>
      <Labeled fullWidth label="Access Key ID">
        <TextField source="dataAddress.accessKeyId" emptyText="-" />
      </Labeled>
      <Labeled fullWidth label="Secret Access Key">
        <FunctionField
          source="dataAddress.secretAccessKey"
          render={(record) => {
            return record.dataAddress.secretAccessKey ? (
              <PasswordField source="dataAddress.secretAccessKey"></PasswordField>
            ) : (
              <TextField source="dataAddress.secretAccessKey" emptyText="-" />
            );
          }}
        ></FunctionField>
      </Labeled>
    </SimpleShowLayout>
  );
};

AmazonS3Show.propTypes = {
  record: PropTypes.object,
};

export const AssetShow = () => {
  const { record } = useShowController();
  return (
    <Show actions={<AssetShowBar />}>
      <SimpleShowLayout>
        <FunctionField
          source="name"
          render={(record) => (
            <>
              <Typography variant="h6">{record.properties.name}</Typography>
              <Typography variant="caption">{record.id}</Typography>
            </>
          )}
        />
        <Labeled fullWidth label="Description">
          <MarkdownField source="properties.description" />
        </Labeled>
        <Labeled fullWidth label="Type">
          <TextField source="properties.type" defaultValue="-" />
        </Labeled>
        <Labeled fullWidth label="Content Type">
          <TextField source="properties.contenttype" />
        </Labeled>
        <Labeled fullWidth label="Type">
          <TextField source="dataAddress.type" />
        </Labeled>
      </SimpleShowLayout>
      {record?.dataAddress?.type === "HttpData" && (
        <HttpDataShow record={record}></HttpDataShow>
      )}
      {record?.dataAddress?.type === "AmazonS3" && (
        <AmazonS3Show record={record}></AmazonS3Show>
      )}
    </Show>
  );
};

// input component for AuthKey & AuthCode
const AuthHeaderInput = () => {
  const [showAuthHeader, setShowAuthHeader] = useState(false);
  const { unregister } = useFormContext();

  useEffect(() => {
    if (!showAuthHeader) {
      // need to unregister, to properly remove from form state
      unregister("dataAddress.authKey");
      unregister("dataAddress.authCode");
    }
  }, [showAuthHeader, unregister]);
  return (
    <>
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={showAuthHeader}
              onChange={() => setShowAuthHeader((v) => !v)}
            />
          }
          label="Add Auth Header"
        />
      </FormGroup>
      {showAuthHeader && (
        <>
          <TextInput
            source="dataAddress.authKey"
            label="Header Name"
            helperText="Name of the auth header, e.g. Authorization, X-Api-Key, ..."
            validate={required()}
            fullWidth
          />
          <TextInput
            source="dataAddress.authCode"
            label="Authorization Token"
            helperText="Authorization Token"
            validate={required()}
            fullWidth
          />
        </>
      )}
    </>
  );
};

const HttpDataInput = ({ handleShowEndpoints }) => {
  return (
    <>
      <TextInput
        source="dataAddress.baseUrl"
        label="Base URL"
        helperText="The base URL of the data address e.g. http://example.com/api/v1/"
        fullWidth
        validate={required()}
        InputProps={{
          endAdornment: window.config.showQuery ? (
            <InputAdornment position="end">
              <IconButton onClick={handleShowEndpoints}>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
      />
      <TextInput
        source="dataAddress.header:Accept"
        label="Accept Header"
        helperText="The accept header of the data address e.g. application/json"
        fullWidth
      />
      <BooleanInput
        source="dataAddress.proxyPath"
        helperText="Allows specifying additional path segments."
        defaultValue={"false"}
        parse={(v) => (v ? "true" : "false")}
        format={(v) => v === "true"}
      />
      <BooleanInput
        source="dataAddress.proxyQueryParams"
        helperText="Allows specifying query params."
        defaultValue={"false"}
        parse={(v) => (v ? "true" : "false")}
        format={(v) => v === "true"}
      />
      <BooleanInput
        source="dataAddress.proxyBody"
        helperText="Allows attaching a body."
        defaultValue={"false"}
        parse={(v) => (v ? "true" : "false")}
        format={(v) => v === "true"}
      />
      <BooleanInput
        source="dataAddress.proxyMethod"
        helperText="Allows specifying the Http Method (default `GET`)"
        defaultValue={"false"}
        parse={(v) => (v ? "true" : "false")}
        format={(v) => v === "true"}
      />
      <AuthHeaderInput />
    </>
  );
};

HttpDataInput.propTypes = {
  handleShowEndpoints: PropTypes.func.isRequired,
};

const AmazonS3Input = () => {
  return (
    <>
      <TextInput
        source="dataAddress.region"
        label="Region"
        helperText="The region of the S3 bucket."
        fullWidth
        validate={required()}
      />
      <TextInput
        source="dataAddress.endpointOverride"
        label="Endpoint Override"
        helperText="The endpoint override of the S3 bucket."
        fullWidth
      />
      <TextInput
        source="dataAddress.bucketName"
        label="Bucket Name"
        helperText="The name of the S3 bucket."
        fullWidth
        validate={required()}
      />
      <TextInput
        source="dataAddress.objectName"
        label="Object Name"
        helperText="The name of the S3 object."
        fullWidth
      />
      <TextInput
        source="dataAddress.objectPrefix"
        label="Object Prefix"
        helperText="The prefix of the S3 object."
        fullWidth
      />
      <TextInput
        source="dataAddress.accessKeyId"
        label="Access Key ID"
        helperText="The access key ID of the S3 bucket."
        fullWidth
      />
      <TextInput
        source="dataAddress.secretAccessKey"
        label="Secret Access Key"
        helperText="The secret access key of the S3 bucket."
        fullWidth
      />
    </>
  );
};

export const AssetCreate = () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Create>
      <SimpleForm>
        <Dialog open={open} onClose={handleClose} fullWidth>
          <DialogTitle>Select Endpoint</DialogTitle>
          <DialogContent>
            <SelectThingEndpoints />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>OK</Button>
          </DialogActions>
        </Dialog>
        <TextInput
          source="properties.name"
          label="Asset Name"
          fullWidth
          validate={required()}
        />
        <Labeled fullWidth label="Description">
          <MarkdownInput source="properties.description" label="Description" />
        </Labeled>
        <TextInput source="properties.type" label="Asset Type" fullWidth />
        <TextInput
          source="properties.contenttype"
          label="Content Type"
          defaultValue="application/json"
          helperText="The content type of the asset."
          fullWidth
          validate={required()}
        />
        <SelectInput
          source="dataAddress.type"
          label="Data Address Type"
          defaultValue="HttpData"
          helperText="The type of the data address e.g. HttpData"
          fullWidth
          validate={required()}
          choices={[
            { id: "HttpData", name: "HttpData" },
            { id: "AmazonS3", name: "AmazonS3" },
          ]}
        />
        <FormDataConsumer>
          {({ formData }) => {
            if (
              formData.dataAddress &&
              formData.dataAddress.type === "HttpData"
            ) {
              return <HttpDataInput handleShowEndpoints={handleClickOpen} />;
            } else if (
              formData.dataAddress &&
              formData.dataAddress.type === "AmazonS3"
            ) {
              return <AmazonS3Input />;
            }
            return null;
          }}
        </FormDataConsumer>
      </SimpleForm>
    </Create>
  );
};
