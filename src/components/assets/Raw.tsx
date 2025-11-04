import { useRecordContext, useTranslate } from "react-admin";
import { Typography, useTheme } from "@mui/material";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { EditorState } from "@codemirror/state";
import { githubLight, githubDark } from "@uiw/codemirror-theme-github";

export const Raw = () => {
  const record = useRecordContext();
  const translate = useTranslate();
  const theme = useTheme();
  const raw = record?.raw;

  if (!raw) {
    return (
      <Typography variant="body2" color="text.secondary">
        No raw data available
      </Typography>
    );
  }

  return (
    <CodeMirror
      value={JSON.stringify(raw, null, 2)}
      extensions={[json(), EditorState.readOnly.of(true)]}
      theme={theme.palette.mode === "dark" ? githubDark : githubLight}
      basicSetup={{
        lineNumbers: true,
        foldGutter: true,
      }}
    />
  );
};
