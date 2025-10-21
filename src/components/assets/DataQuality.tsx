import { Datagrid, Labeled, TextField, useTranslate } from "react-admin";
import { Typography, Box } from "@mui/material";
import { EnsureArrayField } from "../EnsureArrayField";

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
        <EnsureArrayField
          source="qualityMeasurements"
          emptyText={translate(
            "resources.assets.tabs.dataQualityTab.noQualityMeasurements"
          )}
        >
          <Datagrid
            bulkActionButtons={false}
            rowClick={false}
            size="small"
            hover={false}
            sx={{
              "& .MuiTableCell-root": {
                whiteSpace: "normal",
                wordBreak: "break-word",
              },
            }}
          >
            <TextField
              source="measurementOf.title"
              label={translate(
                "resources.assets.tabs.dataQualityTab.measurement"
              )}
              emptyText="-"
              sortable={false}
            />
            <TextField
              source="value"
              label={translate("resources.assets.tabs.dataQualityTab.value")}
              emptyText="-"
              sortable={false}
            />
            <TextField
              source="description"
              label={translate(
                "resources.assets.tabs.dataQualityTab.measurementDescription"
              )}
              emptyText="-"
              sortable={false}
            />
          </Datagrid>
        </EnsureArrayField>
      </Labeled>
    </Box>
  );
};
