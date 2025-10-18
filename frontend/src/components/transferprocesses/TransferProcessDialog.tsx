import {
  CreateBase,
  SaveButton,
  SimpleForm,
  Toolbar,
  useNotify,
  useRedirect,
  useTranslate,
} from "react-admin";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogProps,
  Button as MuiButton,
} from "@mui/material";
import { ComponentProps } from "react";
import TransferProcessFormFields from "./TransferProcessFormFields";

interface TransferProcessDialogProps
  extends Pick<DialogProps, "open" | "onClose"> {
  defaultValues: Record<string, unknown>;
}

type RAToolbarProps = ComponentProps<typeof Toolbar>;

const TransferProcessDialogToolbar = ({
  onCancel,
  invalid,
  saving,
  ...toolbarProps
}: RAToolbarProps & { onCancel: () => void }) => {
  const translate = useTranslate();
  return (
    <Toolbar
      {...toolbarProps}
      sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}
    >
      <MuiButton onClick={onCancel}>{translate("ra.action.cancel")}</MuiButton>
      <SaveButton
        type="submit"
        disabled={Boolean(invalid) || Boolean(saving)}
      />
    </Toolbar>
  );
};

const sanitizeTransferProcessPayload = (values: any) => {
  const { transferType, dataDestination = {}, ...rest } = values || {};

  const pick = (source: Record<string, unknown>, keys: string[]) =>
    keys.reduce<Record<string, unknown>>((acc, key) => {
      const value = source[key];
      if (value !== undefined && value !== null && value !== "") {
        acc[key] = value;
      }
      return acc;
    }, {});

  const payload: Record<string, unknown> = {
    ...rest,
    transferType,
  };

  switch (transferType) {
    case "HttpData-PULL":
      break;
    case "HttpData-PUSH": {
      const destination: Record<string, unknown> = {
        type: "HttpData",
        ...pick(dataDestination, ["baseUrl"]),
      };
      if (Object.keys(destination).length > 0) {
        payload.dataDestination = destination;
      }
      break;
    }
    case "AmazonS3-PUSH": {
      const destination: Record<string, unknown> = {
        type: "AmazonS3",
        ...pick(dataDestination, [
          "region",
          "endpointOverride",
          "bucketName",
          "objectName",
          "accessKeyId",
          "secretAccessKey",
        ]),
      };
      if (destination.endpointOverride === undefined) {
        delete destination.endpointOverride;
      }
      if (Object.keys(destination).length > 0) {
        payload.dataDestination = destination;
      }
      break;
    }
    default: {
      if (dataDestination && Object.keys(dataDestination).length > 0) {
        payload.dataDestination = dataDestination;
      }
    }
  }

  return payload;
};

export const TransferProcessDialog = ({
  open,
  onClose,
  defaultValues,
}: TransferProcessDialogProps) => {
  const translate = useTranslate();
  const notify = useNotify();
  const redirect = useRedirect();
  const handleClose = () => onClose?.({}, "escapeKeyDown");

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {translate("resources.contractagreements.actions.transferDataset")}
      </DialogTitle>
      <DialogContent>
        <CreateBase
          resource="transferprocesses"
          redirect={false}
          transform={sanitizeTransferProcessPayload}
          mutationOptions={{
            onSuccess: (data: any) => {
              notify("ra.notification.created", {
                type: "info",
                messageArgs: { smart_count: 1 },
              });
              handleClose();
              if (data?.id) {
                redirect("show", "transferprocesses", data.id);
              } else {
                redirect("list", "transferprocesses");
              }
            },
            onError: (error: any) => {
              notify(error?.message || "ra.notification.http_error", {
                type: "warning",
              });
            },
          }}
        >
          <SimpleForm
            defaultValues={defaultValues}
            toolbar={<TransferProcessDialogToolbar onCancel={handleClose} />}
            mode="onChange"
            reValidateMode="onChange"
          >
            <TransferProcessFormFields lockCoreFields hideCoreFields />
          </SimpleForm>
        </CreateBase>
      </DialogContent>
    </Dialog>
  );
};

export default TransferProcessDialog;
