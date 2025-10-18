import {
  Create,
  SimpleForm,
  TextInput,
  SelectInput,
  required,
  FormDataConsumer,
  useTranslate,
  useGetOne,
  Loading,
  SaveButton,
  Toolbar,
} from "react-admin";
import { useFormContext, useWatch } from "react-hook-form";
import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Alert } from "@mui/material";
import { TransferProcessesList } from "./TransferProcessesList";
import { TransferProcessesShow } from "./TransferProcessesShow";

const TerminateToolbar = ({ disabled }: { disabled: boolean }) => (
  <Toolbar>
    <SaveButton disabled={disabled} />
  </Toolbar>
);

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
    <>
      <TextInput
        source="dataDestination.baseUrl"
        label={translate("resources.transferprocesses.fields.baseUrl")}
        helperText={translate(
          "resources.transferprocesses.create.fields.baseUrlHelper"
        )}
        validate={[required()]}
        fullWidth
      />
    </>
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

export const TransferProcessesCreate = () => {
  const location = useLocation();
  const defaultValues = location.state?.record || {};
  const translate = useTranslate();

  return (
    <Create>
      <SimpleForm defaultValues={defaultValues}>
        <TextInput
          label={translate(
            "resources.transferprocesses.fields.counterPartyAddress"
          )}
          source="counterPartyAddress"
          helperText={translate(
            "resources.transferprocesses.create.fields.counterPartyAddressHelper"
          )}
          fullWidth
        />
        <TextInput
          label={translate("resources.transferprocesses.fields.contractId")}
          source="contractId"
          helperText={translate(
            "resources.transferprocesses.create.fields.contractIdHelper"
          )}
          fullWidth
        />
        <TextInput
          label={translate("resources.transferprocesses.fields.assetId")}
          source="assetId"
          helperText={translate(
            "resources.transferprocesses.create.fields.assetIdHelper"
          )}
          fullWidth
        />
        <TextInput
          label={translate("resources.transferprocesses.fields.protocol")}
          source="protocol"
          defaultValue="dataspace-protocol-http"
          helperText={translate(
            "resources.transferprocesses.create.fields.protocolHelper"
          )}
          fullWidth
        />
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
      </SimpleForm>
    </Create>
  );
};

export const TransferProcessTerminate = () => {
  const translate = useTranslate();
  const { id } = useParams<{ id: string }>();

  const { data: transferProcess, isLoading } = useGetOne(
    "transferprocesses",
    { id: id || "" },
    { enabled: !!id }
  );

  if (isLoading) {
    return <Loading />;
  }

  const isCompleted = transferProcess?.state === "COMPLETED";

  return (
    <Create
      resource="terminatetransferprocess"
      redirect="/transferprocesses"
      transform={(data: any) => ({ ...data, id })}
    >
      <SimpleForm toolbar={<TerminateToolbar disabled={isCompleted} />}>
        {isCompleted && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {translate(
              "resources.transferprocesses.messages.cannotTerminateCompleted"
            )}
          </Alert>
        )}
        <TextInput
          source="id"
          label={translate("resources.transferprocesses.fields.id")}
          defaultValue={id || ""}
          disabled
        />
        <TextInput
          source="reason"
          label={translate("resources.transferprocesses.fields.reason")}
          multiline
          rows={4}
          disabled={isCompleted}
        />
      </SimpleForm>
    </Create>
  );
};

export default {
  list: TransferProcessesList,
  show: TransferProcessesShow,
  create: TransferProcessesCreate,
  terminate: TransferProcessTerminate,
};
