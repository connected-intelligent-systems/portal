import { useEffect } from "react";
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
  ReferenceOneField,
  useTranslate,
  FunctionField,
  useGetOne,
  useRefresh,
} from "react-admin";
import DownloadIcon from "@mui/icons-material/Download";
import { useState } from "react";
import { ContractAgreement } from "../../types/contractAgreement";
import { PolicyRulesTabs } from "../../components/policies/PolicyRulesTabs";
import TransferProcessDialog from "../../components/transferprocesses/TransferProcessDialog";

const ContractAgreementShowBar = () => {
  const translate = useTranslate();
  const record = useRecordContext<ContractAgreement>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: negotiation } = useGetOne(
    "contractagreementnegotiation",
    { id: record?.id || "" },
    {
      enabled: !!record?.id,
      onSuccess: () => {},
    }
  );

  const counterPartyAddress = negotiation?.counterPartyAddress;
  const canInitiateTransfer =
    negotiation?.type === "CONSUMER" && !!counterPartyAddress && !!record;
  const defaultValues = {
    counterPartyAddress,
    contractId: record?.id,
    assetId: record?.assetId,
  };

  return (
    <>
      <TopToolbar>
        {canInitiateTransfer && (
          <Button
            label={translate(
              "resources.contractagreements.actions.transferDataset"
            )}
            startIcon={<DownloadIcon />}
            onClick={() => setIsDialogOpen(true)}
          />
        )}
      </TopToolbar>
      {canInitiateTransfer && (
        <TransferProcessDialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          defaultValues={defaultValues}
        />
      )}
    </>
  );
};

const ContractNegotiation = ({
  contractAggreement,
}: {
  contractAggreement: ContractAgreement;
}) => {
  const translate = useTranslate();
  const record = useRecordContext();
  if (record?.type === "CONSUMER") {
    // Create composite ID for dataset: catalogId--datasetId
    const catalogId = btoa(record.counterPartyAddress);
    const compositeId = `${catalogId}--${contractAggreement.assetId}`;

    return (
      <Labeled label={translate("resources.contractagreements.fields.dataset")}>
        <ReferenceField
          record={{ ...contractAggreement, assetId: compositeId }}
          reference="datasets"
          source="assetId"
          link="show"
        >
          <TextField source="originalId" />
        </ReferenceField>
      </Labeled>
    );
  } else if (record?.type === "PROVIDER") {
    return (
      <Labeled label={translate("resources.contractagreements.fields.asset")}>
        <ReferenceField
          record={contractAggreement}
          reference="assets"
          source="assetId"
        >
          <TextField source="id" />
        </ReferenceField>
      </Labeled>
    );
  }
};

export const ContractAgreementShow = () => {
  const translate = useTranslate();
  const refresh = useRefresh();

  useEffect(() => {
    const interval = setInterval(() => {
      refresh();
    }, 5000);

    return () => clearInterval(interval);
  }, [refresh]);

  const { isPending, record } = useShowController<ContractAgreement>();
  if (isPending) {
    return (
      <div>{translate("resources.contractagreements.messages.loading")}</div>
    );
  }

  return (
    <Show emptyWhileLoading={false} actions={<ContractAgreementShowBar />}>
      <SimpleShowLayout>
        <TextField
          label={translate("resources.contractagreements.fields.id")}
          source="id"
        />
        <TextField
          label={translate("resources.contractagreements.fields.assetId")}
          source="assetId"
        />
        <TextField
          label={translate("resources.contractagreements.fields.consumerId")}
          source="consumerId"
        />
        <TextField
          label={translate("resources.contractagreements.fields.providerId")}
          source="providerId"
        />
        <DateField
          label={translate(
            "resources.contractagreements.fields.contractSigningDate"
          )}
          source="contractSigningDate"
          showTime
        />
        {record && (
          <ReferenceOneField
            reference="contractnegotiations"
            target="contractAgreement.id"
            label={false}
            render={() => <ContractNegotiation contractAggreement={record} />}
          />
        )}
        <Labeled
          label={translate("resources.contractagreements.sections.policy")}
          fullWidth
        >
          <FunctionField
            render={(record: any) => {
              const permissions = record?.policy?.permissions || [];
              const obligations = record?.policy?.obligations || [];
              const prohibitions = record?.policy?.prohibitions || [];

              return (
                <PolicyRulesTabs
                  permissions={permissions}
                  obligations={obligations}
                  prohibitions={prohibitions}
                />
              );
            }}
          />
        </Labeled>
      </SimpleShowLayout>
    </Show>
  );
};
