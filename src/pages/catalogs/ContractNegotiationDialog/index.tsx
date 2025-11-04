import React, { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useTranslate,
  useCreate,
  useNotify,
  useDataProvider,
  RecordContextProvider,
} from "react-admin";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  ButtonGroup,
  Tabs,
  Tab,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import HandshakeIcon from "@mui/icons-material/Handshake";
import InfoIcon from "@mui/icons-material/Info";
import HistoryIcon from "@mui/icons-material/History";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import SecurityIcon from "@mui/icons-material/Security";
import AssessmentIcon from "@mui/icons-material/Assessment";
import CloudIcon from "@mui/icons-material/Cloud";
import DevicesIcon from "@mui/icons-material/Devices";
import CodeIcon from "@mui/icons-material/Code";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Dataset } from "../../../types/catalog";
import {
  Raw,
  BasicInformation,
  Provenance,
  DataPrivacy,
  DataQuality,
  Versioning,
  ThingDescription,
} from "../../../components/assets";
import { ServiceInformation } from "../../../components/datasets";
import { PolicySelectionView } from "./PolicySelectionView";
import { useNegotiationPolling } from "./useNegotiationPolling";

interface ContractNegotiationDialogProps {
  dataset: Dataset;
  open: boolean;
  counterPartyAddress?: string;
  onClose: () => void;
}

type DialogStep = "view" | "policySelection";

interface DatasetTabDefinition {
  id: string;
  icon: React.ReactElement;
  labelTranslationKey: string;
  ariaControls: string;
  render: (_dataset: Dataset) => React.ReactNode;
}

const hasBasicInformation = (dataset: any) => {
  return !!(
    dataset?.theme?.title ||
    dataset?.mediaType ||
    (dataset?.keywords && dataset.keywords.length > 0) ||
    dataset?.version ||
    dataset?.creator?.name ||
    dataset?.created ||
    dataset?.modified ||
    dataset?.abstract
  );
};

const hasVersioning = (dataset: any) => {
  return !!(
    dataset?.version ||
    dataset?.creator?.name ||
    dataset?.modified ||
    dataset?.created
  );
};

const hasProvenance = (dataset: any) => {
  return !!(
    dataset?.provenance?.derivedFromId ||
    dataset?.provenance?.generatedByDescription ||
    dataset?.provenance?.attributedToId
  );
};

const hasDataPrivacy = (dataset: any) => {
  return !!(
    dataset?.privacySettings?.personalDataHandling &&
    Array.isArray(dataset.privacySettings.personalDataHandling) &&
    dataset.privacySettings.personalDataHandling.length > 0
  );
};

const hasDataQuality = (dataset: any) => {
  return !!(
    dataset?.qualityMeasurements &&
    Array.isArray(dataset.qualityMeasurements) &&
    dataset.qualityMeasurements.length > 0
  );
};

const hasThingDescription = (dataset: any) => {
  return !!dataset?.thingDescription;
};

const hasServiceInformation = (dataset: any) => {
  return !!(
    dataset?.distributions &&
    Array.isArray(dataset.distributions) &&
    dataset.distributions.length > 0
  );
};

const hasRaw = (dataset: any) => {
  return !!dataset?.raw;
};

