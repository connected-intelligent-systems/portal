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
import { useParams } from "react-router-dom";
import { Alert } from "@mui/material";

const TerminateToolbar = ({ disabled }: { disabled: boolean }) => (
  <Toolbar>
    <SaveButton disabled={disabled} />
  </Toolbar>
);

export const ContractNegotiationTerminate = () => {
  const translate = useTranslate();
  const { id } = useParams<{ id: string }>();

  const { data: negotiation, isLoading } = useGetOne(
    "contractnegotiations",
    { id: id || "" },
    { enabled: !!id }
  );

  if (isLoading) {
    return <Loading />;
  }

  const isFinalized = negotiation?.state === "FINALIZED";

  return (
    <Create
      resource="terminatecontractnegotiation"
      redirect="/contractnegotiations"
      transform={(data: any) => ({ ...data, id })}
    >
      <SimpleForm toolbar={<TerminateToolbar disabled={isFinalized} />}>
        {isFinalized && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {translate(
              "resources.contractnegotiations.messages.cannotTerminateFinalized"
            ) || "Finalized contract negotiations cannot be terminated."}
          </Alert>
        )}
        <TextInput
          source="id"
          label={translate("resources.contractnegotiations.fields.id")}
          defaultValue={id || ""}
          disabled
        />
        <TextInput
          source="reason"
          label={translate("resources.contractnegotiations.fields.reason")}
          multiline
          rows={4}
          disabled={isFinalized}
        />
      </SimpleForm>
    </Create>
  );
};
