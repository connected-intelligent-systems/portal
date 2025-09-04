import { useEffect, useState } from "react";
import {
  Labeled,
  Create,
  TextInput,
  SimpleForm,
  BooleanInput,
  SelectInput,
  required,
  FormDataConsumer,
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
import { useFormContext } from "react-hook-form";
import { MarkdownInput } from "../markdown";

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

interface Endpoint {
  target: { value: string };
  title: { value: string };
}

const SelectThingEndpoints = () => {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
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

const HttpDataInput = ({ handleShowEndpoints }: { handleShowEndpoints: () => void; }) => {
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
          <MarkdownInput source="properties.description" />
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
