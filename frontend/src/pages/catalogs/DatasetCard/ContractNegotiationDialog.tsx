import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useTranslate,
  useCreate,
  useNotify,
  RecordContextProvider,
} from "react-admin";
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
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import HandshakeIcon from "@mui/icons-material/Handshake";
import InfoIcon from "@mui/icons-material/Info";
import HistoryIcon from "@mui/icons-material/History";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import SecurityIcon from "@mui/icons-material/Security";
import AssessmentIcon from "@mui/icons-material/Assessment";
import CloudIcon from "@mui/icons-material/Cloud";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Dataset } from "../../../types/catalog";
import {
  BasicInformation,
  Provenance,
  DataPrivacy,
  DataQuality,
  Versioning,
} from "../../../components/assets";
import { ServiceInformation } from "../../../components/datasets";
import { PolicyRulesTabs } from "../../../components/policies/PolicyRulesTabs";

interface ContractNegotiationDialogProps {
  dataset: Dataset;
  open: boolean;
  counterPartyAddress?: string;
  onClose: () => void;
}

interface PolicySelectionViewProps {
  policies: any[];
  selectedPolicy: number;
  onSelectPolicy: (index: number) => void; // eslint-disable-line no-unused-vars, @typescript-eslint/no-unused-vars
}

const PolicySelectionView: React.FC<PolicySelectionViewProps> = ({
  policies,
  selectedPolicy,
  onSelectPolicy,
}) => {
  const translate = useTranslate();

  const options = useMemo(
    () =>
      policies.map((policy: any, policyIndex: number) => {
        const baseLabel = `${translate("resources.catalog.dataset.policy")} ${
          policyIndex + 1
        }`;
        const shortId =
          typeof policy.id === "string" && policy.id.length > 0
            ? `${policy.id.slice(0, 12)}${policy.id.length > 12 ? "…" : ""}`
            : null;
        return {
          index: policyIndex,
          label: shortId ? `${baseLabel} • ${shortId}` : baseLabel,
        };
      }),
    [policies, translate]
  );

  if (!policies.length) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          {translate("resources.catalog.dataset.noPolicies")}
        </Typography>
        <Typography color="textSecondary">
          {translate("resources.catalog.dataset.noPoliciesDescription")}
        </Typography>
      </Box>
    );
  }

  const handleChange = (event: SelectChangeEvent<string>) => {
    onSelectPolicy(Number(event.target.value));
  };

  return (
    <Box sx={{ width: "100%", minWidth: 0 }}>
      <Typography variant="h6" gutterBottom>
        {translate("resources.catalog.dataset.selectPolicyForNegotiation")}
      </Typography>

      <FormControl fullWidth>
        <InputLabel id="policy-selection-label">
          {translate("resources.catalog.dataset.selectPolicyForNegotiation")}
        </InputLabel>
        <Select
          labelId="policy-selection-label"
          id="policy-selection"
          value={String(selectedPolicy)}
          label={translate(
            "resources.catalog.dataset.selectPolicyForNegotiation"
          )}
          onChange={handleChange}
        >
          {options.map((option) => (
            <MenuItem key={option.index} value={String(option.index)}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {policies.map((policy: any, policyIndex: number) =>
        selectedPolicy === policyIndex ? (
          <Box key={policyIndex} sx={{ mt: 3 }}>
            <PolicyRulesTabs
              permissions={policy.permissions}
              obligations={policy.obligations}
              prohibitions={policy.prohibitions}
            />
          </Box>
        ) : null
      )}
    </Box>
  );
};

export const ContractNegotiationDialog: React.FC<
  ContractNegotiationDialogProps
> = ({ dataset, open, onClose, counterPartyAddress }) => {
  const navigate = useNavigate();
  const notify = useNotify();
  const [create, { isPending: isCreating }] = useCreate();
  const [activeTab, setActiveTab] = useState(0);
  const [step, setStep] = useState<"view" | "policySelection">("view");
  const [selectedPolicy, setSelectedPolicy] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const translate = useTranslate();

  const policies = dataset?.policies || [];
  const datasetId = dataset?.id;
  const participantId = dataset?.participantId;

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleStartNegotiation = () => {
    if (policies.length === 0) return;
    setStep("policySelection");
  };

  const handleBackToView = () => {
    setStep("view");
  };

  const handleConfirmNegotiation = () => {
    const negotiationData = {
      policy: {
        type: policies[selectedPolicy]?.type,
        id: policies[selectedPolicy]?.id,
        assigner: participantId,
        obligations: policies[selectedPolicy]?.obligations,
        permissions: policies[selectedPolicy]?.permissions,
        prohibitions: policies[selectedPolicy]?.prohibitions,
        target: datasetId,
      },
      counterPartyAddress,
      protocol: "dataspace-protocol-http",
    };

    create(
      "contractnegotiations",
      { data: negotiationData },
      {
        onSuccess: (data) => {
          notify(
            translate(
              "resources.contractnegotiations.messages.negotiationStarted"
            ),
            { type: "success" }
          );
          handleClose();
          navigate(`/contractnegotiations/${data.id}/show`);
        },
        onError: (error: any) => {
          notify(
            error?.message ||
              translate(
                "resources.contractnegotiations.messages.negotiationFailed"
              ),
            { type: "error" }
          );
        },
      }
    );
  };

  const handleClose = () => {
    setStep("view");
    setSelectedPolicy(0);
    onClose();
  };

  const renderTabContent = () => {
    const tabProps = { dataset };

    switch (activeTab) {
      case 0:
        return (
          <RecordContextProvider value={dataset}>
            <BasicInformation />
          </RecordContextProvider>
        );
      case 1:
        return (
          <RecordContextProvider value={dataset}>
            <Versioning />
          </RecordContextProvider>
        );
      case 2:
        return (
          <RecordContextProvider value={dataset}>
            <Provenance />
          </RecordContextProvider>
        );
      case 3:
        return (
          <RecordContextProvider value={dataset}>
            <DataPrivacy />
          </RecordContextProvider>
        );
      case 4:
        return (
          <RecordContextProvider value={dataset}>
            <DataQuality />
          </RecordContextProvider>
        );
      case 5:
        return <ServiceInformation {...tabProps} />;
      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      sx={isMobile ? {} : { "& .MuiDialog-paper": { minHeight: "70vh" } }}
      aria-labelledby="dataset-dialog-title"
      aria-describedby="dataset-dialog-description"
    >
      <DialogTitle id="dataset-dialog-title">
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {step === "policySelection" && (
            <ArrowBackIcon
              sx={{ cursor: "pointer" }}
              onClick={handleBackToView}
            />
          )}
          <InfoIcon />
          <Typography variant="h6" component="div">
            {step === "view"
              ? translate(
                  "resources.catalog.dataset.datasetDetailsAndNegotiation"
                )
              : translate("resources.catalog.dataset.selectPolicy")}
          </Typography>
        </Box>
      </DialogTitle>

      {step === "view" && (
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="dataset information tabs"
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons="auto"
          >
            <Tab
              icon={<InfoIcon />}
              label={translate("resources.catalog.dataset.tabs.overview")}
              aria-controls="dataset-overview-tab"
            />
            <Tab
              icon={<HistoryIcon />}
              label={translate("resources.catalog.dataset.tabs.versioning")}
              aria-controls="dataset-versioning-tab"
            />
            <Tab
              icon={<AccountTreeIcon />}
              label={translate("resources.catalog.dataset.tabs.provenance")}
              aria-controls="dataset-provenance-tab"
            />
            <Tab
              icon={<SecurityIcon />}
              label={translate("resources.catalog.dataset.tabs.dataPrivacy")}
              aria-controls="dataset-privacy-tab"
            />
            <Tab
              icon={<AssessmentIcon />}
              label={translate("resources.catalog.dataset.tabs.dataQuality")}
              aria-controls="dataset-quality-tab"
            />
            <Tab
              icon={<CloudIcon />}
              label={translate("resources.catalog.dataset.tabs.serviceInfo")}
              aria-controls="dataset-service-tab"
            />
          </Tabs>
        </Box>
      )}

      <DialogContent sx={{ p: 0 }} id="dataset-dialog-description">
        <Box sx={{ p: 3 }}>
          {step === "view" ? (
            renderTabContent()
          ) : (
            <PolicySelectionView
              policies={policies}
              selectedPolicy={selectedPolicy}
              onSelectPolicy={setSelectedPolicy}
            />
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleClose}
          aria-label={translate("resources.catalog.dataset.aria.closeDialog")}
        >
          {translate("resources.catalog.dataset.close")}
        </Button>
        {step === "view" && policies.length > 0 && (
          <Button
            variant="contained"
            startIcon={<HandshakeIcon />}
            onClick={handleStartNegotiation}
            aria-label={translate(
              "resources.catalog.dataset.aria.startNegotiation"
            )}
          >
            {translate("resources.catalog.dataset.startNegotiation")}
          </Button>
        )}
        {step === "policySelection" && (
          <Button
            variant="contained"
            startIcon={<HandshakeIcon />}
            onClick={handleConfirmNegotiation}
            disabled={isCreating}
            aria-label={translate(
              "resources.catalog.dataset.aria.confirmNegotiation"
            )}
          >
            {isCreating
              ? translate("resources.catalog.dataset.creatingNegotiation")
              : translate("resources.catalog.dataset.confirmNegotiation")}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
