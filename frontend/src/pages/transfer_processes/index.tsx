import {
  Create,
  SimpleForm,
  TextInput,
  SelectInput,
  required,
  FormDataConsumer,
} from "react-admin";
import { useFormContext, useWatch } from "react-hook-form";
import { useEffect } from "react";
import { TransferProcessesList } from "./TransferProcessesList";
import { TransferProcessesShow } from "./TransferProcessesShow";

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

const HttpDataPush = () => (
  <>
    <TextInput
      source="dataDestination.baseUrl"
      label="Base URL"
      helperText="The base URL where the data will be pushed"
      validate={[required()]}
      fullWidth
    />
  </>
);

const AmazonS3Push = () => (
  <>
    <TextInput
      source="dataDestination.region"
      label="Region"
      helperText="The region of the Amazon S3 bucket"
      validate={[required()]}
      fullWidth
    />
    <TextInput
      source="dataDestination.endpointOverride"
      label="Endpoint Override"
      helperText="The endpoint override of the Amazon S3 bucket"
      fullWidth
    />
    <TextInput
      source="dataDestination.bucketName"
      label="Bucket Name"
      helperText="The name of the Amazon S3 bucket"
      validate={[required()]}
      fullWidth
    />
    <TextInput
      source="dataDestination.objectName"
      label="Object Name"
      helperText="The name of the object in the Amazon S3 bucket"
      validate={[required()]}
      fullWidth
    />
    <TextInput
      source="dataDestination.accessKeyId"
      label="Access Key Id"
      helperText="The access key id of the Amazon S3 bucket"
      validate={[required()]}
      fullWidth
    />
    <TextInput
      source="dataDestination.secretAccessKey"
      label="Secret Access Key"
      helperText="The secret access key of the Amazon S3 bucket"
      validate={[required()]}
      fullWidth
    />
  </>
);

export const TransferProcessesCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <TextInput
          label="Counter Party Address"
          source="counterPartyAddress"
          helperText="The address of the counter party"
          fullWidth
        />
        <TextInput
          source="contractId"
          helperText="The contract agreement id"
          fullWidth
        />
        <TextInput source="assetId" helperText="The asset id" fullWidth />
        <TextInput
          source="protocol"
          defaultValue="dataspace-protocol-http"
          helperText="The dataspace protocol to use"
          fullWidth
        />
        <SelectInput
          source="transferType"
          label="Transfer Type"
          validate={[required()]}
          choices={[
            { id: "HttpData-PULL", name: "HttpData-PULL" },
            { id: "HttpData-PUSH", name: "HttpData-PUSH" },
            { id: "AmazonS3-PUSH", name: "AmazonS3-PUSH" },
          ]}
          helperText="The type of transfer"
        />
        <TextInput
          source="dataDestination.type"
          defaultValue="HttpData"
          helperText="The type of data destination"
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
  return (
    <Create resource="terminatetransferprocess" redirect="list">
      <SimpleForm>
        <TextInput source="id" disabled />
        <TextInput source="reason" multiline rows={4} />
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
