import React, { useState, Suspense } from "react";
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
import { Dataset } from "../../../types/catalog";
import {
  BasicInformation,
  Provenance,
  DataPrivacy,
  DataQuality,
} from "../../../components/assets";
import { ServiceInformation } from "../../../components/datasets";

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
        {/* Title and ID Header */}
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

        {/* Tabs */}
        <Box sx={{ mt: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              aria-label="dataset information tabs"
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
            >
              <Tab
                icon={<InfoIcon />}
                label={translate("resources.catalog.dataset.tabs.overview")}
                aria-controls="dataset-overview-tab"
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

          {/* Tab Content */}
          <Box sx={{ mt: 3 }}>
            <Suspense fallback={<div>Loading...</div>}>
              <RecordContextProvider value={dataset}>
                {activeTab === 0 && <BasicInformation />}
                {activeTab === 1 && <Provenance />}
                {activeTab === 2 && <DataPrivacy />}
                {activeTab === 3 && <DataQuality />}
                {activeTab === 4 && <ServiceInformation dataset={dataset} />}
              </RecordContextProvider>
            </Suspense>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};
