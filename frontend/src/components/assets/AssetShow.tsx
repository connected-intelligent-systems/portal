import {
  Labeled,
  Show,
  SimpleShowLayout,
  TopToolbar,
  DeleteButton,
  TextField,
  BooleanField,
  FunctionField,
  useShowController,
} from "react-admin";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import { MarkdownField } from "../markdown";
import { PasswordField } from "../password_field";

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
