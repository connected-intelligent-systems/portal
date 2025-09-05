import {
  Labeled,
  TextField,
  FunctionField,
  useRecordContext,
  useTranslate,
} from "react-admin";
import { Typography, Box } from "@mui/material";
import { PasswordField } from "../../../../components/password_field";

const HttpDataTab = () => {
  const translate = useTranslate();

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {translate("resources.assets.tabs.dataAddressTab.httpConfiguration")}
      </Typography>

      <Labeled
        fullWidth
        label={translate("resources.assets.tabs.dataAddressTab.baseUrl")}
      >
        <TextField source="dataAddress.baseUrl" />
      </Labeled>

      <Labeled
        fullWidth
        label={translate("resources.assets.tabs.dataAddressTab.acceptHeader")}
      >
        <TextField source="dataAddress.header:Accept" emptyText="-" />
      </Labeled>

      <Labeled
        fullWidth
        label={translate("resources.assets.tabs.dataAddressTab.proxyPath")}
      >
        <FunctionField
          render={(record: any) =>
            record?.dataAddress?.proxyPath === "true"
              ? translate("resources.assets.tabs.dataAddressTab.yes")
              : translate("resources.assets.tabs.dataAddressTab.no")
          }
        />
      </Labeled>

      <Labeled
        fullWidth
        label={translate(
          "resources.assets.tabs.dataAddressTab.proxyQueryParams"
        )}
      >
        <FunctionField
          render={(record: any) =>
            record?.dataAddress?.proxyQueryParams === "true"
              ? translate("resources.assets.tabs.dataAddressTab.yes")
              : translate("resources.assets.tabs.dataAddressTab.no")
          }
        />
      </Labeled>

      <Labeled
        fullWidth
        label={translate("resources.assets.tabs.dataAddressTab.proxyBody")}
      >
        <FunctionField
          render={(record: any) =>
            record?.dataAddress?.proxyBody === "true"
              ? translate("resources.assets.tabs.dataAddressTab.yes")
              : translate("resources.assets.tabs.dataAddressTab.no")
          }
        />
      </Labeled>

      <Labeled
        fullWidth
        label={translate("resources.assets.tabs.dataAddressTab.proxyMethod")}
      >
        <FunctionField
          render={(record: any) =>
            record?.dataAddress?.proxyMethod === "true"
              ? translate("resources.assets.tabs.dataAddressTab.yes")
              : translate("resources.assets.tabs.dataAddressTab.no")
          }
        />
      </Labeled>

      <Labeled
        fullWidth
        label={translate(
          "resources.assets.tabs.dataAddressTab.authorizationHeader"
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

const AmazonS3Tab = () => {
  const translate = useTranslate();

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {translate("resources.assets.tabs.dataAddressTab.s3Configuration")}
      </Typography>

      <Labeled
        fullWidth
        label={translate("resources.assets.tabs.dataAddressTab.region")}
      >
        <TextField source="dataAddress.region" />
      </Labeled>

      <Labeled
        fullWidth
        label={translate(
          "resources.assets.tabs.dataAddressTab.endpointOverride"
        )}
      >
        <TextField source="dataAddress.endpointOverride" emptyText="-" />
      </Labeled>

      <Labeled
        fullWidth
        label={translate("resources.assets.tabs.dataAddressTab.bucketName")}
      >
        <TextField source="dataAddress.bucketName" />
      </Labeled>

      <Labeled
        fullWidth
        label={translate("resources.assets.tabs.dataAddressTab.objectName")}
      >
        <TextField source="dataAddress.objectName" emptyText="-" />
      </Labeled>

      <Labeled
        fullWidth
        label={translate("resources.assets.tabs.dataAddressTab.objectPrefix")}
      >
        <TextField source="dataAddress.objectPrefix" emptyText="-" />
      </Labeled>

      <Labeled
        fullWidth
        label={translate("resources.assets.tabs.dataAddressTab.accessKeyId")}
      >
        <TextField source="dataAddress.accessKeyId" emptyText="-" />
      </Labeled>

      <Labeled
        fullWidth
        label={translate(
          "resources.assets.tabs.dataAddressTab.secretAccessKey"
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

export const DataAddressTab = () => {
  const record = useRecordContext();
  const translate = useTranslate();

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {translate("resources.assets.tabs.dataAddressTab.description")}
      </Typography>

      <Labeled
        fullWidth
        label={translate(
          "resources.assets.tabs.dataAddressTab.dataAddressType"
        )}
      >
        <TextField source="dataAddress.type" />
      </Labeled>

      <FunctionField
        render={() => {
          if (record?.dataAddress?.type === "http") {
            return <HttpDataTab />;
          } else if (record?.dataAddress?.type === "s3") {
            return <AmazonS3Tab />;
          }
          return null;
        }}
      />
    </Box>
  );
};
