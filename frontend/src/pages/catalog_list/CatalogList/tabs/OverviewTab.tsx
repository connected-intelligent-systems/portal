import React from "react";
import { useTranslate } from "react-admin";
import { Typography, Box, Chip, Divider } from "@mui/material";
import { PermissionAccordion } from "../PermissionAccordion";
import { Dataset } from "../../../../types/catalog";

interface OverviewTabProps {
  dataset: Dataset;
  policies: any[];
  selectedPolicy: number;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  dataset,
  policies,
  selectedPolicy,
}) => {
  const translate = useTranslate();
  const datasetTitle =
    dataset?.title ||
    dataset?.name ||
    translate("resources.catalog.dataset.unnamedDataset");
  const datasetId = dataset?.id;

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
          {dataset?.theme && (
            <Chip
              size="small"
              label={
                typeof dataset.theme === "object"
                  ? dataset.theme?.title ||
                    dataset.theme?.id ||
                    translate("resources.catalog.dataset.unknownCategory")
                  : dataset.theme
              }
              color="primary"
              variant="outlined"
            />
          )}
          {dataset?.mediaType && (
            <Chip
              size="small"
              label={dataset.mediaType}
              color="info"
              variant="outlined"
            />
          )}
        </Box>
        {dataset?.keywords && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
              {translate("resources.catalog.dataset.keywords")}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {Array.isArray(dataset.keywords) ? (
                dataset.keywords.map((keyword: string, index: number) => (
                  <Chip
                    key={index}
                    size="small"
                    label={keyword}
                    color="secondary"
                    variant="outlined"
                  />
                ))
              ) : (
                <Chip
                  size="small"
                  label={dataset.keywords}
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
            fontStyle: dataset?.abstract ? "normal" : "italic",
          }}
        >
          {dataset?.abstract || "No description available"}
        </Typography>
      </Box>

      {/* Policy Selection */}
      <Divider sx={{ my: 3 }} />
      <PolicySelection policies={policies} selectedPolicy={selectedPolicy} />
    </Box>
  );
};

interface PolicySelectionProps {
  policies: any[];
  selectedPolicy: number;
}

const PolicySelection: React.FC<PolicySelectionProps> = ({
  policies,
  selectedPolicy,
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
