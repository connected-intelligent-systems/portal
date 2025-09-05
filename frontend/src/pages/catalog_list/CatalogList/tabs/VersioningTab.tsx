import React from "react";
import { useTranslate } from "react-admin";
import { Typography, Box, List, ListItem, ListItemText } from "@mui/material";

interface VersioningTabProps {
  dataset: any;
}

export const VersioningTab: React.FC<VersioningTabProps> = ({ dataset }) => {
  const translate = useTranslate();
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
        {translate("resources.assets.tabs.versioningTab.description")}{" "}
        <a
          href="https://www.dublincore.org/specifications/dublin-core/dcmi-terms/"
          target="_blank"
          rel="noopener noreferrer"
        >
          {translate("resources.assets.tabs.versioningTab.dublinCoreLink")}
        </a>{" "}
        and{" "}
        <a
          href="https://www.w3.org/TR/owl2-overview/"
          target="_blank"
          rel="noopener noreferrer"
        >
          {translate("resources.assets.tabs.versioningTab.owlLink")}
        </a>
        .
      </Typography>

      {renderMetadataSection([
        {
          label: translate("resources.assets.tabs.versioningTab.version"),
          value: dataset["http://www.w3.org/2002/07/owl#versionInfo"],
        },
        {
          label: translate("resources.assets.tabs.versioningTab.creator"),
          value: dataset["dct:creator"]
            ? typeof dataset["dct:creator"] === "object"
              ? dataset["dct:creator"]["http://schema.org/name"] ||
                dataset["dct:creator"]["@id"]
              : dataset["dct:creator"]
            : null,
        },
        {
          label: translate("resources.assets.tabs.versioningTab.created"),
          value: dataset["dct:created"]
            ? new Date(dataset["dct:created"]).toLocaleDateString()
            : null,
        },
        {
          label: translate("resources.assets.tabs.versioningTab.modified"),
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
              label: translate(
                "resources.assets.tabs.versioningTab.previousVersion"
              ),
              value:
                dataset["dct:hasVersion"][
                  "http://www.w3.org/2002/07/owl#versionInfo"
                ],
            },
            {
              label: translate(
                "resources.assets.tabs.versioningTab.previousVersionIssued"
              ),
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
