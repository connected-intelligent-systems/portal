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

const downloadBlob = async (blob: Blob, filename: string) => {
  if ("showSaveFilePicker" in window) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: filename,
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return;
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        console.error("Save failed:", err);
      }
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
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
  const translate = useTranslate();
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
  const catalogId = btoa(counterPartyAddress);
  const compositeId = `${catalogId}--${record?.assetId}`;

  return (
    <Show actions={<TransferProcessesShowBar />}>
      <SimpleShowLayout>
        <TextField
          label={translate("resources.transferprocesses.fields.id")}
          source="id"
        />
        <TextField
          label={translate(
            "resources.transferprocesses.fields.transferDirection"
          )}
          source="transferDirection"
        />
        <TextField
          label={translate("resources.transferprocesses.fields.transferType")}
          source="transferType"
        />
        <DateField
          label={translate("resources.transferprocesses.fields.stateTimestamp")}
          source="stateTimestamp"
          showTime
        />
        <TextField
          label={translate("resources.transferprocesses.fields.state")}
          source="state"
        />
        <TextField
          label={translate("resources.transferprocesses.fields.correlationId")}
          source="correlationId"
        />
        {record?.errorDetail && (
          <Labeled
            label={translate("resources.transferprocesses.fields.errorDetail")}
            fullWidth
          >
            <Alert severity="error">{record?.errorDetail}</Alert>
          </Labeled>
        )}
        <ReferenceField
          label={translate("resources.transferprocesses.fields.contractId")}
          source="contractId"
          reference="contractagreements"
          link="show"
        >
          <TextField source="id" />
        </ReferenceField>
        {record?.transferDirection === "CONSUMER" && counterPartyAddress && (
          <ReferenceField
            label={translate("resources.transferprocesses.fields.dataset")}
            record={{ ...record, assetId: compositeId }}
            reference="datasets"
            source="assetId"
            link="show"
          >
            <TextField source="originalId" />
          </ReferenceField>
        )}
        {record?.transferDirection === "PROVIDER" && (
          <ReferenceField
            label={translate("resources.transferprocesses.fields.asset")}
            reference="assets"
            source="assetId"
            link="show"
          >
            <TextField source="id" />
          </ReferenceField>
        )}
        {record?.transferType === "HttpData-PULL" &&
          record?.transferDirection === "CONSUMER" &&
          record?.state !== "TERMINATED" && (
            <ReferenceField
              label={translate(
                "resources.transferprocesses.fields.dataRequest"
              )}
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
