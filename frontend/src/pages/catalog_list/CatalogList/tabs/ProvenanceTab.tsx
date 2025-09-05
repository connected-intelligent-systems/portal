import React from "react";
import { useTranslate } from "react-admin";
import { Typography, Box, List, ListItem, ListItemText } from "@mui/material";

interface ProvenanceTabProps {
  dataset: any;
}

export const ProvenanceTab: React.FC<ProvenanceTabProps> = ({ dataset }) => {
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
        {translate("resources.assets.tabs.provenanceTab.description")}{" "}
        <a
          href="https://www.w3.org/TR/prov-o/"
          target="_blank"
          rel="noopener noreferrer"
        >
          {translate("resources.assets.tabs.provenanceTab.provLink")}
        </a>
        .
      </Typography>

      {renderMetadataSection([
        {
          label: translate(
            "resources.assets.tabs.provenanceTab.wasDerivedFrom"
          ),
          value: dataset["http://www.w3.org/ns/prov#wasDerivedFrom"]
            ? typeof dataset["http://www.w3.org/ns/prov#wasDerivedFrom"] ===
              "object"
              ? dataset["http://www.w3.org/ns/prov#wasDerivedFrom"]["@id"] ||
                translate(
                  "resources.assets.tabs.provenanceTab.sourceEntitySpecified"
                )
              : dataset["http://www.w3.org/ns/prov#wasDerivedFrom"]
            : null,
        },
        {
          label: translate(
            "resources.assets.tabs.provenanceTab.wasGeneratedBy"
          ),
          value: dataset["http://www.w3.org/ns/prov#wasGeneratedBy"]
            ? typeof dataset["http://www.w3.org/ns/prov#wasGeneratedBy"] ===
              "object"
              ? dataset["http://www.w3.org/ns/prov#wasGeneratedBy"][
                  "dct:description"
                ] ||
                translate(
                  "resources.assets.tabs.provenanceTab.activitySpecified"
                )
              : dataset["http://www.w3.org/ns/prov#wasGeneratedBy"]
            : null,
        },
        {
          label: translate(
            "resources.assets.tabs.provenanceTab.wasAttributedTo"
          ),
          value: dataset["http://www.w3.org/ns/prov#wasAttributedTo"]
            ? typeof dataset["http://www.w3.org/ns/prov#wasAttributedTo"] ===
              "object"
              ? dataset["http://www.w3.org/ns/prov#wasAttributedTo"]["@id"] ||
                translate("resources.assets.tabs.provenanceTab.agentSpecified")
              : dataset["http://www.w3.org/ns/prov#wasAttributedTo"]
            : null,
        },
      ])}
    </Box>
  );
};
