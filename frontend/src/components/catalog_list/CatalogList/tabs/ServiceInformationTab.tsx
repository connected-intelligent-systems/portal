import React from "react";
import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import CloudIcon from "@mui/icons-material/Cloud";

interface ServiceInformationTabProps {
  dataset: any;
}

export const ServiceInformationTab: React.FC<ServiceInformationTabProps> = ({ dataset }) => {
  const renderMetadataSection = (fields: any[]) => {
    const availableFields = fields.filter((field) => field.value);
    if (availableFields.length === 0) return null;

    return (
      <Box sx={{ mb: 3 }}>
        <List disablePadding>
          {availableFields.map((field, index) => (
            <ListItem key={index} disablePadding sx={{ mb: 1 }}>
              <ListItemText
                primary={
                  field.icon ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {field.icon}
                      <Typography variant="body2" fontWeight="medium">
                        {field.label}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" fontWeight="medium">
                      {field.label}
                    </Typography>
                  )
                }
                secondary={field.value}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    );
  };

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Technical service information and endpoint details for accessing this
        dataset.
      </Typography>

      {dataset["dcat:service"] ? (
        <>
          {renderMetadataSection([
            {
              label: "Endpoint URL",
              value: dataset["dcat:service"]["dcat:endpointUrl"],
            },
            {
              label: "Service Type",
              value: dataset["dcat:service"]["@type"],
            },
            {
              label: "Terms",
              value: dataset["dcat:service"]["dct:terms"],
            },
            {
              label: "Endpoint Description",
              value: dataset["dcat:service"]["dcat:endpointDescription"],
            },
          ])}
        </>
      ) : (
        <Typography variant="body2" color="textSecondary">
          No service information available
        </Typography>
      )}

      {/* Distribution Information */}
      {dataset["dcat:distribution"] &&
      Array.isArray(dataset["dcat:distribution"]) &&
      dataset["dcat:distribution"].length > 0 ? (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
            Distributions
          </Typography>
          {dataset["dcat:distribution"].map(
            (distribution: any, index: number) => (
              <Box
                key={index}
                sx={{
                  mb: 2,
                  p: 2,
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 1,
                }}
              >
                <Typography variant="body2">
                  <strong>Distribution {index + 1}</strong>
                </Typography>
                {distribution["@id"] && (
                  <Typography variant="body2">
                    <strong>ID:</strong> {distribution["@id"]}
                  </Typography>
                )}
                {distribution["dcat:mediaType"] && (
                  <Typography variant="body2">
                    <strong>Media Type:</strong>{" "}
                    {distribution["dcat:mediaType"]}
                  </Typography>
                )}
                {distribution["dcat:accessURL"] && (
                  <Typography variant="body2">
                    <strong>Access URL:</strong>{" "}
                    {distribution["dcat:accessURL"]}
                  </Typography>
                )}
              </Box>
            )
          )}
        </Box>
      ) : (
        <Typography variant="body2" color="textSecondary" sx={{ mt: 3 }}>
          No distribution information available
        </Typography>
      )}
    </Box>
  );
};
