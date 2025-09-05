import { Create, SimpleForm, TextInput, useShowController } from "react-admin";

export const ContractNegotiationTerminate = () => {
  const { record } = useShowController();

  return (
    <Create resource="terminatecontractnegotiation" redirect="list">
      <SimpleForm>
        <TextInput source="id" defaultValue={record?.id} disabled />
        <TextInput source="reason" multiline rows={4} />
      </SimpleForm>
    </Create>
  );
};