const ALL_DATASET_TABS: DatasetTabDefinition[] = [
  {
    id: "overview",
    icon: <InfoIcon />,
    labelTranslationKey: "resources.catalog.dataset.tabs.overview",
    ariaControls: "dataset-overview-tab",
    render: (dataset) => (
      <RecordContextProvider value={dataset}>
        <BasicInformation />
      </RecordContextProvider>
    ),
  },
  {
    id: "versioning",
    icon: <HistoryIcon />,
    labelTranslationKey: "resources.catalog.dataset.tabs.versioning",
    ariaControls: "dataset-versioning-tab",
    render: (dataset) => (
      <RecordContextProvider value={dataset}>
        <Versioning />
      </RecordContextProvider>
    ),
  },
  {
    id: "provenance",
    icon: <AccountTreeIcon />,
    labelTranslationKey: "resources.catalog.dataset.tabs.provenance",
    ariaControls: "dataset-provenance-tab",
    render: (dataset) => (
      <RecordContextProvider value={dataset}>
        <Provenance />
      </RecordContextProvider>
    ),
  },
  {
    id: "privacy",
    icon: <SecurityIcon />,
    labelTranslationKey: "resources.catalog.dataset.tabs.dataPrivacy",
    ariaControls: "dataset-privacy-tab",
    render: (dataset) => (
      <RecordContextProvider value={dataset}>
        <DataPrivacy />
      </RecordContextProvider>
    ),
  },
  {
    id: "quality",
    icon: <AssessmentIcon />,
    labelTranslationKey: "resources.catalog.dataset.tabs.dataQuality",
    ariaControls: "dataset-quality-tab",
    render: (dataset) => (
      <RecordContextProvider value={dataset}>
        <DataQuality />
      </RecordContextProvider>
    ),
  },
  {
    id: "thing-description",
    icon: <DevicesIcon />,
    labelTranslationKey: "resources.assets.tabs.thingDescription",
    ariaControls: "dataset-thing-description-tab",
    render: (dataset) => (
      <RecordContextProvider value={dataset}>
        <ThingDescription />
      </RecordContextProvider>
    ),
  },
  {
    id: "service-info",
    icon: <CloudIcon />,
    labelTranslationKey: "resources.catalog.dataset.tabs.serviceInfo",
    ariaControls: "dataset-service-tab",
    render: (dataset) => <ServiceInformation dataset={dataset} />,
  },
  {
    id: "raw",
    icon: <CodeIcon />,
    labelTranslationKey: "resources.catalog.dataset.tabs.raw",
    ariaControls: "dataset-raw-tab",
    render: (dataset) => (
      <RecordContextProvider value={dataset}>
        <Raw />
      </RecordContextProvider>
    ),
  },
];

export const ContractNegotiationDialog: React.FC<
  ContractNegotiationDialogProps
