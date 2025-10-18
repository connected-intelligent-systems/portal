import { useState } from "react";
import {
  Typography,
  Button,
  Box,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { useTranslate, useInput } from "react-admin";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { replaceThingDescriptionHrefs } from "../../../../utils/thingDescriptionUtils";

export const ThingDescriptionTab = () => {
  const translate = useTranslate();
  const { field } = useInput({ source: "thingDescription" });
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        // Validate that it's valid JSON
        JSON.parse(content);

        // Replace hrefs with public EDC endpoint
        const publicEdcEndpoint =
          window.config?.publicEdcEndpoint || "http://localhost:8080/api/v1/dsp";
        const processedContent = replaceThingDescriptionHrefs(
          content,
          publicEdcEndpoint
        );

        field.onChange(processedContent);
        setError(null);
      } catch (err) {
        setError(
          translate("resources.assets.create.thingDescription.errors.invalidJson")
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
        >
          {translate("resources.assets.create.thingDescription.uploadButton")}
          <input
            type="file"
            hidden
            accept=".json,application/json"
            onChange={handleFileUpload}
          />
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
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
            <Box
              component="pre"
              sx={{
                bgcolor: "grey.100",
                p: 2,
                borderRadius: 1,
                overflow: "auto",
                fontSize: "0.875rem",
                fontFamily: "monospace",
              }}
            >
              {JSON.stringify(JSON.parse(field.value), null, 2)}
            </Box>
          </AccordionDetails>
        </Accordion>
      )}
    </>
  );
};
