import {
  ArrayInput,
  AutocompleteInput,
  SimpleFormIterator,
} from "react-admin";
import { Typography, Link, Box } from "@mui/material";

const personalDataChoices = [
  { id: "dpv:Location", name: "Location" },
  { id: "dpv:Demographic", name: "Demographic" },
  { id: "dpv:Financial", name: "Financial" },
  { id: "dpv:Health", name: "Health" },
  { id: "dpv:Biometric", name: "Biometric" },
  { id: "dpv:Genetic", name: "Genetic" },
  { id: "dpv:Communication", name: "Communication" },
  { id: "dpv:Social", name: "Social" },
  { id: "dpv:Tracking", name: "Tracking" },
  { id: "dpv:Behavioural", name: "Behavioural" },
  { id: "dpv:Identity", name: "Identity" },
];

const purposeChoices = [
  { id: "dpv:ResearchAndDevelopment", name: "Research and Development" },
  { id: "dpv:Marketing", name: "Marketing" },
  { id: "dpv:Advertising", name: "Advertising" },
  { id: "dpv:Security", name: "Security" },
  { id: "dpv:Personalisation", name: "Personalisation" },
  { id: "dpv:ServiceProvision", name: "Service Provision" },
  { id: "dpv:Analytics", name: "Analytics" },
  { id: "dpv:CustomerManagement", name: "Customer Management" },
];

const legalBasisChoices = [
  { id: "dpv:Consent", name: "Consent" },
  { id: "dpv:Contract", name: "Contract" },
  { id: "dpv:LegalObligation", name: "Legal Obligation" },
  { id: "dpv:VitalInterest", name: "Vital Interest" },
  { id: "dpv:PublicInterest", name: "Public Interest" },
  { id: "dpv:LegitimateInterest", name: "Legitimate Interest" },
];

const lawChoices = [
  { id: "dpv:GDPR", name: "GDPR" },
  { id: "dpv:CCPA", name: "CCPA" },
  { id: "dpv:LGPD", name: "LGPD" },
  { id: "dpv:PIPEDA", name: "PIPEDA" },
];

export const DataPrivacy = () => {
  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Specify how data privay is handled in this asset, based on the DPV
        vocabulary. For more information, see the{" "}
        <Link
          href="https://w3c.github.io/dpv/2.1/dpv/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Data Privacy Vocabulary (DPV)
        </Link>
        .
      </Typography>
      <ArrayInput source="properties.dpv:hasPersonalDataHandling" label="Personal Data Handling">
        <SimpleFormIterator>
          <AutocompleteInput
            source="dpv:hasData"
            label="Personal Data"
            helperText="The type of personal data handled in the dataset."
            choices={personalDataChoices}
            fullWidth
          />
          <AutocompleteInput
            source="dpv:hasPurpose"
            label="Purpose"
            helperText="The purpose for which personal data is processed."
            choices={purposeChoices}
            fullWidth
          />
          <AutocompleteInput
            source="dpv:hasLegalBasis"
            label="Legal Basis"
            helperText="The legal basis for processing personal data."
            choices={legalBasisChoices}
            fullWidth
          />
          <AutocompleteInput
            source="dpv:hasLaw"
            label="Law"
            helperText="The law governing the processing of personal data."
            choices={lawChoices}
            fullWidth
          />
        </SimpleFormIterator>
      </ArrayInput>
    </Box>
  );
};