> = ({ dataset, open, onClose, counterPartyAddress }) => {
  const navigate = useNavigate();
  const notify = useNotify();
  const [create, { isPending: isCreating }] = useCreate();
  const dataProvider = useDataProvider();
  const [activeTab, setActiveTab] = useState(0);
  const [step, setStep] = useState<DialogStep>("view");
  const [selectedPolicy, setSelectedPolicy] = useState(0);
  const [confirmMenuAnchor, setConfirmMenuAnchor] =
    useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const translate = useTranslate();

  const policies = useMemo(() => dataset?.policies ?? [], [dataset?.policies]);
  const datasetId = dataset?.id;
  const participantId = dataset?.participantId;

  const visibleTabs = useMemo(() => {
    const tabs: DatasetTabDefinition[] = [];

    ALL_DATASET_TABS.forEach((tab) => {
      let shouldShow = false;

      switch (tab.id) {
        case "overview":
          shouldShow = hasBasicInformation(dataset);
          break;
        case "versioning":
          shouldShow = hasVersioning(dataset);
          break;
        case "provenance":
          shouldShow = hasProvenance(dataset);
          break;
        case "privacy":
          shouldShow = hasDataPrivacy(dataset);
          break;
        case "quality":
          shouldShow = hasDataQuality(dataset);
          break;
        case "thing-description":
          shouldShow = hasThingDescription(dataset);
          break;
        case "service-info":
          shouldShow = hasServiceInformation(dataset);
          break;
        case "raw":
          shouldShow = hasRaw(dataset);
          break;
        default:
          shouldShow = true;
      }

      if (shouldShow) {
        tabs.push(tab);
      }
    });

    return tabs;
  }, [dataset]);

  const closeConfirmMenu = useCallback(() => {
    setConfirmMenuAnchor(null);
  }, []);

  const {
    isPolling: isWaitingForFinalization,
    startPolling,
    stopPolling,
  } = useNegotiationPolling({
    dataProvider,
    onFinalized: (agreementId) => {
      notify(
        translate(
          "resources.contractnegotiations.messages.negotiationFinalized"
        ),
        { type: "success" }
      );
      handleClose();
      navigate(`/contractagreements/${agreementId}/show`);
    },
    onTimeout: (negotiationId) => {
      notify(
        translate(
          "resources.contractnegotiations.messages.negotiationFinalizationTimeout"
        ),
        { type: "warning" }
      );
      handleClose();
      navigate(`/contractnegotiations/${negotiationId}/show`);
    },
    onError: (negotiationId) => {
      notify(
        translate(
          "resources.contractnegotiations.messages.negotiationPollingFailed"
        ),
        { type: "warning" }
      );
      handleClose();
      if (negotiationId) {
        navigate(`/contractnegotiations/${negotiationId}/show`);
      }
    },
  });

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

  const handleClose = useCallback(() => {
    stopPolling();
    setStep("view");
    setSelectedPolicy(0);
    closeConfirmMenu();
    onClose();
  }, [closeConfirmMenu, onClose, stopPolling]);

  const handleConfirmNegotiation = useCallback(
    (waitForFinalization: boolean) => {
      if (isCreating || isWaitingForFinalization) {
        return;
      }

      const policy = policies[selectedPolicy];
      if (!policy) {
        return;
      }

      const negotiationData = {
        policy: {
          type: policy?.type,
          id: policy?.id,
          assigner: participantId,
          obligations: policy?.obligations,
          permissions: policy?.permissions,
          prohibitions: policy?.prohibitions,
          target: datasetId,
        },
        counterPartyAddress,
        protocol: "dataspace-protocol-http",
      };

      closeConfirmMenu();

      create(
        "contractnegotiations",
        { data: negotiationData },
        {
          onSuccess: (data) => {
            const negotiationId = data?.id;

            if (waitForFinalization && negotiationId) {
              notify(
                translate(
                  "resources.contractnegotiations.messages.negotiationMonitoring"
                ),
                { type: "info" }
              );
              startPolling(negotiationId);
              return;
            }

            notify(
              translate(
                "resources.contractnegotiations.messages.negotiationStarted"
              ),
              { type: "success" }
            );
            handleClose();
            if (negotiationId) {
              navigate(`/contractnegotiations/${negotiationId}/show`);
            }
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
    },
    [
      closeConfirmMenu,
      create,
      counterPartyAddress,
      datasetId,
      handleClose,
      isCreating,
      isWaitingForFinalization,
      navigate,
      notify,
      participantId,
      policies,
      selectedPolicy,
      startPolling,
      translate,
    ]
  );

  const selectedTab = visibleTabs[activeTab];

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

      {step === "view" && visibleTabs.length > 0 && (
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="dataset information tabs"
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons="auto"
          >
            {visibleTabs.map((tab, index) => (
              <Tab
                key={tab.id}
                icon={tab.icon}
                label={translate(tab.labelTranslationKey)}
                aria-controls={tab.ariaControls}
                id={`dataset-tab-${index}`}
              />
            ))}
          </Tabs>
        </Box>
      )}

      <DialogContent sx={{ p: 0 }} id="dataset-dialog-description">
        <Box sx={{ p: 3 }}>
          {step === "view" ? (
            visibleTabs.length > 0 ? (
              selectedTab?.render(dataset)
            ) : (
              <Typography variant="body2" color="text.secondary">
                No additional information available
              </Typography>
            )
          ) : (
            <PolicySelectionView
              policies={policies}
              selectedPolicy={selectedPolicy}
              onSelectPolicy={setSelectedPolicy}
            />
          )}
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {isWaitingForFinalization ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CircularProgress size={18} />
            <Typography variant="body2" color="text.secondary">
              {translate("resources.catalog.dataset.waitingForNegotiation")}
            </Typography>
          </Box>
        ) : (
          <Box />
        )}
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Button
            onClick={handleClose}
            aria-label={translate("resources.catalog.dataset.aria.closeDialog")}
            disabled={isWaitingForFinalization}
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
            <>
              <ButtonGroup variant="contained">
                <Button
                  startIcon={<HandshakeIcon />}
                  onClick={() => handleConfirmNegotiation(false)}
                  disabled={isCreating || isWaitingForFinalization}
                  aria-label={translate(
                    "resources.catalog.dataset.aria.confirmNegotiation"
                  )}
                >
                  {isCreating && !isWaitingForFinalization
                    ? translate("resources.catalog.dataset.creatingNegotiation")
                    : translate("resources.catalog.dataset.confirmNegotiation")}
                </Button>
                <Button
                  size="small"
                  onClick={(event) => {
                    if (isCreating || isWaitingForFinalization) {
                      return;
                    }
                    setConfirmMenuAnchor(event.currentTarget);
                  }}
                  aria-label={translate(
                    "resources.catalog.dataset.aria.openConfirmMenu"
                  )}
                  disabled={isCreating || isWaitingForFinalization}
                >
                  <ArrowDropDownIcon />
                </Button>
              </ButtonGroup>
              <Menu
                anchorEl={confirmMenuAnchor}
                open={Boolean(confirmMenuAnchor)}
                onClose={closeConfirmMenu}
                keepMounted
              >
                <MenuItem
                  onClick={() => handleConfirmNegotiation(true)}
                  disabled={isCreating || isWaitingForFinalization}
                >
                  {translate(
                    "resources.catalog.dataset.confirmNegotiationAndWait"
                  )}
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};
