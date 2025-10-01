import React from "react";
import { useTranslate } from "react-admin";
import { Typography, Box } from "@mui/material";

interface DataQualityTabProps {
  dataset: any;
}

export const DataQualityTab: React.FC<DataQualityTabProps> = ({ dataset }) => {
  const translate = useTranslate();

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {translate("resources.assets.tabs.dataQualityTab.description")}{" "}
        <a
          href="https://www.w3.org/TR/vocab-dqv/"
          target="_blank"
          rel="noopener noreferrer"
        >
          {translate("resources.assets.tabs.dataQualityTab.dqvLink")}
        </a>
        .
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
            <strong>
              {translate("resources.assets.tabs.dataQualityTab.measurement")}:
            </strong>{" "}
            {dataset["http://www.w3.org/ns/dqv#hasQualityMeasurement"][
              "http://www.w3.org/ns/dqv#isMeasurementOf"
            ]?.["dct:title"] || "-"}
          </Typography>
          <Typography variant="body2">
            <strong>
              {translate("resources.assets.tabs.dataQualityTab.value")}:
            </strong>{" "}
            {dataset["http://www.w3.org/ns/dqv#hasQualityMeasurement"][
              "http://www.w3.org/ns/dqv#value"
            ] || "-"}
          </Typography>
          <Typography variant="body2">
            <strong>
              {translate(
                "resources.assets.tabs.dataQualityTab.measurementDescription"
              )}
              :
            </strong>{" "}
            {dataset["http://www.w3.org/ns/dqv#hasQualityMeasurement"][
              "dct:description"
            ] || "-"}
          </Typography>
        </Box>
      ) : (
        <Typography variant="body2" color="textSecondary">
          {translate(
            "resources.assets.tabs.dataQualityTab.noQualityMeasurements"
          )}
        </Typography>
      )}
    </Box>
  );
};
