import {
  Create,
  SimpleForm,
  TextInput,
  useInput,
  Labeled,
  SaveButton,
  Toolbar,
  useTranslate,
} from "react-admin";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { EditorState } from "@codemirror/state";

const ContractNegotiationPolicyInput = () => {
  const { field } = useInput({ source: "policy" });
  const translate = useTranslate();
  return (
    <Labeled label={translate("resources.contractnegotiations.fields.policy")}>
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
  const translate = useTranslate();

  return (
    <Create>
      <SimpleForm toolbar={<ContractNegotiationsCreateToolbar />}>
        <TextInput
          source="counterPartyAddress"
          label={translate(
            "resources.contractnegotiations.fields.counterPartyAddress"
          )}
          fullWidth
        />
        <ContractNegotiationPolicyInput />
        <TextInput
          source="protocol"
          label={translate("resources.contractnegotiations.fields.protocol")}
          defaultValue={"dataspace-protocol-http"}
          fullWidth
        />
      </SimpleForm>
    </Create>
  );
};
