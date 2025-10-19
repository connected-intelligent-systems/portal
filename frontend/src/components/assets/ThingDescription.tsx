import { useRecordContext, useTranslate } from "react-admin";
import { Typography, useTheme } from "@mui/material";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { EditorState } from "@codemirror/state";
import { githubLight, githubDark } from "@uiw/codemirror-theme-github";

export const ThingDescription = () => {
  const record = useRecordContext();
  const translate = useTranslate();
  const theme = useTheme();
  const thingDescription = record?.thingDescription;

  if (!thingDescription) {
    return (
      <Typography variant="body2" color="text.secondary">
        {translate("resources.assets.tabs.thingDescriptionTab.noDescription")}
      </Typography>
    );
  }

  return (
    <CodeMirror
      value={JSON.stringify(thingDescription, null, 2)}
      extensions={[json(), EditorState.readOnly.of(true)]}
      theme={theme.palette.mode === "dark" ? githubDark : githubLight}
      basicSetup={{
        lineNumbers: true,
        foldGutter: true,
      }}
    />
  );
};
