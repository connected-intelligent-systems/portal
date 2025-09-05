import {
  Labeled,
  TextField,
  FunctionField,
  useRecordContext,
  useTranslate,
} from "react-admin";
import { Typography, Box } from "@mui/material";
import { PasswordField } from "../../../../components/password_field";

const HttpDataShow = () => {
  const translate = useTranslate();

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {translate("resources.assets.show.tabs.dataAddress.httpConfiguration")}
      </Typography>

      <Labeled
        fullWidth
        label={translate("resources.assets.show.tabs.dataAddress.baseUrl")}
      >
        <TextField source="dataAddress.baseUrl" />
      </Labeled>

      <Labeled
        fullWidth
        label={translate("resources.assets.show.tabs.dataAddress.acceptHeader")}
      >
        <TextField source="dataAddress.header:Accept" emptyText="-" />
      </Labeled>

      <Labeled
        fullWidth
        label={translate("resources.assets.show.tabs.dataAddress.proxyPath")}
      >
        <FunctionField
          render={(record: any) =>
            record?.dataAddress?.proxyPath === "true"
              ? translate("resources.assets.show.tabs.dataAddress.yes")
              : translate("resources.assets.show.tabs.dataAddress.no")
          }
        />
      </Labeled>

      <Labeled
        fullWidth
        label={translate(
          "resources.assets.show.tabs.dataAddress.proxyQueryParams"
        )}
      >
        <FunctionField
          render={(record: any) =>
            record?.dataAddress?.proxyQueryParams === "true"
              ? translate("resources.assets.show.tabs.dataAddress.yes")
              : translate("resources.assets.show.tabs.dataAddress.no")
          }
        />
      </Labeled>

      <Labeled
        fullWidth
        label={translate("resources.assets.show.tabs.dataAddress.proxyBody")}
      >
        <FunctionField
          render={(record: any) =>
            record?.dataAddress?.proxyBody === "true"
              ? translate("resources.assets.show.tabs.dataAddress.yes")
              : translate("resources.assets.show.tabs.dataAddress.no")
          }
        />
      </Labeled>

      <Labeled
        fullWidth
        label={translate("resources.assets.show.tabs.dataAddress.proxyMethod")}
      >
        <FunctionField
          render={(record: any) =>
            record?.dataAddress?.proxyMethod === "true"
              ? translate("resources.assets.show.tabs.dataAddress.yes")
              : translate("resources.assets.show.tabs.dataAddress.no")
          }
        />
      </Labeled>

      <Labeled
        fullWidth
        label={translate(
          "resources.assets.show.tabs.dataAddress.authorizationHeader"
        )}
      >
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
  const translate = useTranslate();

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {translate("resources.assets.show.tabs.dataAddress.s3Configuration")}
      </Typography>

      <Labeled
        fullWidth
        label={translate("resources.assets.show.tabs.dataAddress.region")}
      >
        <TextField source="dataAddress.region" />
      </Labeled>

      <Labeled
        fullWidth
        label={translate(
          "resources.assets.show.tabs.dataAddress.endpointOverride"
        )}
      >
        <TextField source="dataAddress.endpointOverride" emptyText="-" />
      </Labeled>

      <Labeled
        fullWidth
        label={translate("resources.assets.show.tabs.dataAddress.bucketName")}
      >
        <TextField source="dataAddress.bucketName" />
      </Labeled>

      <Labeled
        fullWidth
        label={translate("resources.assets.show.tabs.dataAddress.objectName")}
      >
        <TextField source="dataAddress.objectName" emptyText="-" />
      </Labeled>

      <Labeled
        fullWidth
        label={translate("resources.assets.show.tabs.dataAddress.objectPrefix")}
      >
        <TextField source="dataAddress.objectPrefix" emptyText="-" />
      </Labeled>

      <Labeled
        fullWidth
        label={translate("resources.assets.show.tabs.dataAddress.accessKeyId")}
      >
        <TextField source="dataAddress.accessKeyId" emptyText="-" />
      </Labeled>

      <Labeled
        fullWidth
        label={translate(
          "resources.assets.show.tabs.dataAddress.secretAccessKey"
        )}
      >
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
  const translate = useTranslate();

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {translate("resources.assets.show.tabs.dataAddress.description")}
      </Typography>

      <Labeled
        fullWidth
        label={translate(
          "resources.assets.show.tabs.dataAddress.dataAddressType"
        )}
      >
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
