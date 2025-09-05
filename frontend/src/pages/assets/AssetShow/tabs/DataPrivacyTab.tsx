import { FunctionField, Labeled, useTranslate } from "react-admin";
import { Typography, Box, Link } from "@mui/material";

export const DataPrivacyTab = () => {
  const translate = useTranslate();

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Privacy and legal information for personal data handling.
      </Typography>

      <Labeled
        fullWidth
        label={translate(
          "resources.assets.tabs.dataPrivacyTab.personalDataHandling"
        )}
      >
        <FunctionField
          render={(record: any) => {
            const handlingData =
              record?.properties?.["dpv:hasPersonalDataHandling"];
            if (
              !handlingData ||
              !Array.isArray(handlingData) ||
              handlingData.length === 0
            ) {
              return translate(
                "resources.assets.tabs.dataPrivacyTab.noPersonalDataHandling"
              );
            }
            return (
              <div>
                {handlingData.map((item: any, index: number) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: "16px",
                      padding: "8px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                    }}
                  >
                    <div>
                      <strong>
                        {translate(
                          "resources.assets.tabs.dataPrivacyTab.personalDataType"
                        )}
                      </strong>{" "}
                      {item["dpv:hasData"] || "-"}
                    </div>
                    <div>
                      <strong>
                        {translate(
                          "resources.assets.tabs.dataPrivacyTab.purpose"
                        )}
                      </strong>{" "}
                      {item["dpv:hasPurpose"] || "-"}
                    </div>
                    <div>
                      <strong>
                        {translate(
                          "resources.assets.tabs.dataPrivacyTab.legalBasis"
                        )}
                      </strong>{" "}
                      {item["dpv:hasLegalBasis"] || "-"}
                    </div>
                    <div>
                      <strong>
                        {translate(
                          "resources.assets.tabs.dataPrivacyTab.applicableLaw"
                        )}
                      </strong>{" "}
                      {item["dpv:hasLaw"] || "-"}
                    </div>
                  </div>
                ))}
              </div>
            );
          }}
        />
      </Labeled>
    </Box>
  );
};
