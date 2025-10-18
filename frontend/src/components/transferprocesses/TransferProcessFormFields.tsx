import {
  FormDataConsumer,
  SelectInput,
  TextInput,
  required,
  useTranslate,
} from "react-admin";
import { useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import { useFormContext, useWatch } from "react-hook-form";

const TransferTypeHandler = () => {
  const transferType = useWatch({ name: "transferType" });
  const formContext = useFormContext();

  useEffect(() => {
    switch (transferType) {
      case "HttpData-PULL":
        formContext.setValue("dataDestination.type", "HttpData");
        break;
      case "HttpData-PUSH":
        formContext.setValue("dataDestination.type", "HttpData");
        break;
      case "AmazonS3-PUSH":
        formContext.setValue("dataDestination.type", "AmazonS3");
        break;
      default:
        break;
    }
  }, [transferType, formContext]);

  return null;
};

const HttpDataPush = () => {
  const translate = useTranslate();
  return (
    <TextInput
      source="dataDestination.baseUrl"
      label={translate("resources.transferprocesses.fields.baseUrl")}
      helperText={translate(
        "resources.transferprocesses.create.fields.baseUrlHelper"
      )}
      validate={[required()]}
      fullWidth
    />
  );
};

const AmazonS3Push = () => {
  const translate = useTranslate();
  return (
    <>
      <TextInput
        source="dataDestination.region"
        label={translate("resources.transferprocesses.fields.region")}
        helperText={translate(
          "resources.transferprocesses.create.fields.regionHelper"
        )}
        validate={[required()]}
        fullWidth
      />
      <TextInput
        source="dataDestination.endpointOverride"
        label={translate("resources.transferprocesses.fields.endpointOverride")}
        helperText={translate(
          "resources.transferprocesses.create.fields.endpointOverrideHelper"
        )}
        fullWidth
      />
      <TextInput
        source="dataDestination.bucketName"
        label={translate("resources.transferprocesses.fields.bucketName")}
        helperText={translate(
          "resources.transferprocesses.create.fields.bucketNameHelper"
        )}
        validate={[required()]}
        fullWidth
      />
      <TextInput
        source="dataDestination.objectName"
        label={translate("resources.transferprocesses.fields.objectName")}
        helperText={translate(
          "resources.transferprocesses.create.fields.objectNameHelper"
        )}
        validate={[required()]}
        fullWidth
      />
      <TextInput
        source="dataDestination.accessKeyId"
        label={translate("resources.transferprocesses.fields.accessKeyId")}
        helperText={translate(
          "resources.transferprocesses.create.fields.accessKeyIdHelper"
        )}
        validate={[required()]}
        fullWidth
      />
      <TextInput
        source="dataDestination.secretAccessKey"
        label={translate("resources.transferprocesses.fields.secretAccessKey")}
        helperText={translate(
          "resources.transferprocesses.create.fields.secretAccessKeyHelper"
        )}
        validate={[required()]}
        fullWidth
      />
    </>
  );
};

interface TransferProcessFormFieldsProps {
  lockCoreFields?: boolean;
  hideCoreFields?: boolean;
}

export const TransferProcessFormFields = ({
  lockCoreFields = false,
  hideCoreFields = false,
}: TransferProcessFormFieldsProps) => {
  const translate = useTranslate();
  const [showCoreFields, setShowCoreFields] = useState(!hideCoreFields);
  const toggleLabel = showCoreFields
    ? translate("resources.transferprocesses.actions.hideCoreFields", {
        _: "Hide transfer details",
      })
    : translate("resources.transferprocesses.actions.showCoreFields", {
        _: "Show transfer details",
      });

  const coreFields = (
    <>
      <TextInput
        label={translate(
          "resources.transferprocesses.fields.counterPartyAddress"
        )}
        source="counterPartyAddress"
        helperText={translate(
          "resources.transferprocesses.create.fields.counterPartyAddressHelper"
        )}
        fullWidth
        InputProps={lockCoreFields ? { readOnly: true } : undefined}
      />
      <TextInput
        label={translate("resources.transferprocesses.fields.contractId")}
        source="contractId"
        helperText={translate(
          "resources.transferprocesses.create.fields.contractIdHelper"
        )}
        fullWidth
        InputProps={lockCoreFields ? { readOnly: true } : undefined}
      />
      <TextInput
        label={translate("resources.transferprocesses.fields.assetId")}
        source="assetId"
        helperText={translate(
          "resources.transferprocesses.create.fields.assetIdHelper"
        )}
        fullWidth
        InputProps={lockCoreFields ? { readOnly: true } : undefined}
      />
      <TextInput
        label={translate("resources.transferprocesses.fields.protocol")}
        source="protocol"
        defaultValue="dataspace-protocol-http"
        helperText={translate(
          "resources.transferprocesses.create.fields.protocolHelper"
        )}
        fullWidth
        InputProps={lockCoreFields ? { readOnly: true } : undefined}
      />
    </>
  );

  return (
    <>
      {hideCoreFields ? (
        <Accordion
          disableGutters
          elevation={0}
          expanded={showCoreFields}
          onChange={(_, expanded) => setShowCoreFields(expanded)}
          sx={{
            border: (theme) => `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle2">{toggleLabel}</Typography>
          </AccordionSummary>
          <AccordionDetails>{coreFields}</AccordionDetails>
        </Accordion>
      ) : (
        coreFields
      )}
      <SelectInput
        source="transferType"
        label={translate("resources.transferprocesses.fields.transferType")}
        validate={[required()]}
        choices={[
          { id: "HttpData-PULL", name: "HttpData-PULL" },
          { id: "HttpData-PUSH", name: "HttpData-PUSH" },
          { id: "AmazonS3-PUSH", name: "AmazonS3-PUSH" },
        ]}
        helperText={translate(
          "resources.transferprocesses.create.fields.transferTypeHelper"
        )}
      />
      <TextInput
        label={translate(
          "resources.transferprocesses.fields.dataDestinationType"
        )}
        source="dataDestination.type"
        helperText={translate(
          "resources.transferprocesses.create.fields.dataDestinationTypeHelper"
        )}
        fullWidth
        readOnly
      />
      <TransferTypeHandler />
      <FormDataConsumer>
        {({ formData }) => {
          switch (formData.transferType) {
            case "HttpData-PUSH":
              return <HttpDataPush />;
            case "AmazonS3-PUSH":
              return <AmazonS3Push />;
            default:
              return null;
          }
        }}
      </FormDataConsumer>
    </>
  );
};

export default TransferProcessFormFields;
