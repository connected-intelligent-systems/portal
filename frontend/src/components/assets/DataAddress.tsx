import {
  Labeled,
  TextField,
  FunctionField,
  useRecordContext,
  useTranslate,
} from "react-admin";
import { Typography, Box } from "@mui/material";
import { PasswordField } from "../password_field";

const resolveBooleanDisplay = (value: unknown, translate: any) => {
  if (value === undefined || value === null || value === "") {
    return "-";
  }

  const normalized =
    typeof value === "string" ? value.toLowerCase() : value === true;

  if (normalized === true || normalized === "true") {
    return translate("resources.assets.tabs.dataAddressTab.yes");
  }

  if (normalized === false || normalized === "false") {
    return translate("resources.assets.tabs.dataAddressTab.no");
  }

  return String(value);
};

const HttpData = () => {
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
        <TextField source="dataAddress.baseUrl" emptyText="-" />
      </Labeled>

      <Labeled
        fullWidth
        label={translate("resources.assets.tabs.dataAddressTab.acceptHeader")}
      >
        <FunctionField
          render={(record: any) =>
            record?.dataAddress?.["header:Accept"] ?? "-"
          }
        />
      </Labeled>

      <Labeled
        fullWidth
        label={translate("resources.assets.tabs.dataAddressTab.proxyPath")}
      >
        <FunctionField
          render={(record: any) =>
            resolveBooleanDisplay(record?.dataAddress?.proxyPath, translate)
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
            resolveBooleanDisplay(
              record?.dataAddress?.proxyQueryParams,
              translate
            )
          }
        />
      </Labeled>

      <Labeled
        fullWidth
        label={translate("resources.assets.tabs.dataAddressTab.proxyBody")}
      >
        <FunctionField
          render={(record: any) =>
            resolveBooleanDisplay(record?.dataAddress?.proxyBody, translate)
          }
        />
      </Labeled>

      <Labeled
        fullWidth
        label={translate("resources.assets.tabs.dataAddressTab.proxyMethod")}
      >
        <FunctionField
          render={(record: any) =>
            resolveBooleanDisplay(record?.dataAddress?.proxyMethod, translate)
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
              <Typography component="span">-</Typography>
            );
          }}
        />
      </Labeled>
    </Box>
  );
};

const AmazonS3 = () => {
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
        <TextField source="dataAddress.region" emptyText="-" />
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
        <TextField source="dataAddress.bucketName" emptyText="-" />
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

export const DataAddress = () => {
  const record = useRecordContext();
  const translate = useTranslate();
  const resolveType = (typeValue: unknown) => {
    if (!typeValue || typeof typeValue !== "string") {
      return undefined;
    }

    const normalized = typeValue.toLowerCase();

    if (
      normalized === "http" ||
      normalized === "httpdata" ||
      normalized.includes("http")
    ) {
      return "http";
    }

    if (
      normalized === "s3" ||
      normalized === "amazons3" ||
      normalized.includes("s3")
    ) {
      return "s3";
    }

    return normalized;
  };

  const dataAddressType = resolveType(record?.dataAddress?.type);

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
          if (dataAddressType === "http") {
            return <HttpData />;
          } else if (dataAddressType === "s3") {
            return <AmazonS3 />;
          }
          return null;
        }}
      />
    </Box>
  );
};
