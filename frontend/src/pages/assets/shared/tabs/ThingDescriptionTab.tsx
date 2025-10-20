import { useState } from "react";
import type React from "react";
import {
  Typography,
  Button,
  Box,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { useTranslate, useInput } from "react-admin";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { EditorState } from "@codemirror/state";
import { githubLight, githubDark } from "@uiw/codemirror-theme-github";
import { replaceThingDescriptionHrefs } from "../../../../utils/thingDescriptionUtils";
import { validateThingDescription } from "../../../../utils/thingDescriptionValidator";

export const ThingDescriptionTab = () => {
  const translate = useTranslate();
  const theme = useTheme();
  const { field } = useInput({ source: "thingDescription" });
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<any[]>([]);
  const [validating, setValidating] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        // Validate that it's valid JSON
        const parsedTd = JSON.parse(content);

        // Validate against W3C TD schema
        setValidating(true);
        setError(null);
        setValidationErrors([]);

        const validationResult = validateThingDescription(parsedTd);

        setValidating(false);

        if (!validationResult.valid) {
          setValidationErrors(validationResult.errors || []);
          setError(
            translate(
              "resources.assets.create.thingDescription.errors.validationFailed"
            )
          );
          return;
        }

        // Replace hrefs with public EDC endpoint
        const publicEdcEndpoint =
          window.config?.publicEdcEndpoint ||
          "http://localhost:8080/api/v1/dsp";
        const processedContent = replaceThingDescriptionHrefs(
          parsedTd,
          publicEdcEndpoint
        );

        field.onChange(processedContent);
        setError(null);
        setValidationErrors([]);
      } catch (err) {
        setValidating(false);
        setError(
          translate(
            "resources.assets.create.thingDescription.errors.invalidJson"
          )
        );
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        {translate("resources.assets.create.thingDescription.title")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {translate("resources.assets.create.thingDescription.description")}
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Button
          variant="outlined"
          component="label"
          startIcon={<UploadFileIcon />}
          disabled={validating}
        >
          {validating ? (
            <>
              <CircularProgress size={16} sx={{ mr: 1 }} />
              {translate("resources.assets.create.thingDescription.validating")}
            </>
          ) : (
            translate("resources.assets.create.thingDescription.uploadButton")
          )}
          <input
            type="file"
            hidden
            accept=".json,application/json"
            onChange={handleFileUpload}
            disabled={validating}
          />
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
          {validationErrors.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" component="div" sx={{ mb: 1 }}>
                {translate(
                  "resources.assets.create.thingDescription.errors.details"
                )}
              </Typography>
              <Box
                component="pre"
                sx={{
                  fontSize: "0.75rem",
                  overflow: "auto",
                  maxHeight: "200px",
                }}
              >
                {JSON.stringify(validationErrors, null, 2)}
              </Box>
            </Box>
          )}
        </Alert>
      )}

      {field.value && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              {translate(
                "resources.assets.create.thingDescription.viewDescription"
              )}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <CodeMirror
              value={JSON.stringify(field.value, null, 2)}
              extensions={[json(), EditorState.readOnly.of(true)]}
              theme={theme.palette.mode === "dark" ? githubDark : githubLight}
              basicSetup={{
                lineNumbers: true,
                foldGutter: true,
              }}
            />
          </AccordionDetails>
        </Accordion>
      )}
    </>
  );
};
