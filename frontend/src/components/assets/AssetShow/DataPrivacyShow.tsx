import {
  Labeled,
  FunctionField,
} from "react-admin";
import { Typography, Box, Link } from "@mui/material";

export const DataPrivacyShow = () => {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Information about data privacy handling based on the DPV vocabulary. For
        more information, see the{" "}
        <Link
          href="https://w3c.github.io/dpv/2.1/dpv/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Data Privacy Vocabulary (DPV)
        </Link>
        .
      </Typography>

      <Labeled fullWidth label="Personal Data Handling">
        <FunctionField
          render={(record: any) => {
            const handlingData =
              record?.properties?.[
                "https://w3id.org/dpv#hasPersonalDataHandling"
              ];
            if (
              !handlingData ||
              !Array.isArray(handlingData) ||
              handlingData.length === 0
            ) {
              return "No personal data handling specified";
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
                      <strong>Personal Data Type:</strong>{" "}
                      {item["https://w3id.org/dpv#hasData"] || "-"}
                    </div>
                    <div>
                      <strong>Purpose:</strong>{" "}
                      {item["https://w3id.org/dpv#hasPurpose"] || "-"}
                    </div>
                    <div>
                      <strong>Legal Basis:</strong>{" "}
                      {item["https://w3id.org/dpv#hasLegalBasis"] || "-"}
                    </div>
                    <div>
                      <strong>Applicable Law:</strong>{" "}
                      {item["https://w3id.org/dpv#hasLaw"] || "-"}
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
