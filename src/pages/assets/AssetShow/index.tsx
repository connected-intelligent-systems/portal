import { useState, useMemo } from "react";
import type { SyntheticEvent, ReactNode, ReactElement } from "react";
import {
  Show,
  SimpleShowLayout,
  TopToolbar,
  DeleteButton,
  FunctionField,
  useTranslate,
  EditButton,
  useRecordContext,
  useLocale,
} from "react-admin";
import { Typography, Box, Tabs, Tab } from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";
import InfoIcon from "@mui/icons-material/Info";
import DescriptionIcon from "@mui/icons-material/Description";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import SecurityIcon from "@mui/icons-material/Security";
import AssessmentIcon from "@mui/icons-material/Assessment";
import CloudIcon from "@mui/icons-material/Cloud";
import DevicesIcon from "@mui/icons-material/Devices";
import { MarkdownField } from "../../../components/markdown";
import {
  Raw,
  BasicInformation,
  Provenance,
  DataPrivacy,
  DataQuality,
  DataAddress,
  ThingDescription,
} from "../../../components/assets";
import { getTitleValue } from "../../../utils/multiLanguageUtils";

const AssetShowBar = () => {
  return (
    <TopToolbar>
      <DeleteButton mutationMode="pessimistic" />
      <EditButton />
    </TopToolbar>
  );
};

const hasRaw = (record: any) => {
  return !!record?.raw;
};

const hasBasicInformation = (record: any) => {
  return !!(
    record?.theme?.title ||
    record?.mediaType ||
    (record?.keywords && record.keywords.length > 0) ||
    record?.version ||
    record?.creator?.name ||
    record?.created ||
    record?.modified ||
    record?.abstract
  );
};

const hasDescription = (record: any) => {
  return !!record?.description;
};

const hasProvenance = (record: any) => {
  return !!(
    record?.provenance?.derivedFromId ||
    record?.provenance?.generatedByDescription ||
    record?.provenance?.attributedToId
  );
};

const hasDataPrivacy = (record: any) => {
  return !!(
    record?.privacySettings?.personalDataHandling &&
    Array.isArray(record.privacySettings.personalDataHandling) &&
    record.privacySettings.personalDataHandling.length > 0
  );
};

const hasDataQuality = (record: any) => {
  return !!(
    record?.qualityMeasurements &&
    Array.isArray(record.qualityMeasurements) &&
    record.qualityMeasurements.length > 0
  );
};

const hasDataAddress = (record: any) => {
  return !!record?.dataAddress?.type;
};

const hasThingDescription = (record: any) => {
  return !!record?.thingDescription;
};

interface TabConfig {
  id: string;
  icon: ReactElement;
  label: string;
  ariaControls: string;
  component: ReactNode;
}

const AssetTabs = () => {
  const [activeTab, setActiveTab] = useState(0);
  const translate = useTranslate();
  const record = useRecordContext();

  const tabs: TabConfig[] = useMemo(() => {
    const allTabs: TabConfig[] = [];

    if (hasBasicInformation(record)) {
      allTabs.push({
        id: "basic-info",
        icon: <InfoIcon />,
        label: translate("resources.assets.tabs.basicInformation.title"),
        ariaControls: "asset-basic-info",
        component: <BasicInformation />,
      });
    }

    if (hasDescription(record)) {
      allTabs.push({
        id: "description",
        icon: <DescriptionIcon />,
        label: translate("resources.assets.tabs.detailedDescription"),
        ariaControls: "asset-description",
        component: (
          <FunctionField
            render={(record: any) => {
              const description = record?.description;
              if (!description) {
                return (
                  <Typography variant="body2" color="text.secondary">
                    {translate("resources.assets.messages.noDescription")}
                  </Typography>
                );
              }
              return (
                <MarkdownField source="description" record={{ description }} />
              );
            }}
          />
        ),
      });
    }

    if (hasProvenance(record)) {
      allTabs.push({
        id: "provenance",
        icon: <AccountTreeIcon />,
        label: translate("resources.assets.tabs.provenance"),
        ariaControls: "asset-provenance",
        component: <Provenance />,
      });
    }

    if (hasDataPrivacy(record)) {
      allTabs.push({
        id: "privacy",
        icon: <SecurityIcon />,
        label: translate("resources.assets.tabs.dataPrivacy"),
        ariaControls: "asset-privacy",
        component: <DataPrivacy />,
      });
    }

    if (hasDataQuality(record)) {
      allTabs.push({
        id: "quality",
        icon: <AssessmentIcon />,
        label: translate("resources.assets.tabs.dataQuality"),
        ariaControls: "asset-quality",
        component: <DataQuality />,
      });
    }

    if (hasDataAddress(record)) {
      allTabs.push({
        id: "address",
        icon: <CloudIcon />,
        label: translate("resources.assets.tabs.dataAddress"),
        ariaControls: "asset-address",
        component: <DataAddress />,
      });
    }

    if (hasThingDescription(record)) {
      allTabs.push({
        id: "thing-description",
        icon: <DevicesIcon />,
        label: translate("resources.assets.tabs.thingDescription"),
        ariaControls: "asset-thing-description",
        component: <ThingDescription />,
      });
    }

    if (hasRaw(record)) {
      allTabs.push({
        id: "raw",
        icon: <CodeIcon />,
        label: "Raw",
        ariaControls: "asset-raw",
        component: <Raw />,
      });
    }

    return allTabs;
  }, [record, translate]);

  const handleTabChange = (_: SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (tabs.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        No additional information available
      </Typography>
    );
  }

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="asset information tabs"
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          {tabs.map((tab) => (
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
        {tabs.map((tab, index) => (
          <div
            key={tab.id}
            id={tab.ariaControls}
            role="tabpanel"
            hidden={activeTab !== index}
          >
            {activeTab === index && tab.component}
          </div>
        ))}
      </Box>
    </Box>
  );
};

export const AssetShow = () => {
  const locale = useLocale();

  return (
    <Show actions={<AssetShowBar />}>
      <SimpleShowLayout>
        <FunctionField
          source="title"
          render={(record: any) => (
            <Box>
              <Typography variant="h4" gutterBottom>
                {getTitleValue(record?.titles, record?.title, locale) ||
                  "Untitled Asset"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ID: {record.id}
              </Typography>
            </Box>
          )}
        />

        <AssetTabs />
      </SimpleShowLayout>
    </Show>
  );
};
