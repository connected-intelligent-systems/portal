import React from "react";
import { useTranslate } from "react-admin";
import { Typography, Box } from "@mui/material";

interface DataPrivacyTabProps {
  dataset: any;
}

export const DataPrivacyTab: React.FC<DataPrivacyTabProps> = ({ dataset }) => {
  const translate = useTranslate();

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {translate("resources.assets.tabs.dataPrivacyTab.description")}{" "}
        <a
          href="https://w3c.github.io/dpv/2.1/dpv/"
          target="_blank"
          rel="noopener noreferrer"
        >
          {translate("resources.assets.tabs.dataPrivacyTab.dpvLink")}
        </a>
        .
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
            <strong>
              {translate(
                "resources.assets.tabs.dataPrivacyTab.personalDataType"
              )}
              :
            </strong>{" "}
            {dataset["https://w3id.org/dpv#hasPersonalDataHandling"][
              "https://w3id.org/dpv#hasData"
            ] || "-"}
          </Typography>
          <Typography variant="body2">
            <strong>
              {translate("resources.assets.tabs.dataPrivacyTab.purpose")}:
            </strong>{" "}
            {dataset["https://w3id.org/dpv#hasPersonalDataHandling"][
              "https://w3id.org/dpv#hasPurpose"
            ] || "-"}
          </Typography>
          <Typography variant="body2">
            <strong>
              {translate("resources.assets.tabs.dataPrivacyTab.legalBasis")}:
            </strong>{" "}
            {dataset["https://w3id.org/dpv#hasPersonalDataHandling"][
              "https://w3id.org/dpv#hasLegalBasis"
            ] || "-"}
          </Typography>
          <Typography variant="body2">
            <strong>
              {translate("resources.assets.tabs.dataPrivacyTab.applicableLaw")}:
            </strong>{" "}
            {dataset["https://w3id.org/dpv#hasPersonalDataHandling"][
              "https://w3id.org/dpv#hasLaw"
            ] || "-"}
          </Typography>
        </Box>
      ) : (
        <Typography variant="body2" color="textSecondary">
          {translate(
            "resources.assets.tabs.dataPrivacyTab.noPersonalDataHandling"
          )}
        </Typography>
      )}
    </Box>
  );
};
