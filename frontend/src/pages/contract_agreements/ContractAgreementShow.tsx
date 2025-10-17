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
} from "react-admin";
import { Link } from "react-router-dom";
import DownloadIcon from "@mui/icons-material/Download";
import { ContractAgreement } from "../../types/contractAgreement";
import { PolicyRulesTabs } from "../../components/PolicyRulesTabs";

const ContractAgreementShowBar = () => {
  const translate = useTranslate();
  const record = useRecordContext<ContractAgreement>();

  const { data: negotiation } = useGetOne(
    "contractagreementnegotiation",
    { id: record?.id || "" },
    {
      enabled: !!record?.id,
      onSuccess: () => {},
    }
  );

  const counterPartyAddress = negotiation?.counterPartyAddress;

  return (
    <TopToolbar>
      {negotiation?.type === "CONSUMER" && counterPartyAddress && (
        <Button
          component={Link}
          to="/transferprocesses/create"
          state={{
            record: {
              counterPartyAddress: counterPartyAddress,
              contractId: record?.id,
              assetId: record?.assetId,
            },
          }}
          label={translate(
            "resources.contractagreements.actions.transferDataset"
          )}
          startIcon={<DownloadIcon />}
        />
      )}
    </TopToolbar>
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
              const permissions = record?.policy?.rules?.permissions || [];
              const obligations = record?.policy?.rules?.obligations || [];
              const prohibitions = record?.policy?.rules?.prohibitions || [];

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
