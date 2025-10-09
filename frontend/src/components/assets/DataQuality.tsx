import { Labeled, FunctionField, useTranslate } from "react-admin";
import { Typography, Box } from "@mui/material";

export const DataQuality = () => {
  const translate = useTranslate();

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {translate("resources.assets.tabs.dataQualityTab.shortDescription")}
      </Typography>

      <Labeled
        fullWidth
        label={translate(
          "resources.assets.tabs.dataQualityTab.qualityMeasurements"
        )}
      >
        <FunctionField
          render={(record: any) => {
            const measurements = record?.qualityMeasurements;
            if (
              !measurements ||
              !Array.isArray(measurements) ||
              measurements.length === 0
            ) {
              return translate(
                "resources.assets.tabs.dataQualityTab.noQualityMeasurements"
              );
            }
            return (
              <div>
                {measurements.map((item: any, index: number) => (
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
                          "resources.assets.tabs.dataQualityTab.measurement"
                        )}
                      </strong>{" "}
                      {item.measurementOf?.title || "-"}
                    </div>
                    <div>
                      <strong>
                        {translate(
                          "resources.assets.tabs.dataQualityTab.value"
                        )}
                      </strong>{" "}
                      {item.value || "-"}
                    </div>
                    <div>
                      <strong>
                        {translate(
                          "resources.assets.tabs.dataQualityTab.measurementDescription"
                        )}
                      </strong>{" "}
                      {item.description || "-"}
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
