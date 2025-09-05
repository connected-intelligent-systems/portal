import { useState } from "react";
import {
  TextInput,
  BooleanInput,
  SelectInput,
  required,
  useTranslate,
} from "react-admin";
import { Typography, Box, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import * as PropTypes from "prop-types";

// AuthHeaderInput component - placeholder, you may need to implement or import this
const AuthHeaderInput = ({ translate }: { translate: any }) => (
  <TextInput
    source="dataAddress.authHeader"
    label={translate(
      "resources.assets.create.dataAddress.fields.authorizationHeader"
    )}
    helperText={translate(
      "resources.assets.create.dataAddress.fields.authorizationHeaderHelper"
    )}
    fullWidth
  />
);

const HttpDataInput = ({
  handleShowEndpoints,
  translate,
}: {
  handleShowEndpoints: () => void;
  translate: any;
}) => {
  return (
    <>
      <TextInput
        source="dataAddress.baseUrl"
        label={translate("resources.assets.create.dataAddress.fields.baseUrl")}
        helperText={translate(
          "resources.assets.create.dataAddress.fields.baseUrlHelper"
        )}
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
        label={translate(
          "resources.assets.create.dataAddress.fields.acceptHeader"
        )}
        helperText={translate(
          "resources.assets.create.dataAddress.fields.acceptHeaderHelper"
        )}
        fullWidth
      />
      <BooleanInput
        source="dataAddress.proxyPath"
        label={translate(
          "resources.assets.create.dataAddress.fields.proxyPath"
        )}
        helperText={translate(
          "resources.assets.create.dataAddress.fields.proxyPathHelper"
        )}
        defaultValue={false}
      />
      <BooleanInput
        source="dataAddress.proxyQueryParams"
        label={translate(
          "resources.assets.create.dataAddress.fields.proxyQueryParams"
        )}
        helperText={translate(
          "resources.assets.create.dataAddress.fields.proxyQueryParamsHelper"
        )}
        defaultValue={false}
      />
      <BooleanInput
        source="dataAddress.proxyBody"
        label={translate(
          "resources.assets.create.dataAddress.fields.proxyBody"
        )}
        helperText={translate(
          "resources.assets.create.dataAddress.fields.proxyBodyHelper"
        )}
        defaultValue={false}
      />
      <BooleanInput
        source="dataAddress.proxyMethod"
        label={translate(
          "resources.assets.create.dataAddress.fields.proxyMethod"
        )}
        helperText={translate(
          "resources.assets.create.dataAddress.fields.proxyMethodHelper"
        )}
        defaultValue={false}
      />
      <AuthHeaderInput translate={translate} />
    </>
  );
};

HttpDataInput.propTypes = {
  handleShowEndpoints: PropTypes.func.isRequired,
};

const AmazonS3Input = ({ translate }: { translate: any }) => {
  return (
    <>
      <TextInput
        source="dataAddress.region"
        label={translate("resources.assets.create.dataAddress.fields.region")}
        helperText={translate(
          "resources.assets.create.dataAddress.fields.regionHelper"
        )}
        fullWidth
        validate={required()}
      />
      <TextInput
        source="dataAddress.endpointOverride"
        label={translate(
          "resources.assets.create.dataAddress.fields.endpointOverride"
        )}
        helperText={translate(
          "resources.assets.create.dataAddress.fields.endpointOverrideHelper"
        )}
        fullWidth
      />
      <TextInput
        source="dataAddress.bucketName"
        label={translate(
          "resources.assets.create.dataAddress.fields.bucketName"
        )}
        helperText={translate(
          "resources.assets.create.dataAddress.fields.bucketNameHelper"
        )}
        fullWidth
        validate={required()}
      />
      <TextInput
        source="dataAddress.objectName"
        label={translate(
          "resources.assets.create.dataAddress.fields.objectName"
        )}
        helperText={translate(
          "resources.assets.create.dataAddress.fields.objectNameHelper"
        )}
        fullWidth
      />
      <TextInput
        source="dataAddress.objectPrefix"
        label={translate(
          "resources.assets.create.dataAddress.fields.objectPrefix"
        )}
        helperText={translate(
          "resources.assets.create.dataAddress.fields.objectPrefixHelper"
        )}
        fullWidth
      />
      <TextInput
        source="dataAddress.accessKeyId"
        label={translate(
          "resources.assets.create.dataAddress.fields.accessKeyId"
        )}
        helperText={translate(
          "resources.assets.create.dataAddress.fields.accessKeyIdHelper"
        )}
        fullWidth
      />
      <TextInput
        source="dataAddress.secretAccessKey"
        label={translate(
          "resources.assets.create.dataAddress.fields.secretAccessKey"
        )}
        helperText={translate(
          "resources.assets.create.dataAddress.fields.secretAccessKeyHelper"
        )}
        fullWidth
      />
    </>
  );
};

export const DataAddressStep = () => {
  const [dataType, setDataType] = useState("http");
  const translate = useTranslate();

  const handleShowEndpoints = () => {
    // Placeholder function - implement endpoint discovery logic here
    console.log("Show endpoints clicked");
  };

  const dataTypeChoices = [
    {
      id: "http",
      name: translate("resources.assets.create.dataAddress.dataTypes.http"),
    },
    {
      id: "s3",
      name: translate("resources.assets.create.dataAddress.dataTypes.s3"),
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {translate("resources.assets.create.dataAddress.description")}
      </Typography>

      <SelectInput
        source="dataAddress.type"
        label={translate("resources.assets.create.dataAddress.dataAddressType")}
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
            {translate("resources.assets.create.dataAddress.httpConfiguration")}
          </Typography>
          <HttpDataInput
            handleShowEndpoints={handleShowEndpoints}
            translate={translate}
          />
        </Box>
      )}

      {dataType === "s3" && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {translate("resources.assets.create.dataAddress.s3Configuration")}
          </Typography>
          <AmazonS3Input translate={translate} />
        </Box>
      )}
    </Box>
  );
};
