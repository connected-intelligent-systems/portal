import {
  FunctionField,
  Labeled,
  RecordContextProvider,
  TextField,
  useRecordContext,
  useTranslate,
} from "react-admin";
import { Typography, Box } from "@mui/material";
import { PasswordField } from "../password_field";

type TranslateFn = ReturnType<typeof useTranslate>;

const getValue = (record: any, source: string) => {
  if (!record) {
    return undefined;
  }

  return source.split(".").reduce<unknown>((acc, segment) => {
    if (acc === undefined || acc === null) {
      return undefined;
    }

    if (typeof acc !== "object") {
      return undefined;
    }

    return (acc as Record<string, unknown>)[segment];
  }, record);
};

const formatBooleanValue = (value: unknown, translate: TranslateFn) => {
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

const BooleanValueField = ({ source }: { source: string }) => {
  const translate = useTranslate();

  return (
    <FunctionField
      source={source}
      render={(record: any) =>
        formatBooleanValue(getValue(record, source), translate)
      }
    />
  );
};

const MaskedValueField = ({ source }: { source: string }) => (
  <FunctionField
    source={source}
    render={(record: any) => {
      const value = getValue(record, source);

      if (!value) {
        return <Typography component="span">-</Typography>;
      }

      return (
        <RecordContextProvider value={record}>
          <PasswordField source={source} />
        </RecordContextProvider>
      );
    }}
  />
);

const HttpData = () => {
  const translate = useTranslate();

  return (
    <Box>
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
        <TextField source="dataAddress.header:Accept" emptyText="-" />
      </Labeled>

      <Labeled
        fullWidth
        label={translate("resources.assets.tabs.dataAddressTab.proxyPath")}
      >
        <BooleanValueField source="dataAddress.proxyPath" />
      </Labeled>

      <Labeled
        fullWidth
        label={translate(
          "resources.assets.tabs.dataAddressTab.proxyQueryParams"
        )}
      >
        <BooleanValueField source="dataAddress.proxyQueryParams" />
      </Labeled>

      <Labeled
        fullWidth
        label={translate("resources.assets.tabs.dataAddressTab.proxyBody")}
      >
        <BooleanValueField source="dataAddress.proxyBody" />
      </Labeled>

      <Labeled
        fullWidth
        label={translate("resources.assets.tabs.dataAddressTab.proxyMethod")}
      >
        <BooleanValueField source="dataAddress.proxyMethod" />
      </Labeled>

      <Labeled
        fullWidth
        label={translate(
          "resources.assets.tabs.dataAddressTab.authorizationHeader"
        )}
      >
        <MaskedValueField source="dataAddress.authHeader" />
      </Labeled>
    </Box>
  );
};

const AmazonS3 = () => {
  const translate = useTranslate();

  return (
    <Box>
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
        <MaskedValueField source="dataAddress.secretAccessKey" />
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
        <TextField source="dataAddress.type" emptyText="-" />
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
