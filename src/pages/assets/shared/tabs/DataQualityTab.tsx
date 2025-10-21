import {
  ArrayInput,
  SimpleFormIterator,
  TextInput,
  useTranslate,
} from "react-admin";
import { Typography, Box } from "@mui/material";

export const DataQualityTab = () => {
  const translate = useTranslate();

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {translate("resources.assets.create.dataQuality.description")}
      </Typography>
      <ArrayInput
        source="qualityMeasurements"
        label={translate(
          "resources.assets.create.dataQuality.fields.qualityMeasurements"
        )}
      >
        <SimpleFormIterator>
          <TextInput
            source="measurementOf.title"
            label={translate(
              "resources.assets.create.dataQuality.fields.measurement"
            )}
            helperText={translate(
              "resources.assets.create.dataQuality.fields.measurementHelper"
            )}
          />
          <TextInput
            source="value"
            label={translate(
              "resources.assets.create.dataQuality.fields.value"
            )}
            helperText={translate(
              "resources.assets.create.dataQuality.fields.valueHelper"
            )}
          />
          <TextInput
            source="description"
            label={translate(
              "resources.assets.create.dataQuality.fields.description"
            )}
            helperText={translate(
              "resources.assets.create.dataQuality.fields.descriptionHelper"
            )}
          />
        </SimpleFormIterator>
      </ArrayInput>
    </Box>
  );
};
