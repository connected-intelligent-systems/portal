import { ArrayInput, SimpleFormIterator, TextInput } from "react-admin";
import { Typography, Box, Link } from "@mui/material";

export const DataQuality = () => {
  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Specify quality measurements for this asset using the Data Quality
        Vocabulary (DQV). For more information, see the{" "}
        <Link
          href="https://www.w3.org/TR/vocab-dqv/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Data Quality Vocabulary (DQV)
        </Link>
        .
      </Typography>
      <ArrayInput
        source="properties.dqv:hasQualityMeasurement"
        label="Quality Measurements"
      >
        <SimpleFormIterator>
          <TextInput
            source="dqv:isMeasurementOf.dct:title"
            label="Measurement"
            helperText="The quality metric being measured."
          />
          <TextInput
            source="dqv:value"
            label="Value"
            helperText="The value of the quality measurement."
          />
          <TextInput
            source="dct:description"
            label="Description"
            helperText="A description of the quality measurement."
          />
        </SimpleFormIterator>
      </ArrayInput>
    </Box>
  );
};
