import { useEffect } from "react";
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
  useTranslate,
  useRefresh,
} from "react-admin";
import Alert from "@mui/material/Alert";
import { Link } from "react-router-dom";
import CancelIcon from "@mui/icons-material/Cancel";
import { ContractNegotiation } from "../../types/contractNegotiation";

const ContractNegotiationShowBar = () => {
  const record = useRecordContext<ContractNegotiation>();
  const translate = useTranslate();
  const isTerminated = record?.state === "TERMINATED";
  const isFinalized = record?.state === "FINALIZED";
  const cannotTerminate = isTerminated || isFinalized;

  return (
    <TopToolbar>
      <Button
        component={Link}
        to={`/contractnegotiations/${record?.id}/terminate`}
        color="error"
        label={translate("resources.contractnegotiations.actions.terminate")}
        disabled={cannotTerminate}
        startIcon={<CancelIcon />}
      />
    </TopToolbar>
  );
};

export const ContractNegotiationShow = () => {
  const { error, isLoading, record } = useShowController<ContractNegotiation>();
  const translate = useTranslate();
  const refresh = useRefresh();

  useEffect(() => {
    const interval = setInterval(() => {
      refresh();
    }, 5000);

    return () => clearInterval(interval);
  }, [refresh]);

  if (isLoading) {
    return <LinearProgress />;
  }

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return (
    <Show actions={<ContractNegotiationShowBar />}>
      <SimpleShowLayout>
        <TextField
          source="id"
          label={translate("resources.contractnegotiations.fields.id")}
        />
        {record?.createdAt && (
          <DateField
            source="createdAt"
            showTime
            label={translate("resources.contractnegotiations.fields.createdAt")}
          />
        )}
        <TextField
          source="type"
          label={translate("resources.contractnegotiations.fields.type")}
        />
        <TextField
          source="counterPartyAddress"
          label={translate(
            "resources.contractnegotiations.fields.counterPartyAddress"
          )}
        />
        <TextField
          source="counterPartyId"
          label={translate(
            "resources.contractnegotiations.fields.counterPartyId"
          )}
        />
        <TextField
          source="protocol"
          label={translate("resources.contractnegotiations.fields.protocol")}
        />
        <TextField
          source="state"
          label={translate("resources.contractnegotiations.fields.state")}
        />
        {record?.contractAgreementId && (
          <ReferenceField
            source="contractAgreementId"
            reference="contractagreements"
            link="show"
            label={translate(
              "resources.contractnegotiations.fields.contractAgreementId"
            )}
          >
            <TextField source="id" />
          </ReferenceField>
        )}
        {record?.errorDetail && (
          <Labeled
            label={translate(
              "resources.contractnegotiations.fields.errorDetail"
            )}
            fullWidth
          >
            <Alert severity="error">{record?.errorDetail}</Alert>
          </Labeled>
        )}
      </SimpleShowLayout>
    </Show>
  );
};
