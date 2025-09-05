import {
  Create,
  SimpleForm,
  TextInput,
  useInput,
  Labeled,
  SaveButton,
  Toolbar,
} from "react-admin";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { EditorState } from "@codemirror/state";

const ContractNegotiationPolicyInput = () => {
  const { field } = useInput({ source: "policy" });
  return (
    <Labeled label="Policy">
      <CodeMirror
        {...field}
        value={JSON.stringify(field.value, null, 4)}
        extensions={[json(), EditorState.readOnly.of(true)]}
        basicSetup={{
          lineNumbers: false,
          foldGutter: false,
        }}
      />
    </Labeled>
  );
};

const ContractNegotiationsCreateToolbar = (props: any) => (
  <Toolbar {...props}>
    <SaveButton alwaysEnable />
  </Toolbar>
);

export const ContractNegotiationCreate = () => {
  return (
    <Create>
      <SimpleForm toolbar={<ContractNegotiationsCreateToolbar />}>
        <TextInput
          source="counterPartyAddress"
          label="Counter Party Address"
          fullWidth
        />
        <ContractNegotiationPolicyInput />
        <TextInput
          source="protocol"
          defaultValue={"dataspace-protocol-http"}
          fullWidth
        />
      </SimpleForm>
    </Create>
  );
};
