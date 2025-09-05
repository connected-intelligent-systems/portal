import React from "react";
import {
  Typography,
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { PermissionAccordion } from "../PermissionAccordion";

interface OverviewTabProps {
  dataset: any;
  policies: any[];
  selectedPolicy: number;
  onPolicyChange: (index: number) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  dataset,
  policies,
  selectedPolicy,
  onPolicyChange,
}) => {
  const datasetTitle = dataset?.["dct:title"] || dataset?.name || "Unnamed Dataset";
  const datasetId = dataset?.["@id"];

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
      {/* Header */}
      <Box sx={{ mb: 3, pb: 2, borderBottom: 1, borderColor: "divider" }}>
        <Typography variant="h5" gutterBottom>
          {datasetTitle}
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          ID: {datasetId}
        </Typography>

        {/* Tags/Chips */}
        <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
          {dataset["dspace:participantId"] && (
            <Chip
              size="small"
              label={dataset["dspace:participantId"]}
              variant="outlined"
            />
          )}
          {dataset["dcat:theme"] && (
            <Chip
              size="small"
              label={
                typeof dataset["dcat:theme"] === "object"
                  ? dataset["dcat:theme"]["dct:title"] ||
                    dataset["dcat:theme"]["@id"] ||
                    "Unknown Category"
                  : dataset["dcat:theme"]
              }
              color="primary"
              variant="outlined"
            />
          )}
          {dataset["dcat:mediaType"] && (
            <Chip
              size="small"
              label={dataset["dcat:mediaType"]}
              color="info"
              variant="outlined"
            />
          )}
        </Box>
        {dataset["dcat:keyword"] && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
              Keywords
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {Array.isArray(dataset["dcat:keyword"]) ? (
                dataset["dcat:keyword"].map(
                  (keyword: string, index: number) => (
                    <Chip
                      key={index}
                      size="small"
                      label={keyword}
                      color="secondary"
                      variant="outlined"
                    />
                  )
                )
              ) : (
                <Chip
                  size="small"
                  label={dataset["dcat:keyword"]}
                  color="secondary"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>
        )}
      </Box>

      {/* Short Description */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
          Description
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            lineHeight: 1.5,
            fontStyle: dataset["dct:abstract"] ? "normal" : "italic",
          }}
        >
          {dataset["dct:abstract"] || "No description available"}
        </Typography>
      </Box>

      {/* Policy Selection */}
      <Divider sx={{ my: 3 }} />
      <PolicySelection
        policies={policies}
        selectedPolicy={selectedPolicy}
        onPolicyChange={onPolicyChange}
      />
    </Box>
  );
};

interface PolicySelectionProps {
  policies: any[];
  selectedPolicy: number;
  onPolicyChange: (index: number) => void;
}

const PolicySelection: React.FC<PolicySelectionProps> = ({
  policies,
  selectedPolicy,
  onPolicyChange,
}) => {
  if (!policies.length) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          No Policies Available
        </Typography>
        <Typography color="textSecondary">
          This dataset has no policies available for negotiation.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", minWidth: 0 }}>
      <Typography variant="h6" gutterBottom>
        Select a Policy for Contract Negotiation
      </Typography>

      {policies[selectedPolicy] && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Policy Details
          </Typography>
          <PermissionAccordion record={policies[selectedPolicy]} />
        </Box>
      )}
    </Box>
  );
};
