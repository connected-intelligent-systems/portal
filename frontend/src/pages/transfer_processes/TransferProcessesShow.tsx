import { useState } from "react";
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
  useDataProvider,
  useNotify,
  useTranslate,
  useGetList,
} from "react-admin";
import Alert from "@mui/material/Alert";
import { Link } from "react-router-dom";
import CancelIcon from "@mui/icons-material/Cancel";
import DownloadIcon from "@mui/icons-material/Download";
import { TransferProcess } from "../../types/transferProcess";

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const Asset = ({
  transferProcess,
  counterPartyAddress,
}: {
  transferProcess: TransferProcess;
  counterPartyAddress?: string;
}) => {
  const translate = useTranslate();

  if (transferProcess.transferDirection === "CONSUMER") {
    if (!counterPartyAddress) {
      return null;
    }
    // Create composite ID for dataset: catalogId--datasetId
    const catalogId = btoa(counterPartyAddress);
    const compositeId = `${catalogId}--${transferProcess.assetId}`;

    return (
      <Labeled label={translate("resources.transferprocesses.fields.dataset")}>
        <ReferenceField
          record={{ ...transferProcess, assetId: compositeId }}
          reference="datasets"
          source="assetId"
          link="show"
        >
          <TextField source="originalId" />
        </ReferenceField>
      </Labeled>
    );
  } else if (transferProcess.transferDirection === "PROVIDER") {
    return (
      <Labeled label={translate("resources.transferprocesses.fields.asset")}>
        <ReferenceField
          record={transferProcess}
          reference="assets"
          source="assetId"
        >
          <TextField source="id" />
        </ReferenceField>
      </Labeled>
    );
  }
  return null;
};

const TransferProcessesShowBar = () => {
  const record = useRecordContext<TransferProcess>();
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const translate = useTranslate();
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!record?.id) return;

    try {
      setDownloading(true);

      const { data: dataAddress } = await dataProvider.getOne("datarequests", {
        id: record.id,
      });

      const response = await fetch(dataAddress.endpoint, {
        headers: {
          Authorization: dataAddress.authorization,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to download data: ${response.statusText}`);
      }

      const blob = await response.blob();
      downloadBlob(blob, `${record.id}_${Date.now()}`);

      notify(
        translate("resources.transferprocesses.messages.downloadSuccessful"),
        { type: "success" }
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      notify(
        `${translate(
          "resources.transferprocesses.messages.downloadFailed"
        )}: ${message}`,
        { type: "error" }
      );
    } finally {
      setDownloading(false);
    }
  };

  const canDownload =
    record?.transferType === "HttpData-PULL" &&
    record?.transferDirection === "CONSUMER" &&
    record?.state === "STARTED";

  const isCompleted = record?.state === "COMPLETED";
  const isTerminated = record?.state === "TERMINATED";
  const cannotTerminate = isCompleted || isTerminated;

  return (
    <TopToolbar>
      <Button
        onClick={handleDownload}
        disabled={!canDownload || downloading}
        label={
          downloading
            ? translate("resources.transferprocesses.actions.downloading")
            : translate("resources.transferprocesses.actions.download")
        }
        startIcon={<DownloadIcon />}
      />
      <Button
        component={Link}
        color="error"
        to={`/transferprocesses/${record?.id}/terminate`}
        disabled={cannotTerminate}
        label={translate("resources.transferprocesses.actions.terminate")}
        startIcon={<CancelIcon />}
      />
    </TopToolbar>
  );
};

export const TransferProcessesShow = () => {
  const { record } = useShowController<TransferProcess>();

  const { data: negotiations } = useGetList(
    "contractnegotiations",
    {
      filter: { "contractAgreement.id": record?.contractId },
      pagination: { page: 1, perPage: 1 },
    },
    { enabled: !!record?.contractId }
  );

  const negotiation = negotiations?.[0];
  const counterPartyAddress = negotiation?.counterPartyAddress;

  return (
    <Show actions={<TransferProcessesShowBar />}>
      <SimpleShowLayout>
        <TextField label="resources.transferprocesses.fields.id" source="id" />
        <TextField
          label="resources.transferprocesses.fields.transferDirection"
          source="transferDirection"
        />
        <TextField
          label="resources.transferprocesses.fields.transferType"
          source="transferType"
        />
        <DateField
          label="resources.transferprocesses.fields.stateTimestamp"
          source="stateTimestamp"
          showTime
        />
        <TextField
          label="resources.transferprocesses.fields.state"
          source="state"
        />
        <TextField
          label="resources.transferprocesses.fields.correlationId"
          source="correlationId"
        />
        {record?.errorDetail && (
          <Labeled
            label="resources.transferprocesses.fields.errorDetail"
            fullWidth
          >
            <Alert severity="error">{record?.errorDetail}</Alert>
          </Labeled>
        )}
        <ReferenceField
          label="resources.transferprocesses.fields.contractId"
          source="contractId"
          reference="contractagreements"
          link="show"
        >
          <TextField source="id" />
        </ReferenceField>
        {record && (
          <Asset
            transferProcess={record}
            counterPartyAddress={counterPartyAddress}
          />
        )}
        {record?.transferType === "HttpData-PULL" &&
          record?.transferDirection === "CONSUMER" &&
          record?.state !== "TERMINATED" && (
            <ReferenceField
              label="resources.transferprocesses.fields.dataRequest"
              source="id"
              reference="datarequests"
              link="show"
            >
              <TextField source="id" />
            </ReferenceField>
          )}
      </SimpleShowLayout>
    </Show>
  );
};
