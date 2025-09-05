import React from "react";
import {
  Typography,
  Box,
} from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";

interface DataQualityTabProps {
  dataset: any;
}

export const DataQualityTab: React.FC<DataQualityTabProps> = ({ dataset }) => {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Quality measurements using the Data Quality Vocabulary (DQV).
      </Typography>

      {dataset["http://www.w3.org/ns/dqv#hasQualityMeasurement"] ? (
        <Box
          sx={{
            mb: 2,
            p: 2,
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
          }}
        >
          <Typography variant="body2">
            <strong>Measurement:</strong>{" "}
            {dataset["http://www.w3.org/ns/dqv#hasQualityMeasurement"][
              "http://www.w3.org/ns/dqv#isMeasurementOf"
            ]?.["dct:title"] || "-"}
          </Typography>
          <Typography variant="body2">
            <strong>Value:</strong>{" "}
            {dataset["http://www.w3.org/ns/dqv#hasQualityMeasurement"][
              "http://www.w3.org/ns/dqv#value"
            ] || "-"}
          </Typography>
          <Typography variant="body2">
            <strong>Description:</strong>{" "}
            {dataset["http://www.w3.org/ns/dqv#hasQualityMeasurement"][
              "dct:description"
            ] || "-"}
          </Typography>
        </Box>
      ) : (
        <Typography variant="body2" color="textSecondary">
          No quality measurements specified
        </Typography>
      )}
    </Box>
  );
};
