import { useEffect, useState } from "react";
import {
  Labeled,
  Datagrid,
  TextField,
  Show,
  SimpleShowLayout,
  ArrayField,
  Create,
  SimpleForm,
  TextInput,
  required,
  useNotify,
  useRedirect,
  useShowController,
  TopToolbar,
  DeleteButton,
  useRecordContext,
} from "react-admin";
import Typography from "@mui/material/Typography";

const UserShowBar = () => {
  const redirect = useRedirect();
  const record = useRecordContext();
  const onRedirect = () => {
    const customerId = record?.groups[0]?.id;
    return redirect("show", "/customers", customerId);
  };
  return (
    <TopToolbar>
      <DeleteButton mutationMode="pessimistic" redirect={onRedirect} />
    </TopToolbar>
  );
};

export const UserCreate = () => {
  const notify = useNotify();
  const redirect = useRedirect();

  const onSuccess = (user) => {
    notify(`User "${user.id}" created successfully.`);
    redirect("show", "/users", user.id, user);
  };

  return (
    <Create mutationOptions={{ onSuccess }}>
      <SimpleForm>
        <TextInput source="email" label="Email" validate={[required()]} />
        <TextInput source="firstName" label="First Name" />
        <TextInput source="lastName" label="Last Name" />
        <TextInput source="group" label="Group" readOnly />
      </SimpleForm>
    </Create>
  );
};

export const UserShow = () => {
  const [password, setPassword] = useState();
  const { record } = useShowController();

  useEffect(() => {
    if (record?.password) {
      setPassword(record.password);
    }
  }, [record?.password]);

  return (
    <Show actions={<UserShowBar />}>
      <SimpleShowLayout>
        <Labeled fullWidth label="ID">
          <TextField source="id" />
        </Labeled>
        <Labeled fullWidth label="Email">
          <TextField source="email" />
        </Labeled>
        <Labeled fullWidth label="Email Verified">
          <TextField source="emailVerified" />
        </Labeled>
        <Labeled fullWidth label="First Name">
          <TextField source="firstName" />
        </Labeled>
        <Labeled fullWidth label="Last Name">
          <TextField source="lastName" />
        </Labeled>
        {password && (
          <Labeled fullWidth label="Password">
            <Typography variant="body2">{password}</Typography>
          </Labeled>
        )}
        <ArrayField source="groups">
          <Datagrid bulkActionButtons={false}>
            <TextField source="id" />
            <TextField source="name" />
          </Datagrid>
        </ArrayField>
      </SimpleShowLayout>
    </Show>
  );
};