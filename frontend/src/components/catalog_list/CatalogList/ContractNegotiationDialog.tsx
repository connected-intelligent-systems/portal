import React, { useState, Suspense } from "react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import HandshakeIcon from "@mui/icons-material/Handshake";
import InfoIcon from "@mui/icons-material/Info";
import HistoryIcon from "@mui/icons-material/History";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import SecurityIcon from "@mui/icons-material/Security";
import AssessmentIcon from "@mui/icons-material/Assessment";
import CloudIcon from "@mui/icons-material/Cloud";
import { ErrorBoundary } from "./ErrorBoundary";
import { LoadingSkeleton } from "./LoadingSkeleton";

// Lazy load tab components
const OverviewTab = React.lazy(() =>
  import("./tabs").then(module => ({ default: module.OverviewTab }))
);
const VersioningTab = React.lazy(() =>
  import("./tabs").then(module => ({ default: module.VersioningTab }))
);
const ProvenanceTab = React.lazy(() =>
  import("./tabs").then(module => ({ default: module.ProvenanceTab }))
);
const DataPrivacyTab = React.lazy(() =>
  import("./tabs").then(module => ({ default: module.DataPrivacyTab }))
);
const DataQualityTab = React.lazy(() =>
  import("./tabs").then(module => ({ default: module.DataQualityTab }))
);
const ServiceInformationTab = React.lazy(() =>
  import("./tabs").then(module => ({ default: module.ServiceInformationTab }))
);

interface ContractNegotiationDialogProps {
  dataset: any;
  open: boolean;
  onClose: () => void;
}

export const ContractNegotiationDialog: React.FC<ContractNegotiationDialogProps> = ({
  dataset,
  open,
  onClose,
}) => {
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

  const handlePolicyChange = (index: number) => {
    setSelectedPolicy(index);
  };

  const renderTabContent = () => {
    const tabProps = { dataset };

    switch (activeTab) {
      case 0:
        return (
          <Suspense fallback={<LoadingSkeleton variant="dialog" />}>
            <OverviewTab
              {...tabProps}
              policies={policies}
              selectedPolicy={selectedPolicy}
              onPolicyChange={handlePolicyChange}
            />
          </Suspense>
        );
      case 1:
        return (
          <Suspense fallback={<LoadingSkeleton variant="dialog" />}>
            <VersioningTab {...tabProps} />
          </Suspense>
        );
      case 2:
        return (
          <Suspense fallback={<LoadingSkeleton variant="dialog" />}>
            <ProvenanceTab {...tabProps} />
          </Suspense>
        );
      case 3:
        return (
          <Suspense fallback={<LoadingSkeleton variant="dialog" />}>
            <DataPrivacyTab {...tabProps} />
          </Suspense>
        );
      case 4:
        return (
          <Suspense fallback={<LoadingSkeleton variant="dialog" />}>
            <DataQualityTab {...tabProps} />
          </Suspense>
        );
      case 5:
        return (
          <Suspense fallback={<LoadingSkeleton variant="dialog" />}>
            <ServiceInformationTab {...tabProps} />
          </Suspense>
        );
      default:
        return null;
    }
  };

  return (
    <ErrorBoundary>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        sx={isMobile ? {} : { "& .MuiDialog-paper": { minHeight: "70vh" } }}
        aria-labelledby="dataset-dialog-title"
        aria-describedby="dataset-dialog-description"
      >
        <DialogTitle id="dataset-dialog-title">
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
            aria-label="dataset information tabs"
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons="auto"
          >
            <Tab icon={<InfoIcon />} label="Overview" aria-controls="dataset-overview-tab" />
            <Tab icon={<HistoryIcon />} label="Versioning" aria-controls="dataset-versioning-tab" />
            <Tab icon={<AccountTreeIcon />} label="Provenance" aria-controls="dataset-provenance-tab" />
            <Tab icon={<SecurityIcon />} label="Data Privacy" aria-controls="dataset-privacy-tab" />
            <Tab icon={<AssessmentIcon />} label="Data Quality" aria-controls="dataset-quality-tab" />
            <Tab icon={<CloudIcon />} label="Service Info" aria-controls="dataset-service-tab" />
          </Tabs>
        </Box>

        <DialogContent sx={{ p: 0 }} id="dataset-dialog-description">
          <Box sx={{ p: 3 }}>
            <ErrorBoundary>
              {renderTabContent()}
            </ErrorBoundary>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} aria-label="Close dialog">
            Close
          </Button>
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
              aria-label="Start contract negotiation"
            >
              Start Negotiation
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </ErrorBoundary>
  );
};
