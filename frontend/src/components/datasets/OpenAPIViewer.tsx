import { useState, useEffect } from "react";
import { useRecordContext, useTranslate } from "react-admin";
import { Typography, Box, CircularProgress, useTheme } from "@mui/material";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import toOpenAPI from "@thingweb/open-api-converter";

interface OpenAPIViewerProps {
  authToken?: string;
}

export const OpenAPIViewer = ({ authToken }: OpenAPIViewerProps) => {
  const record = useRecordContext();
  const translate = useTranslate();
  const theme = useTheme();
  const thingDescription = record?.thingDescription;
  const [openApiSpec, setOpenApiSpec] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isDarkMode = theme.palette.mode === "dark";

  useEffect(() => {
    if (!thingDescription) {
      setOpenApiSpec(null);
      return;
    }

    setLoading(true);
    setError(null);

    toOpenAPI(thingDescription)
      .then((result) => {
        setOpenApiSpec(result.json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to convert Thing Description to OpenAPI:", err);
        setError(err instanceof Error ? err.message : String(err));
        setLoading(false);
      });
  }, [thingDescription]);

  if (!thingDescription) {
    return (
      <Typography variant="body2" color="text.secondary">
        {translate("resources.assets.tabs.thingDescriptionTab.noDescription")}
      </Typography>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="body2" color="error">
        {translate("resources.datasets.openapi.conversionError")}: {error}
      </Typography>
    );
  }

  if (!openApiSpec) {
    return null;
  }

  return (
    <Box
      sx={{
        "& .swagger-ui": {
          fontFamily: "inherit",
          ...(isDarkMode && {
            filter: "invert(88%) hue-rotate(180deg)",
            "& .microlight": {
              filter: "invert(100%) hue-rotate(180deg)",
            },
            "& img, & svg": {
              filter: "invert(100%) hue-rotate(180deg)",
            },
          }),
        },
      }}
    >
      <SwaggerUI
        spec={openApiSpec}
        requestInterceptor={(req) => {
          if (authToken) {
            req.headers.Authorization = authToken;
          }
          return req;
        }}
      />
    </Box>
  );
};
