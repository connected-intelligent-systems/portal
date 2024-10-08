import { useEffect } from "react";
import {
  List,
  Datagrid,
  TextField,
  Show,
  SimpleShowLayout,
  Create,
  SimpleForm,
  TextInput,
  Labeled,
  DateField,
  useShowController,
  ReferenceField,
  SelectInput,
  required,
  FormDataConsumer,
  Button,
  useRedirect,
  useRecordContext,
  TopToolbar,
  useRefresh,
} from "react-admin";
import Alert from "@mui/material/Alert";
import { Link } from "react-router-dom";
import CancelIcon from "@mui/icons-material/Cancel";

export const TransferProcessesList = () => (
  <List empty={false} exporter={false} >
    <Datagrid bulkActionButtons={false} rowClick="show">
      <TextField source="id" sortable={false} />
      <TextField source="type" sortable={false} />
      <TextField source="state" sortable={false} />
      <TextField source="transferType" label="Transfer Type" />
      <TextField
        label="Data Destination Type"
        source="dataDestination.type"
        sortable={false}
      />
      <DateField
        label="State Timestamp"
        source="stateTimestamp"
        sortable={false}
        showTime
      />
    </Datagrid>
  </List>
);

const TransferProcessesShowBar = () => {
  const record = useRecordContext();
  return (
    <TopToolbar>
      <Button
        component={Link}
        color="error"
        to={{
          pathname: `/transferprocesses/${record?.["@id"]}/terminate`,
        }}
        disabled={record?.state !== "STARTED"}
        label="Terminate Transfer Process"
        startIcon={<CancelIcon />}
      />
    </TopToolbar>
  );
};

export const TransferProcessesShow = () => {
  const { record } = useShowController();
  const refresh = useRefresh();

  useEffect(() => {
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, [refresh]);

  return (
    <Show actions={<TransferProcessesShowBar />}>
      <SimpleShowLayout>
        <TextField source="id" />
        <TextField source="type" />
        <TextField source="transferType" label="Transfer Type" />
        <DateField source="stateTimestamp" showTime label="State Timestamp" />
        <TextField source="state" />
        {record?.errorDetail && (
          <Labeled label="Error Detail" fullWidth>
            <Alert severity="error">{record?.errorDetail}</Alert>
          </Labeled>
        )}
        {record?.dataDestination && (
          <Labeled label="Data Destination">
            <SimpleShowLayout>
              <TextField source="dataDestination.type" label="Type" />
            </SimpleShowLayout>
          </Labeled>
        )}
        <TextField source="correlationId" />
        <ReferenceField
          label="Contract Agreement"
          source="contractId"
          reference="contractagreements"
          link="show"
        >
          <TextField source="id" />
        </ReferenceField>
        {record?.transferType === "HttpData-PULL" &&
          record?.type === "CONSUMER" &&
          record?.state !== "TERMINATED" && (
            <ReferenceField
              source="id"
              reference="datarequests"
              link="show"
              label="Data Request"
            >
              <TextField source="id" />
            </ReferenceField>
            
          )}

      </SimpleShowLayout>
    </Show>
  );
};

export const TransferProcessesCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput
        label="Counter Party Address"
        source="counterPartyAddress"
        fullWidth
      />
      <TextInput source="contractId" fullWidth />
      <TextInput source="assetId" fullWidth />
      <TextInput
        source="protocol"
        defaultValue="dataspace-protocol-http"
        fullWidth
      />
      <SelectInput
        source="transferType"
        label="Transfer Type"
        validate={[required()]}
        choices={[
          { id: "HttpData-PULL", name: "HttpData-PULL" },
          { id: "HttpData-PUSH", name: "HttpData-PUSH" },
        ]}
      />
      <FormDataConsumer>
        {({ formData }) =>
          formData.transferType === "HttpData-PULL" && (
            <>
              <TextInput
                source="dataDestination.type"
                defaultValue="HttpData"
                fullWidth
                readOnly
              />
            </>
          )
        }
      </FormDataConsumer>
      <FormDataConsumer>
        {({ formData }) =>
          formData.transferType === "HttpData-PUSH" && (
            <>
              <TextInput
                source="dataDestination.type"
                defaultValue="HttpData"
                fullWidth
                readOnly
              />
              <TextInput
                source="dataDestination.baseUrl"
                fullWidth
                validate={[required()]}
              />
            </>
          )
        }
      </FormDataConsumer>
      <FormDataConsumer>
        {({ formData }) =>
          formData.transferType === "AmazonS3-PUSH" && (
            <>
              <TextInput
                source="dataDestination.type"
                defaultValue="AmazonS3"
                fullWidth
                readOnly
              />
              <TextInput
                source="dataDestination.region"
                fullWidth
                validate={[required()]}
              />
              <TextInput source="dataDestination.endpointOverride" fullWidth />
              <TextInput
                source="dataDestination.bucketName"
                fullWidth
                validate={[required()]}
              />
              <TextInput
                source="dataDestination.objectName"
                fullWidth
                validate={[required()]}
              />
              <TextInput
                source="dataDestination.accessKeyId"
                fullWidth
                validate={[required()]}
              />
              <TextInput
                source="dataDestination.secretAccessKey"
                fullWidth
                validate={[required()]}
              />
            </>
          )
        }
      </FormDataConsumer>
    </SimpleForm>
  </Create>
);

export const TransferProcessTerminate = () => {
  const { record } = useShowController();

  const redirect = useRedirect();
  const onRedirect = () => {
    return redirect("show", "/transferprocesses", record?.id);
  };
  return (
    <Create resource="terminatetransferprocess" redirect={onRedirect}>
      <SimpleForm>
        <TextInput source="id" defaultValue={record?.id} readOnly />
        <TextInput source="reason" multiline rows={4} />
      </SimpleForm>
    </Create>
  );
};
