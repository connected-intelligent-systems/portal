import React, { useState } from "react";
import { Link } from "react-admin";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button,
  Tabs,
  Tab,
  Chip,
  useMediaQuery,
  useTheme,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import HandshakeIcon from "@mui/icons-material/Handshake";
import InfoIcon from "@mui/icons-material/Info";
import PolicyIcon from "@mui/icons-material/Policy";
import HistoryIcon from "@mui/icons-material/History";
import SecurityIcon from "@mui/icons-material/Security";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import CloudIcon from "@mui/icons-material/Cloud";
import { PermissionAccordion } from "./PermissionAccordion";

interface ContractNegotiationDialogProps {
  dataset: any;
  open: boolean;
  onClose: () => void;
}

export const ContractNegotiationDialog = ({
  dataset,
  open,
  onClose,
}: ContractNegotiationDialogProps) => {
  const [selectedPolicy, setSelectedPolicy] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const policies = dataset?.["odrl:hasPolicy"] || [];
  const datasetId = dataset?.["@id"];
  const datasetTitle = dataset?.["dct:title"] || dataset?.name || datasetId;
  const counterPartyAddress = dataset?.["dcat:service"]?.["dcat:endpointUrl"];
  const participantId = dataset?.["dspace:participantId"];

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const renderMetadataSection = (fields: any[]) => {
    const availableFields = fields.filter((field) => field.value);
    if (availableFields.length === 0) return null;

    return (
      <Box sx={{ mb: 3 }}>
        <List disablePadding>
          {availableFields.map((field, index) => (
            <ListItem key={index} disablePadding sx={{ mb: 1 }}>
              <ListItemText
                primary={
                  field.icon ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {field.icon}
                      <Typography variant="body2" fontWeight="medium">
                        {field.label}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" fontWeight="medium">
                      {field.label}
                    </Typography>
                  )
                }
                secondary={field.value}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    );
  };

  const OverviewTab = () => (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, pb: 2, borderBottom: 1, borderColor: "divider" }}>
        <Typography variant="h5" gutterBottom>
          {datasetTitle}
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          ID: {datasetId}
        </Typography>

        {/* Tags/Chips */}
        <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
          {dataset["dspace:participantId"] && (
            <Chip
              size="small"
              label={dataset["dspace:participantId"]}
              variant="outlined"
            />
          )}
          {dataset["dcat:theme"] && (
            <Chip
              size="small"
              label={
                typeof dataset["dcat:theme"] === "object"
                  ? dataset["dcat:theme"]["dct:title"] ||
                    dataset["dcat:theme"]["@id"] ||
                    "Unknown Category"
                  : dataset["dcat:theme"]
              }
              color="primary"
              variant="outlined"
            />
          )}
          {dataset["dcat:mediaType"] && (
            <Chip
              size="small"
              label={dataset["dcat:mediaType"]}
              color="info"
              variant="outlined"
            />
          )}
        </Box>
        {dataset["dcat:keyword"] && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
              Keywords
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {Array.isArray(dataset["dcat:keyword"]) ? (
                dataset["dcat:keyword"].map(
                  (keyword: string, index: number) => (
                    <Chip
                      key={index}
                      size="small"
                      label={keyword}
                      color="secondary"
                      variant="outlined"
                    />
                  )
                )
              ) : (
                <Chip
                  size="small"
                  label={dataset["dcat:keyword"]}
                  color="secondary"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>
        )}
      </Box>

      {/* Short Description */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
          Description
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            lineHeight: 1.5,
            fontStyle: dataset["dct:abstract"] ? "normal" : "italic",
          }}
        >
          {dataset["dct:abstract"] || "No description available"}
        </Typography>
      </Box>

      {/* Policy Selection moved to overview */}
      <Divider sx={{ my: 3 }} />
      <PolicySelection />
    </Box>
  );

  const VersioningTab = () => (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Version information, creator, dates, and previous versions based on
        Dublin Core Terms and OWL vocabularies.
      </Typography>

      {renderMetadataSection([
        {
          label: "Version",
          value: dataset["http://www.w3.org/2002/07/owl#versionInfo"],
        },
        {
          label: "Creator",
          value: dataset["dct:creator"]
            ? typeof dataset["dct:creator"] === "object"
              ? dataset["dct:creator"]["http://schema.org/name"] ||
                dataset["dct:creator"]["@id"]
              : dataset["dct:creator"]
            : null,
        },
        {
          label: "Created",
          value: dataset["dct:created"]
            ? new Date(dataset["dct:created"]).toLocaleDateString()
            : null,
        },
        {
          label: "Modified",
          value: dataset["dct:modified"]
            ? new Date(dataset["dct:modified"]).toLocaleDateString()
            : null,
        },
      ])}

      {/* Previous Versions */}
      {dataset["dct:hasVersion"] && (
        <>
          {renderMetadataSection([
            {
              label: "Previous Version",
              value:
                dataset["dct:hasVersion"][
                  "http://www.w3.org/2002/07/owl#versionInfo"
                ],
            },
            {
              label: "Previous Version Issued",
              value: dataset["dct:hasVersion"]["dct:issued"]
                ? new Date(
                    dataset["dct:hasVersion"]["dct:issued"]
                  ).toLocaleDateString()
                : null,
            },
          ])}
        </>
      )}
    </Box>
  );

  const ProvenanceTab = () => (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Information about the origin and history of this asset based on the
        PROV-O Ontology.
      </Typography>

      {renderMetadataSection([
        {
          label: "Was Derived From",
          value: dataset["http://www.w3.org/ns/prov#wasDerivedFrom"]
            ? typeof dataset["http://www.w3.org/ns/prov#wasDerivedFrom"] ===
              "object"
              ? dataset["http://www.w3.org/ns/prov#wasDerivedFrom"]["@id"] ||
                "Source entity specified"
              : dataset["http://www.w3.org/ns/prov#wasDerivedFrom"]
            : null,
        },
        {
          label: "Was Generated By",
          value: dataset["http://www.w3.org/ns/prov#wasGeneratedBy"]
            ? typeof dataset["http://www.w3.org/ns/prov#wasGeneratedBy"] ===
              "object"
              ? dataset["http://www.w3.org/ns/prov#wasGeneratedBy"][
                  "dct:description"
                ] || "Activity specified"
              : dataset["http://www.w3.org/ns/prov#wasGeneratedBy"]
            : null,
        },
        {
          label: "Was Attributed To",
          value: dataset["http://www.w3.org/ns/prov#wasAttributedTo"]
            ? typeof dataset["http://www.w3.org/ns/prov#wasAttributedTo"] ===
              "object"
              ? dataset["http://www.w3.org/ns/prov#wasAttributedTo"]["@id"] ||
                "Agent specified"
              : dataset["http://www.w3.org/ns/prov#wasAttributedTo"]
            : null,
        },
      ])}
    </Box>
  );

  const DataPrivacyTab = () => (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Information about data privacy handling based on the Data Privacy
        Vocabulary (DPV).
      </Typography>

      {dataset["https://w3id.org/dpv#hasPersonalDataHandling"] ? (
        <Box
          sx={{
            mb: 2,
            p: 2,
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
          }}
        >
          <Typography variant="body2">
            <strong>Personal Data Type:</strong>{" "}
            {dataset["https://w3id.org/dpv#hasPersonalDataHandling"][
              "https://w3id.org/dpv#hasData"
            ] || "-"}
          </Typography>
          <Typography variant="body2">
            <strong>Purpose:</strong>{" "}
            {dataset["https://w3id.org/dpv#hasPersonalDataHandling"][
              "https://w3id.org/dpv#hasPurpose"
            ] || "-"}
          </Typography>
          <Typography variant="body2">
            <strong>Legal Basis:</strong>{" "}
            {dataset["https://w3id.org/dpv#hasPersonalDataHandling"][
              "https://w3id.org/dpv#hasLegalBasis"
            ] || "-"}
          </Typography>
          <Typography variant="body2">
            <strong>Applicable Law:</strong>{" "}
            {dataset["https://w3id.org/dpv#hasPersonalDataHandling"][
              "https://w3id.org/dpv#hasLaw"
            ] || "-"}
          </Typography>
        </Box>
      ) : (
        <Typography variant="body2" color="textSecondary">
          No personal data handling information specified
        </Typography>
      )}
    </Box>
  );

  const DataQualityTab = () => (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Quality measurements using the Data Quality Vocabulary (DQV).
      </Typography>

      {dataset["http://www.w3.org/ns/dqv#hasQualityMeasurement"] ? (
        <Box
          sx={{
            mb: 2,
            p: 2,
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
          }}
        >
          <Typography variant="body2">
            <strong>Measurement:</strong>{" "}
            {dataset["http://www.w3.org/ns/dqv#hasQualityMeasurement"][
              "http://www.w3.org/ns/dqv#isMeasurementOf"
            ]?.["dct:title"] || "-"}
          </Typography>
          <Typography variant="body2">
            <strong>Value:</strong>{" "}
            {dataset["http://www.w3.org/ns/dqv#hasQualityMeasurement"][
              "http://www.w3.org/ns/dqv#value"
            ] || "-"}
          </Typography>
          <Typography variant="body2">
            <strong>Description:</strong>{" "}
            {dataset["http://www.w3.org/ns/dqv#hasQualityMeasurement"][
              "dct:description"
            ] || "-"}
          </Typography>
        </Box>
      ) : (
        <Typography variant="body2" color="textSecondary">
          No quality measurements specified
        </Typography>
      )}
    </Box>
  );

  const ServiceInformationTab = () => (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Technical service information and endpoint details for accessing this
        dataset.
      </Typography>

      {dataset["dcat:service"] ? (
        <>
          {renderMetadataSection([
            {
              label: "Endpoint URL",
              value: dataset["dcat:service"]["dcat:endpointUrl"],
            },
            {
              label: "Service Type",
              value: dataset["dcat:service"]["@type"],
            },
            {
              label: "Terms",
              value: dataset["dcat:service"]["dct:terms"],
            },
            {
              label: "Endpoint Description",
              value: dataset["dcat:service"]["dcat:endpointDescription"],
            },
          ])}
        </>
      ) : (
        <Typography variant="body2" color="textSecondary">
          No service information available
        </Typography>
      )}

      {/* Distribution Information */}
      {dataset["dcat:distribution"] &&
      Array.isArray(dataset["dcat:distribution"]) &&
      dataset["dcat:distribution"].length > 0 ? (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
            Distributions
          </Typography>
          {dataset["dcat:distribution"].map(
            (distribution: any, index: number) => (
              <Box
                key={index}
                sx={{
                  mb: 2,
                  p: 2,
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 1,
                }}
              >
                <Typography variant="body2">
                  <strong>Distribution {index + 1}</strong>
                </Typography>
                {distribution["@id"] && (
                  <Typography variant="body2">
                    <strong>ID:</strong> {distribution["@id"]}
                  </Typography>
                )}
                {distribution["dcat:mediaType"] && (
                  <Typography variant="body2">
                    <strong>Media Type:</strong>{" "}
                    {distribution["dcat:mediaType"]}
                  </Typography>
                )}
                {distribution["dcat:accessURL"] && (
                  <Typography variant="body2">
                    <strong>Access URL:</strong>{" "}
                    {distribution["dcat:accessURL"]}
                  </Typography>
                )}
              </Box>
            )
          )}
        </Box>
      ) : (
        <Typography variant="body2" color="textSecondary" sx={{ mt: 3 }}>
          No distribution information available
        </Typography>
      )}
    </Box>
  );

  const PolicySelection = () => {
    if (!policies.length) {
      return (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <PolicyIcon sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No Policies Available
          </Typography>
          <Typography color="textSecondary">
            This dataset has no policies available for negotiation.
          </Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ width: "100%", minWidth: 0 }}>
        <FormControl component="fieldset" fullWidth sx={{ minWidth: 0 }}>
          <FormLabel component="legend" sx={{ mb: 2 }}>
            Select a Policy for Contract Negotiation
          </FormLabel>
          <RadioGroup
            value={selectedPolicy}
            onChange={(e) => setSelectedPolicy(parseInt(e.target.value))}
            sx={{ width: "100%", minWidth: 0 }}
          >
            {policies.map((policy: any, index: number) => (
              <FormControlLabel
                key={policy["@id"] || index}
                value={index}
                control={<Radio />}
                label={
                  <Box sx={{ width: "100%" }} title={policy["@id"]}>
                    <Typography variant="body1" fontWeight="medium">
                      Policy {index + 1}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {policy["odrl:permission"] &&
                      policy["odrl:permission"].length > 0
                        ? `${policy["odrl:permission"].length} permission rule(s)`
                        : "No permissions defined"}
                    </Typography>
                  </Box>
                }
                sx={{
                  alignItems: "flex-start",
                  "& .MuiFormControlLabel-label": { width: "100%" },
                  border: "1px solid",
                  borderColor:
                    selectedPolicy === index ? "primary.main" : "divider",
                  borderRadius: 1,
                  m: 1,
                  p: 1,
                }}
              />
            ))}
          </RadioGroup>
        </FormControl>

        {policies[selectedPolicy] && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Policy Details
            </Typography>
            <PermissionAccordion record={policies[selectedPolicy]} />
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      sx={isMobile ? {} : { "& .MuiDialog-paper": { minHeight: "70vh" } }}
    >
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <InfoIcon />
          <Typography variant="h6" component="div">
            Dataset Details & Negotiation
          </Typography>
        </Box>
      </DialogTitle>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="dataset tabs"
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons="auto"
        >
          <Tab icon={<InfoIcon />} label="Overview" />
          <Tab icon={<HistoryIcon />} label="Versioning" />
          <Tab icon={<AccountTreeIcon />} label="Provenance" />
          <Tab icon={<SecurityIcon />} label="Data Privacy" />
          <Tab icon={<AssessmentIcon />} label="Data Quality" />
          <Tab icon={<CloudIcon />} label="Service Info" />
        </Tabs>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 3 }}>
          {activeTab === 0 && <OverviewTab />}
          {activeTab === 1 && <VersioningTab />}
          {activeTab === 2 && <ProvenanceTab />}
          {activeTab === 3 && <DataPrivacyTab />}
          {activeTab === 4 && <DataQualityTab />}
          {activeTab === 5 && <ServiceInformationTab />}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        {policies.length > 0 && activeTab === 0 && (
          <Button
            component={Link}
            to={{
              pathname: "/contractnegotiations/create",
            }}
            state={{
              record: {
                policy: {
                  "@type": policies[selectedPolicy]["@type"],
                  "@id": policies[selectedPolicy]["@id"],
                  assigner: participantId,
                  obligation: policies[selectedPolicy]?.["odrl:obligation"],
                  permission: policies[selectedPolicy]?.["odrl:permission"],
                  prohibition: policies[selectedPolicy]?.["odrl:prohibition"],
                  target: datasetId,
                },
                counterPartyAddress,
              },
            }}
            variant="contained"
            startIcon={<HandshakeIcon />}
            onClick={onClose}
          >
            Start Negotiation
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
