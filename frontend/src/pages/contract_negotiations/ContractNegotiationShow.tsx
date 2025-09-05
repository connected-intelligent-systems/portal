import {
  Show,
  SimpleShowLayout,
  TextField,
  Labeled,
  DateField,
  useShowController,
  LinearProgress,
  ReferenceField,
  Button,
  TopToolbar,
  useRecordContext,
} from "react-admin";
import { useEffect } from "react";
import Alert from "@mui/material/Alert";
import { Link } from "react-router-dom";
import CancelIcon from "@mui/icons-material/Cancel";
import { ContractNegotiation } from "../../types/contractNegotiation";

const ContractNegotiationShowBar = () => {
  const record = useRecordContext<ContractNegotiation>();
  return (
    <TopToolbar>
      <Button
        component={Link}
        to={`/terminatecontractnegotiation/create?id=${record?.id}`}
        color="error"
        label="Terminate"
        disabled={record?.state === "TERMINATED"}
        startIcon={<CancelIcon />}
      />
    </TopToolbar>
  );
};

export const ContractNegotiationShow = () => {
  const { error, isLoading, record } = useShowController<ContractNegotiation>();

  if (isLoading) {
    return <LinearProgress />;
  }

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return (
    <Show actions={<ContractNegotiationShowBar />}>
      <SimpleShowLayout>
        <TextField source="id" label="Id" />
        {record?.createdAt && (
          <DateField source="createdAt" showTime label="Created At" />
        )}
        <TextField source="type" />
        <TextField source="counterPartyAddress" label="Counter Party Address" />
        <TextField source="counterPartyId" label="Counter Party Id" />
        <TextField source="protocol" />
        <TextField source="state" />
        {record?.contractAgreementId && (
          <ReferenceField
            source="contractAgreementId"
            reference="contractagreements"
            link="show"
            label="Contract Agreement"
          >
            <TextField source="id" />
          </ReferenceField>
        )}
        {record?.errorDetail && (
          <Labeled label="Error Detail" fullWidth>
            <Alert severity="error">{record?.errorDetail}</Alert>
          </Labeled>
        )}
      </SimpleShowLayout>
    </Show>
  );
};
