import {
  Labeled,
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  useShowController,
  Button,
  TopToolbar,
  useRecordContext,
  ReferenceField,
} from "react-admin";
import { Link } from "react-router-dom";
import DownloadIcon from "@mui/icons-material/Download";
import { ContractAgreement } from "../../types/contractAgreement";

const ContractAgreementShowBar = () => {
  const record = useRecordContext<ContractAgreement>();
  // TODO: Re-enable this logic when negotiation state is available
  const enabled = true; // record?.negotiation.state !== "TERMINATED";
  return (
    <TopToolbar>
      <Button
        component={Link}
        to={`/transferprocesses/create?contractId=${record?.id}&assetId=${record?.assetId}`}
        disabled={!enabled}
        label="Transfer Dataset"
        startIcon={<DownloadIcon />}
      />
    </TopToolbar>
  );
};

export const ContractAgreementShow = () => {
  const { record, isPending } = useShowController<ContractAgreement>();
  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <Show emptyWhileLoading={false} actions={<ContractAgreementShowBar />}>
      <SimpleShowLayout>
        <TextField label="Id" source="id" />
        <TextField label="Asset Id" source="assetId" />
        <TextField label="Consumer Id" source="consumerId" />
        <TextField label="Provider Id" source="providerId" />
        <DateField
          label="Contract Signing Date"
          source="contractSigningDate"
          showTime
        />
        <Labeled label="Policy">
          <SimpleShowLayout>
            <TextField label="Type" source="policy.type" />
            <TextField label="Target" source="policy.rules.target" />
            {/* Add more policy fields as needed */}
          </SimpleShowLayout>
        </Labeled>
        <ReferenceField
          label="Asset"
          source="assetId"
          reference="assets"
          link="show"
        >
          <TextField source="title" />
        </ReferenceField>
      </SimpleShowLayout>
    </Show>
  );
};
