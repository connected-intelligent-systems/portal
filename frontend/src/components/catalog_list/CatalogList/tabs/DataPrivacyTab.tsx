import React from "react";
import {
  Typography,
  Box,
} from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";

interface DataPrivacyTabProps {
  dataset: any;
}

export const DataPrivacyTab: React.FC<DataPrivacyTabProps> = ({ dataset }) => {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Information about data privacy handling based on the Data Privacy
        Vocabulary (DPV).
      </Typography>

      {dataset["https://w3id.org/dpv#hasPersonalDataHandling"] ? (
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
            <strong>Personal Data Type:</strong>{" "}
            {dataset["https://w3id.org/dpv#hasPersonalDataHandling"][
              "https://w3id.org/dpv#hasData"
            ] || "-"}
          </Typography>
          <Typography variant="body2">
            <strong>Purpose:</strong>{" "}
            {dataset["https://w3id.org/dpv#hasPersonalDataHandling"][
              "https://w3id.org/dpv#hasPurpose"
            ] || "-"}
          </Typography>
          <Typography variant="body2">
            <strong>Legal Basis:</strong>{" "}
            {dataset["https://w3id.org/dpv#hasPersonalDataHandling"][
              "https://w3id.org/dpv#hasLegalBasis"
            ] || "-"}
          </Typography>
          <Typography variant="body2">
            <strong>Applicable Law:</strong>{" "}
            {dataset["https://w3id.org/dpv#hasPersonalDataHandling"][
              "https://w3id.org/dpv#hasLaw"
            ] || "-"}
          </Typography>
        </Box>
      ) : (
        <Typography variant="body2" color="textSecondary">
          No personal data handling information specified
        </Typography>
      )}
    </Box>
  );
};
