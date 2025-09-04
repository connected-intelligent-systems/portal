import {
  Labeled,
  TextField,
  DateField,
  ArrayField,
  Datagrid,
  FunctionField,
} from "react-admin";
import { Typography, Box, Link } from "@mui/material";

export const VersioningShow = () => {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Versioning and metadata information based on Dublin Core Terms and OWL vocabularies. For more information, see{" "}
        <Link
          href="https://www.dublincore.org/specifications/dublin-core/dcmi-terms/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Dublin Core Terms
        </Link>
        {" "}and{" "}
        <Link
          href="https://www.w3.org/TR/owl-ref/"
          target="_blank"
          rel="noopener noreferrer"
        >
          OWL Web Ontology Language
        </Link>
        .
      </Typography>

      <Labeled fullWidth label="Version">
        <FunctionField render={(record: any) => 
          record?.properties?.["http://www.w3.org/2002/07/owl#versionInfo"] || "-"
        } />
      </Labeled>

      <Labeled fullWidth label="Creator">
        <FunctionField render={(record: any) => 
          record?.properties?.["http://purl.org/dc/terms/creator"]?.["http://schema.org/name"] || "-"
        } />
      </Labeled>

      <Labeled fullWidth label="Created">
        <FunctionField render={(record: any) => {
          const created = record?.properties?.["http://purl.org/dc/terms/created"];
          return created ? new Date(created).toLocaleDateString() : "-";
        }} />
      </Labeled>

      <Labeled fullWidth label="Modified">
        <FunctionField render={(record: any) => {
          const modified = record?.properties?.["http://purl.org/dc/terms/modified"];
          return modified ? new Date(modified).toLocaleDateString() : "-";
        }} />
      </Labeled>

      <Labeled fullWidth label="Previous Versions">
        <FunctionField render={(record: any) => {
          const versions = record?.properties?.["http://purl.org/dc/terms/hasVersion"];
          if (!versions) {
            return "No previous versions";
          }
          
          // Handle case where single version is returned as object instead of array
          const versionsArray = Array.isArray(versions) ? versions : [versions];
          if (versionsArray.length === 0) {
            return "No previous versions";
          }
          
          return (
            <Box sx={{ pl: 2 }}>
              {versionsArray.map((version: any, index: number) => (
                <Box key={index} sx={{ mb: 1.5, pb: 1, borderBottom: index < versionsArray.length - 1 ? '1px solid #eee' : 'none' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                    Version: {version["http://www.w3.org/2002/07/owl#versionInfo"] || "-"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                    Issued: {version["http://purl.org/dc/terms/issued"] ? new Date(version["http://purl.org/dc/terms/issued"]).toLocaleDateString() : "-"}
                  </Typography>
                </Box>
              ))}
            </Box>
          );
        }} />
      </Labeled>
    </Box>
  );
};