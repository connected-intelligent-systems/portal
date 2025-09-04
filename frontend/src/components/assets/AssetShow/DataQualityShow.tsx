import {
  Labeled,
  TextField,
  ArrayField,
  Datagrid,
  FunctionField,
} from "react-admin";
import { Typography, Box, Link } from "@mui/material";

export const DataQualityShow = () => {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Quality measurements for this asset using the Data Quality Vocabulary
        (DQV). For more information, see the{" "}
        <Link
          href="https://www.w3.org/TR/vocab-dqv/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Data Quality Vocabulary (DQV)
        </Link>
        .
      </Typography>

      <Labeled fullWidth label="Quality Measurements">
        <FunctionField
          render={(record: any) => {
            const measurements =
              record?.properties?.[
                "http://www.w3.org/ns/dqv#hasQualityMeasurement"
              ];
            if (
              !measurements ||
              !Array.isArray(measurements) ||
              measurements.length === 0
            ) {
              return "No quality measurements specified";
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
                      <strong>Measurement:</strong>{" "}
                      {item["http://www.w3.org/ns/dqv#isMeasurementOf"]?.[
                        "http://purl.org/dc/terms/title"
                      ] || "-"}
                    </div>
                    <div>
                      <strong>Value:</strong>{" "}
                      {item["http://www.w3.org/ns/dqv#value"] || "-"}
                    </div>
                    <div>
                      <strong>Description:</strong>{" "}
                      {item["http://purl.org/dc/terms/description"] || "-"}
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
