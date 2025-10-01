import {
  Create,
  SimpleForm,
  TextInput,
  required,
  useNotify,
  FormDataConsumer,
} from "react-admin";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useState } from "react";
import { LocalCatalogService } from "../../services/localCatalogService";

const TestConnectionButton = ({ formData }: { formData: any }) => {
  const [testing, setTesting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const notify = useNotify();

  const handleTest = async () => {
    if (!formData.url) {
      notify("Please enter a URL first", { type: "warning" });
      return;
    }

    setTesting(true);
    setStatus("idle");
    setError(null);

    try {
      const result = await LocalCatalogService.testConnection(formData.url);
      if (result.success) {
        setStatus("success");
        notify("Connection successful!", { type: "success" });
      } else {
        setStatus("error");
        setError(result.error || "Connection failed");
        notify(result.error || "Connection failed", { type: "error" });
      }
    } catch (err) {
      setStatus("error");
      const errorMsg =
        err instanceof Error ? err.message : "Connection test failed";
      setError(errorMsg);
      notify(errorMsg, { type: "error" });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "center", my: 2 }}>
      <Button
        variant="outlined"
        onClick={handleTest}
        disabled={testing || !formData.url}
      >
        {testing ? <CircularProgress size={20} /> : "Test Connection"}
      </Button>
      {status === "success" && (
        <Typography color="success.main" variant="body2">
          ✓ Connection successful
        </Typography>
      )}
      {status === "error" && (
        <Typography color="error.main" variant="body2">
          ✗ {error}
        </Typography>
      )}
    </Box>
  );
};

export const CatalogCreate = () => {
  return (
    <Create redirect="show">
      <SimpleForm>
        <TextInput
          source="url"
          label="Catalog URL"
          helperText="Enter the EDC catalog endpoint URL (e.g., https://example.com/api/dsp)"
          fullWidth
          validate={required()}
        />
        <FormDataConsumer>
          {({ formData }) => <TestConnectionButton formData={formData} />}
        </FormDataConsumer>
        <TextInput
          source="name"
          label="Catalog Name"
          helperText="A friendly name for this catalog"
          fullWidth
          validate={required()}
        />
        <TextInput
          source="description"
          label="Description"
          helperText="Optional description"
          multiline
          rows={3}
          fullWidth
        />
      </SimpleForm>
    </Create>
  );
};
