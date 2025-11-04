import React, { useState, Suspense, useMemo } from "react";
import type { ReactElement, ReactNode } from "react";
import {
  useTranslate,
  RecordContextProvider,
  Loading,
  useGetOne,
} from "react-admin";
import { useParams } from "react-router-dom";
import { Typography, Box, Tabs, Tab, Container, Paper } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import SecurityIcon from "@mui/icons-material/Security";
import AssessmentIcon from "@mui/icons-material/Assessment";
import CloudIcon from "@mui/icons-material/Cloud";
import DevicesIcon from "@mui/icons-material/Devices";
import { Dataset } from "../../../types/catalog";
import {
  BasicInformation,
  Provenance,
  DataPrivacy,
  DataQuality,
  ThingDescription,
} from "../../../components/assets";
import { ServiceInformation } from "../../../components/datasets";

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

const hasServiceInformation = (dataset: any) => {
  return !!(
    dataset?.distributions &&
    Array.isArray(dataset.distributions) &&
    dataset.distributions.length > 0
  );
};

const hasThingDescription = (dataset: any) => {
  return !!dataset?.thingDescription;
};

interface TabConfig {
  id: string;
  icon: ReactElement;
  label: string;
  ariaControls: string;
  component: ReactNode;
}

export const DatasetShow = () => {
  const [activeTab, setActiveTab] = useState(0);
  const translate = useTranslate();
  const { catalogId, datasetId } = useParams<{
    catalogId: string;
    datasetId: string;
  }>();

  // Construct composite ID for data provider
  const compositeId =
    catalogId && datasetId ? `${catalogId}--${datasetId}` : "";

  // Use react-admin's data fetching pattern
  const {
    data: dataset,
    isPending,
    error,
  } = useGetOne<Dataset>(
    "datasets",
    { id: compositeId },
    { enabled: !!compositeId }
  );

  const visibleTabs = useMemo(() => {
    if (!dataset) return [];

    const allTabs: TabConfig[] = [];

    if (hasBasicInformation(dataset)) {
      allTabs.push({
        id: "overview",
        icon: <InfoIcon />,
        label: translate("resources.catalog.dataset.tabs.overview"),
        ariaControls: "dataset-overview-tab",
        component: <BasicInformation />,
      });
    }

    if (hasProvenance(dataset)) {
      allTabs.push({
        id: "provenance",
        icon: <AccountTreeIcon />,
        label: translate("resources.catalog.dataset.tabs.provenance"),
        ariaControls: "dataset-provenance-tab",
        component: <Provenance />,
      });
    }

    if (hasDataPrivacy(dataset)) {
      allTabs.push({
        id: "privacy",
        icon: <SecurityIcon />,
        label: translate("resources.catalog.dataset.tabs.dataPrivacy"),
        ariaControls: "dataset-privacy-tab",
        component: <DataPrivacy />,
      });
    }

    if (hasDataQuality(dataset)) {
      allTabs.push({
        id: "quality",
        icon: <AssessmentIcon />,
        label: translate("resources.catalog.dataset.tabs.dataQuality"),
        ariaControls: "dataset-quality-tab",
        component: <DataQuality />,
      });
    }

    if (hasServiceInformation(dataset)) {
      allTabs.push({
        id: "service-info",
        icon: <CloudIcon />,
        label: translate("resources.catalog.dataset.tabs.serviceInfo"),
        ariaControls: "dataset-service-tab",
        component: <ServiceInformation dataset={dataset} />,
      });
    }

    if (hasThingDescription(dataset)) {
      allTabs.push({
        id: "thing-description",
        icon: <DevicesIcon />,
        label: translate("resources.assets.tabs.thingDescription"),
        ariaControls: "dataset-thing-description",
        component: <ThingDescription />,
      });
    }

    return allTabs;
  }, [dataset, translate]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (isPending) {
    return <Loading />;
  }

  if (error || !dataset) {
    return (
      <Container>
        <Typography variant="h6" color="error">
          {error ? `Error: ${error.message}` : "Dataset not found"}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Paper sx={{ p: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            {dataset?.title ||
              dataset?.name ||
              translate("resources.datasets.unnamedDataset")}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ID: {dataset?.originalId || dataset?.id}
          </Typography>
          {dataset?.catalogUrl && (
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              Catalog: {dataset.catalogUrl}
            </Typography>
          )}
        </Box>

        <Box sx={{ mt: 3 }}>
          {visibleTabs.length > 0 ? (
            <>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  aria-label="dataset information tabs"
                  variant="scrollable"
                  scrollButtons="auto"
                  allowScrollButtonsMobile
                >
                  {visibleTabs.map((tab) => (
                    <Tab
                      key={tab.id}
                      icon={tab.icon}
                      label={tab.label}
                      aria-controls={tab.ariaControls}
                    />
                  ))}
                </Tabs>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Suspense fallback={<div>Loading...</div>}>
                  <RecordContextProvider value={dataset}>
                    {visibleTabs.map((tab, index) => (
                      <div
                        key={tab.id}
                        id={tab.ariaControls}
                        role="tabpanel"
                        hidden={activeTab !== index}
                      >
                        {activeTab === index && tab.component}
                      </div>
                    ))}
                  </RecordContextProvider>
                </Suspense>
              </Box>
            </>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              No additional information available
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
};
