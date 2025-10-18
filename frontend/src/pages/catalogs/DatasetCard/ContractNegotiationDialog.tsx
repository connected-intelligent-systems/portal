import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  FormControl,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  CircularProgress,
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
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
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
  const dataProvider = useDataProvider();
  const [activeTab, setActiveTab] = useState(0);
  const [step, setStep] = useState<"view" | "policySelection">("view");
  const [selectedPolicy, setSelectedPolicy] = useState(0);
  const [confirmMenuAnchor, setConfirmMenuAnchor] =
    useState<null | HTMLElement>(null);
  const [isWaitingForFinalization, setIsWaitingForFinalization] =
    useState(false);
  const [pendingNegotiationId, setPendingNegotiationId] = useState<
    string | null
  >(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const translate = useTranslate();
  const pollingIntervalRef = useRef<number | null>(null);
  const pollingAttemptsRef = useRef(0);

  const policies = useMemo(() => dataset?.policies ?? [], [dataset?.policies]);
  const datasetId = dataset?.id;
  const participantId = dataset?.participantId;

  const POLLING_INTERVAL_MS = 5000;
  const MAX_POLLING_ATTEMPTS = 30;

  const closeConfirmMenu = useCallback(() => {
    setConfirmMenuAnchor(null);
  }, []);

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current !== null) {
      window.clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    pollingAttemptsRef.current = 0;
    setIsWaitingForFinalization(false);
    setPendingNegotiationId(null);
  }, []);

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
              setPendingNegotiationId(negotiationId);
              setIsWaitingForFinalization(true);
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
      translate,
    ]
  );

  useEffect(() => {
    if (!isWaitingForFinalization || !pendingNegotiationId) {
      return;
    }

    pollingAttemptsRef.current = 0;

    const pollNegotiation = async () => {
      try {
        const { data } = await dataProvider.getOne("contractnegotiations", {
          id: pendingNegotiationId,
        });

        pollingAttemptsRef.current += 1;

        if (data?.contractAgreementId) {
          notify(
            translate(
              "resources.contractnegotiations.messages.negotiationFinalized"
            ),
            { type: "success" }
          );
          const agreementId = data.contractAgreementId;
          stopPolling();
          handleClose();
          navigate(`/contractagreements/${agreementId}/show`);
          return;
        }

        if (pollingAttemptsRef.current >= MAX_POLLING_ATTEMPTS) {
          stopPolling();
          notify(
            translate(
              "resources.contractnegotiations.messages.negotiationFinalizationTimeout"
            ),
            { type: "warning" }
          );
          handleClose();
          navigate(`/contractnegotiations/${pendingNegotiationId}/show`);
        }
      } catch (error) {
        // Best effort: stop polling on persistent errors
        console.error("Failed to poll negotiation status", error);
        stopPolling();
        notify(
          translate(
            "resources.contractnegotiations.messages.negotiationPollingFailed"
          ),
          { type: "warning" }
        );
        handleClose();
        navigate(`/contractnegotiations/${pendingNegotiationId}/show`);
      }
    };

    pollNegotiation();
    pollingIntervalRef.current = window.setInterval(
      pollNegotiation,
      POLLING_INTERVAL_MS
    );

    return () => {
      if (pollingIntervalRef.current !== null) {
        window.clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [
    dataProvider,
    handleClose,
    isWaitingForFinalization,
    navigate,
    notify,
    pendingNegotiationId,
    stopPolling,
    translate,
    MAX_POLLING_ATTEMPTS,
    POLLING_INTERVAL_MS,
  ]);

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
