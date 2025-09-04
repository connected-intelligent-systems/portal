import {
  Labeled,
  Show,
  SimpleShowLayout,
  TopToolbar,
  DeleteButton,
  TextField,
  BooleanField,
  FunctionField,
  useRecordContext,
  DateField,
  ArrayField,
  SingleFieldList,
  ChipField,
} from "react-admin";
import {
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { MarkdownField } from "../../markdown";
import { PasswordField } from "../../password_field";
import { BasicInformationShow } from "./BasicInformationShow";
import { VersioningShow } from "./VersioningShow";
import { ProvenanceShow } from "./ProvenanceShow";
import { DataPrivacyShow } from "./DataPrivacyShow";
import { DataQualityShow } from "./DataQualityShow";
import { DataAddressShow } from "./DataAddressShow";

const AssetShowBar = () => {
  return (
    <TopToolbar>
      <DeleteButton mutationMode="pessimistic" />
    </TopToolbar>
  );
};

export const AssetShow = () => {
  return (
    <Show actions={<AssetShowBar />}>
      <SimpleShowLayout>
        <FunctionField
          source="properties.http://purl.org/dc/terms/title"
          render={(record: any) => (
            <>
              <Typography variant="h4" gutterBottom>
                {record?.properties?.["http://purl.org/dc/terms/title"] || "Untitled Asset"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ID: {record.id}
              </Typography>
            </>
          )}
        />

        <Box sx={{ mt: 3 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6">Basic Information</Typography>
            <Typography variant="body2" color="text.secondary">
              Essential metadata including title, description, keywords, and identifiers
            </Typography>
          </Box>
          <BasicInformationShow />
        </Box>

        <Box sx={{ mt: 3 }}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box>
                <Typography variant="h6">Versioning</Typography>
                <Typography variant="body2" color="text.secondary">
                  Version information, creator, dates, and previous versions
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <VersioningShow />
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box>
                <Typography variant="h6">Provenance</Typography>
                <Typography variant="body2" color="text.secondary">
                  Origin and history information about the asset's creation
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <ProvenanceShow />
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box>
                <Typography variant="h6">Data Privacy</Typography>
                <Typography variant="body2" color="text.secondary">
                  Personal data handling, purposes, legal basis, and compliance
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <DataPrivacyShow />
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box>
                <Typography variant="h6">Data Quality</Typography>
                <Typography variant="body2" color="text.secondary">
                  Quality measurements, metrics, and assessments
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <DataQualityShow />
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box>
                <Typography variant="h6">Data Address</Typography>
                <Typography variant="body2" color="text.secondary">
                  Technical configuration for accessing the asset's data
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <DataAddressShow />
            </AccordionDetails>
          </Accordion>
        </Box>
      </SimpleShowLayout>
    </Show>
  );
};