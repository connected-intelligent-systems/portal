import { useEffect } from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  Labeled,
  DateField,
  useShowController,
  ReferenceField,
  Button,
  TopToolbar,
  useRecordContext,
} from "react-admin";
import Alert from "@mui/material/Alert";
import { Link } from "react-router-dom";
import CancelIcon from "@mui/icons-material/Cancel";
import { TransferProcess } from "../../types/transferProcess";

const TransferProcessesShowBar = () => {
  const record = useRecordContext<TransferProcess>();
  return (
    <TopToolbar>
      <Button
        component={Link}
        color="error"
        to={`/terminatetransferprocess/create?id=${record?.id}`}
        disabled={record?.state !== "STARTED"}
        label="Terminate Transfer Process"
        startIcon={<CancelIcon />}
      />
    </TopToolbar>
  );
};

export const TransferProcessesShow = () => {
  const { record } = useShowController<TransferProcess>();

  return (
    <Show actions={<TransferProcessesShowBar />}>
      <SimpleShowLayout>
        <TextField source="id" />
        <TextField source="transferDirection" label="Direction" />
        <TextField source="transferType" label="Transfer Type" />
        <DateField source="stateTimestamp" showTime label="State Timestamp" />
        <TextField source="state" />
        <TextField source="correlationId" />
        {record?.errorDetail && (
          <Labeled label="Error Detail" fullWidth>
            <Alert severity="error">{record?.errorDetail}</Alert>
          </Labeled>
        )}
        <ReferenceField
          label="Contract Agreement"
          source="contractId"
          reference="contractagreements"
          link="show"
        >
          <TextField source="id" />
        </ReferenceField>
        {record?.transferType === "HttpData-PULL" &&
          record?.transferDirection === "CONSUMER" &&
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
