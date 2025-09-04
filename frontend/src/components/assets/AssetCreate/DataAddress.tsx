import { useState } from "react";
import {
  TextInput,
  BooleanInput,
  SelectInput,
  required,
} from "react-admin";
import {
  Typography,
  Box,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import * as PropTypes from "prop-types";

// AuthHeaderInput component - placeholder, you may need to implement or import this
const AuthHeaderInput = () => (
  <TextInput
    source="dataAddress.authHeader"
    label="Authorization Header"
    helperText="The authorization header for the data address."
    fullWidth
  />
);

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
          endAdornment: window.config?.showQuery ? (
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
        label="Proxy Path"
        helperText="Allows specifying additional path segments."
        defaultValue={false}
      />
      <BooleanInput
        source="dataAddress.proxyQueryParams"
        label="Proxy Query Params"
        helperText="Allows specifying query params."
        defaultValue={false}
      />
      <BooleanInput
        source="dataAddress.proxyBody"
        label="Proxy Body"
        helperText="Allows attaching a body."
        defaultValue={false}
      />
      <BooleanInput
        source="dataAddress.proxyMethod"
        label="Proxy Method"
        helperText="Allows specifying the Http Method (default `GET`)"
        defaultValue={false}
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

export const DataAddress = () => {
  const [dataType, setDataType] = useState("http");

  const handleShowEndpoints = () => {
    // Placeholder function - implement endpoint discovery logic here
    console.log("Show endpoints clicked");
  };

  const dataTypeChoices = [
    { id: "http", name: "HTTP" },
    { id: "s3", name: "Amazon S3" },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Configure the data address for accessing this asset.
      </Typography>

      <SelectInput
        source="dataAddress.type"
        label="Data Address Type"
        choices={dataTypeChoices}
        defaultValue="http"
        fullWidth
        validate={required()}
        onChange={(event) => {
          setDataType(event.target.value);
        }}
      />

      {dataType === "http" && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            HTTP Configuration
          </Typography>
          <HttpDataInput handleShowEndpoints={handleShowEndpoints} />
        </Box>
      )}

      {dataType === "s3" && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Amazon S3 Configuration
          </Typography>
          <AmazonS3Input />
        </Box>
      )}
    </Box>
  );
};