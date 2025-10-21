import {
  Create,
  SimpleForm,
  TextInput,
  required,
  useNotify,
  FormDataConsumer,
  useTranslate,
} from "react-admin";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useState } from "react";
import { LocalCatalogService } from "../../services/localCatalogService";

const TestConnectionButton = ({ formData }: { formData: any }) => {
  const [testing, setTesting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const notify = useNotify();
  const translate = useTranslate();

  const handleTest = async () => {
    if (!formData.url) {
      notify(translate("resources.catalog.connectionTest.requiresUrl"), {
        type: "warning",
      });
      return;
    }

    setTesting(true);
    setStatus("idle");
    setError(null);

    try {
      const result = await LocalCatalogService.testConnection(formData.url);
      if (result.success) {
        setStatus("success");
        notify(
          translate("resources.catalog.connectionTest.successNotification"),
          { type: "success" }
        );
      } else {
        setStatus("error");
        const failureMessage =
          result.error ||
          translate("resources.catalog.connectionTest.failureNotification");
        setError(failureMessage);
        notify(failureMessage, { type: "error" });
      }
    } catch (err) {
      setStatus("error");
      const errorMsg =
        err instanceof Error
          ? err.message
          : translate("resources.catalog.connectionTest.errorNotification");
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
        {testing ? (
          <CircularProgress size={20} />
        ) : (
          translate("resources.catalog.connectionTest.button")
        )}
      </Button>
      {status === "success" && (
        <Typography color="success.main" variant="body2">
          {translate("resources.catalog.connectionTest.successStatus")}
        </Typography>
      )}
      {status === "error" && (
        <Typography color="error.main" variant="body2">
          {translate("resources.catalog.connectionTest.errorStatusPrefix", {
            error:
              error ||
              translate("resources.catalog.connectionTest.failureNotification"),
          })}
        </Typography>
      )}
    </Box>
  );
};

export const CatalogCreate = () => {
  const translate = useTranslate();
  return (
    <Create redirect="show">
      <SimpleForm>
        <TextInput
          source="url"
          label={translate("resources.catalog.add.url")}
          helperText={translate("resources.catalog.forms.urlHelper")}
          fullWidth
          validate={required()}
        />
        <FormDataConsumer>
          {({ formData }) => <TestConnectionButton formData={formData} />}
        </FormDataConsumer>
        <TextInput
          source="name"
          label={translate("resources.catalog.add.name")}
          helperText={translate("resources.catalog.forms.nameHelper")}
          fullWidth
          validate={required()}
        />
        <TextInput
          source="description"
          label={translate("resources.catalog.add.description")}
          helperText={translate("resources.catalog.forms.descriptionHelper")}
          multiline
          rows={3}
          fullWidth
        />
      </SimpleForm>
    </Create>
  );
};
