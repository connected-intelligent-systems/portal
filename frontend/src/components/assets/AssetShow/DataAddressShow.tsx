import {
  Labeled,
  TextField,
  BooleanField,
  FunctionField,
  useRecordContext,
} from "react-admin";
import { Typography, Box } from "@mui/material";
import { PasswordField } from "../../password_field";

const HttpDataShow = () => {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        HTTP Configuration
      </Typography>

      <Labeled fullWidth label="Base URL">
        <TextField source="dataAddress.baseUrl" />
      </Labeled>

      <Labeled fullWidth label="Accept Header">
        <TextField source="dataAddress.header:Accept" emptyText="-" />
      </Labeled>

      <Labeled fullWidth label="Proxy Path">
        <FunctionField
          render={(record: any) =>
            record?.dataAddress?.proxyPath === "true" ? "Yes" : "No"
          }
        />
      </Labeled>

      <Labeled fullWidth label="Proxy Query Params">
        <FunctionField
          render={(record: any) =>
            record?.dataAddress?.proxyQueryParams === "true" ? "Yes" : "No"
          }
        />
      </Labeled>

      <Labeled fullWidth label="Proxy Body">
        <FunctionField
          render={(record: any) =>
            record?.dataAddress?.proxyBody === "true" ? "Yes" : "No"
          }
        />
      </Labeled>

      <Labeled fullWidth label="Proxy Method">
        <FunctionField
          render={(record: any) =>
            record?.dataAddress?.proxyMethod === "true" ? "Yes" : "No"
          }
        />
      </Labeled>

      <Labeled fullWidth label="Authorization Header">
        <FunctionField
          source="dataAddress.authHeader"
          render={(record: any) => {
            return record?.dataAddress?.authHeader ? (
              <PasswordField source="dataAddress.authHeader" />
            ) : (
              <TextField source="dataAddress.authHeader" emptyText="-" />
            );
          }}
        />
      </Labeled>
    </Box>
  );
};

const AmazonS3Show = () => {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Amazon S3 Configuration
      </Typography>

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
          render={(record: any) => {
            return record?.dataAddress?.secretAccessKey ? (
              <PasswordField source="dataAddress.secretAccessKey" />
            ) : (
              <TextField source="dataAddress.secretAccessKey" emptyText="-" />
            );
          }}
        />
      </Labeled>
    </Box>
  );
};

export const DataAddressShow = () => {
  const record = useRecordContext();

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Configuration for accessing this asset's data.
      </Typography>

      <Labeled fullWidth label="Data Address Type">
        <TextField source="dataAddress.type" />
      </Labeled>

      <FunctionField
        render={() => {
          if (record?.dataAddress?.type === "http") {
            return <HttpDataShow />;
          } else if (record?.dataAddress?.type === "s3") {
            return <AmazonS3Show />;
          }
          return null;
        }}
      />
    </Box>
  );
};
