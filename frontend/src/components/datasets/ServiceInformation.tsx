import React from "react";
import { useTranslate } from "react-admin";
import { Typography, Box, List, ListItem, ListItemText } from "@mui/material";

interface ServiceInformationProps {
  dataset: any;
}

export const ServiceInformation: React.FC<ServiceInformationProps> = ({
  dataset,
}) => {
  const translate = useTranslate();
  console.log("!!!!", dataset);
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
        {translate("resources.assets.tabs.serviceInformationTab.description")}
      </Typography>

      {dataset["dcat:service"] ? (
        <>
          {renderMetadataSection([
            {
              label: translate(
                "resources.assets.tabs.serviceInformationTab.endpointUrl"
              ),
              value: dataset["dcat:service"]["dcat:endpointUrl"],
            },
            {
              label: translate(
                "resources.assets.tabs.serviceInformationTab.serviceType"
              ),
              value: dataset["dcat:service"]["@type"],
            },
            {
              label: translate(
                "resources.assets.tabs.serviceInformationTab.terms"
              ),
              value: dataset["dcat:service"]["dct:terms"],
            },
            {
              label: translate(
                "resources.assets.tabs.serviceInformationTab.endpointDescription"
              ),
              value: dataset["dcat:service"]["dcat:endpointDescription"],
            },
          ])}
        </>
      ) : (
        <Typography variant="body2" color="textSecondary">
          {translate(
            "resources.assets.tabs.serviceInformationTab.noServiceInformation"
          )}
        </Typography>
      )}

      {/* Distribution Information */}
      {dataset["dcat:distribution"] &&
      Array.isArray(dataset["dcat:distribution"]) &&
      dataset["dcat:distribution"].length > 0 ? (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
            {translate(
              "resources.assets.tabs.serviceInformationTab.distributions"
            )}
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
                  <strong>
                    {translate(
                      "resources.assets.tabs.serviceInformationTab.distribution"
                    )}{" "}
                    {index + 1}
                  </strong>
                </Typography>
                {distribution["@id"] && (
                  <Typography variant="body2">
                    <strong>
                      {translate(
                        "resources.assets.tabs.serviceInformationTab.id"
                      )}
                      :
                    </strong>{" "}
                    {distribution["@id"]}
                  </Typography>
                )}
                {distribution["dcat:mediaType"] && (
                  <Typography variant="body2">
                    <strong>
                      {translate(
                        "resources.assets.tabs.serviceInformationTab.mediaType"
                      )}
                      :
                    </strong>{" "}
                    {distribution["dcat:mediaType"]}
                  </Typography>
                )}
                {distribution["dcat:accessURL"] && (
                  <Typography variant="body2">
                    <strong>
                      {translate(
                        "resources.assets.tabs.serviceInformationTab.accessUrl"
                      )}
                      :
                    </strong>{" "}
                    {distribution["dcat:accessURL"]}
                  </Typography>
                )}
              </Box>
            )
          )}
        </Box>
      ) : (
        <Typography variant="body2" color="textSecondary" sx={{ mt: 3 }}>
          {translate(
            "resources.assets.tabs.serviceInformationTab.noDistributionInformation"
          )}
        </Typography>
      )}
    </Box>
  );
};
