import { useState, type ReactNode, type SyntheticEvent } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { useTranslate } from "react-admin";
import {
  VersioningTab,
  DetailedDescriptionTab,
  ProvenanceTab,
  DataPrivacyTab,
  DataQualityTab,
  ThingDescriptionTab,
} from "../tabs";

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index }: TabPanelProps) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`optional-tabpanel-${index}`}
      aria-labelledby={`optional-tab-${index}`}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

export const OptionalFeaturesStep = () => {
  const [activeTab, setActiveTab] = useState(0);
  const translate = useTranslate();

  const handleTabChange = (_event: SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="optional features tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label={translate("resources.assets.create.tabs.versioning")} />
          <Tab
            label={translate(
              "resources.assets.create.tabs.detailedDescription"
            )}
          />
          <Tab label={translate("resources.assets.create.tabs.provenance")} />
          <Tab label={translate("resources.assets.create.tabs.dataPrivacy")} />
          <Tab label={translate("resources.assets.create.tabs.dataQuality")} />
          <Tab
            label={translate("resources.assets.create.tabs.thingDescription")}
          />
        </Tabs>
      </Box>

      <TabPanel value={activeTab} index={0}>
        <VersioningTab />
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <DetailedDescriptionTab />
      </TabPanel>
      <TabPanel value={activeTab} index={2}>
        <ProvenanceTab />
      </TabPanel>
      <TabPanel value={activeTab} index={3}>
        <DataPrivacyTab />
      </TabPanel>
      <TabPanel value={activeTab} index={4}>
        <DataQualityTab />
      </TabPanel>
      <TabPanel value={activeTab} index={5}>
        <ThingDescriptionTab />
      </TabPanel>
    </Box>
  );
};
