import React from "react";
import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";

interface VersioningTabProps {
  dataset: any;
}

export const VersioningTab: React.FC<VersioningTabProps> = ({ dataset }) => {
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
        Version information, creator, dates, and previous versions based on
        Dublin Core Terms and OWL vocabularies.
      </Typography>

      {renderMetadataSection([
        {
          label: "Version",
          value: dataset["http://www.w3.org/2002/07/owl#versionInfo"],
        },
        {
          label: "Creator",
          value: dataset["dct:creator"]
            ? typeof dataset["dct:creator"] === "object"
              ? dataset["dct:creator"]["http://schema.org/name"] ||
                dataset["dct:creator"]["@id"]
              : dataset["dct:creator"]
            : null,
        },
        {
          label: "Created",
          value: dataset["dct:created"]
            ? new Date(dataset["dct:created"]).toLocaleDateString()
            : null,
        },
        {
          label: "Modified",
          value: dataset["dct:modified"]
            ? new Date(dataset["dct:modified"]).toLocaleDateString()
            : null,
        },
      ])}

      {/* Previous Versions */}
      {dataset["dct:hasVersion"] && (
        <>
          {renderMetadataSection([
            {
              label: "Previous Version",
              value:
                dataset["dct:hasVersion"][
                  "http://www.w3.org/2002/07/owl#versionInfo"
                ],
            },
            {
              label: "Previous Version Issued",
              value: dataset["dct:hasVersion"]["dct:issued"]
                ? new Date(
                    dataset["dct:hasVersion"]["dct:issued"]
                  ).toLocaleDateString()
                : null,
            },
          ])}
        </>
      )}
    </Box>
  );
};
