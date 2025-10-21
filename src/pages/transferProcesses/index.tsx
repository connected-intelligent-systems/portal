import {
  Create,
  SimpleForm,
  TextInput,
  useTranslate,
  useGetOne,
  Loading,
  SaveButton,
  Toolbar,
} from "react-admin";
import { useLocation, useParams } from "react-router-dom";
import { Alert } from "@mui/material";
import { TransferProcessesList } from "./TransferProcessesList";
import { TransferProcessesShow } from "./TransferProcessesShow";
import TransferProcessFormFields from "../../components/transferprocesses/TransferProcessFormFields";

const TerminateToolbar = ({ disabled }: { disabled: boolean }) => (
  <Toolbar>
    <SaveButton disabled={disabled} />
  </Toolbar>
);

export const TransferProcessesCreate = () => {
  const location = useLocation();
  const defaultValues = location.state?.record || {};

  return (
    <Create>
      <SimpleForm defaultValues={defaultValues}>
        <TransferProcessFormFields />
      </SimpleForm>
    </Create>
  );
};

export const TransferProcessTerminate = () => {
  const translate = useTranslate();
  const { id } = useParams<{ id: string }>();

  const { data: transferProcess, isLoading } = useGetOne(
    "transferprocesses",
    { id: id || "" },
    { enabled: !!id }
  );

  if (isLoading) {
    return <Loading />;
  }

  const isCompleted = transferProcess?.state === "COMPLETED";

  return (
    <Create
      resource="terminatetransferprocess"
      redirect="/transferprocesses"
      transform={(data: any) => ({ ...data, id })}
    >
      <SimpleForm toolbar={<TerminateToolbar disabled={isCompleted} />}>
        {isCompleted && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {translate(
              "resources.transferprocesses.messages.cannotTerminateCompleted"
            )}
          </Alert>
        )}
        <TextInput
          source="id"
          label={translate("resources.transferprocesses.fields.id")}
          defaultValue={id || ""}
          disabled
        />
        <TextInput
          source="reason"
          label={translate("resources.transferprocesses.fields.reason")}
          multiline
          rows={4}
          disabled={isCompleted}
        />
      </SimpleForm>
    </Create>
  );
};

export default {
  list: TransferProcessesList,
  show: TransferProcessesShow,
  create: TransferProcessesCreate,
  terminate: TransferProcessTerminate,
};
