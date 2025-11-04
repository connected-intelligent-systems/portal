import { useState } from "react";
import type { SyntheticEvent } from "react";
import {
  Show,
  SimpleShowLayout,
  TopToolbar,
  DeleteButton,
  FunctionField,
  useTranslate,
  EditButton,
} from "react-admin";
import { Typography, Box, Tabs, Tab } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import DescriptionIcon from "@mui/icons-material/Description";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import SecurityIcon from "@mui/icons-material/Security";
import AssessmentIcon from "@mui/icons-material/Assessment";
import CloudIcon from "@mui/icons-material/Cloud";
import DevicesIcon from "@mui/icons-material/Devices";
import { MarkdownField } from "../../../components/markdown";
import {
  BasicInformation,
  Provenance,
  DataPrivacy,
  DataQuality,
  DataAddress,
  ThingDescription,
} from "../../../components/assets";

const AssetShowBar = () => {
  return (
    <TopToolbar>
      <DeleteButton mutationMode="pessimistic" />
      <EditButton />
    </TopToolbar>
  );
};

export const AssetShow = () => {
  const [activeTab, setActiveTab] = useState(0);
  const translate = useTranslate();

  const handleTabChange = (_: SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Show actions={<AssetShowBar />}>
      <SimpleShowLayout>
        <FunctionField
          source="title"
          render={(record: any) => (
            <Box>
              <Typography variant="h4" gutterBottom>
                {record?.title || "Untitled Asset"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ID: {record.id}
              </Typography>
            </Box>
          )}
        />

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
              <Tab
                icon={<InfoIcon />}
                label={translate(
                  "resources.assets.tabs.basicInformation.title"
                )}
                aria-controls="asset-basic-info"
              />
              <Tab
                icon={<DescriptionIcon />}
                label={translate("resources.assets.tabs.detailedDescription")}
                aria-controls="asset-description"
              />
              <Tab
                icon={<AccountTreeIcon />}
                label={translate("resources.assets.tabs.provenance")}
                aria-controls="asset-provenance"
              />
              <Tab
                icon={<SecurityIcon />}
                label={translate("resources.assets.tabs.dataPrivacy")}
                aria-controls="asset-privacy"
              />
              <Tab
                icon={<AssessmentIcon />}
                label={translate("resources.assets.tabs.dataQuality")}
                aria-controls="asset-quality"
              />
              <Tab
                icon={<CloudIcon />}
                label={translate("resources.assets.tabs.dataAddress")}
                aria-controls="asset-address"
              />
              <Tab
                icon={<DevicesIcon />}
                label={translate("resources.assets.tabs.thingDescription")}
                aria-controls="asset-thing-description"
              />
            </Tabs>
          </Box>

          <Box sx={{ mt: 3 }}>
            {activeTab === 0 && (
              <div id="asset-basic-info">
                <BasicInformation />
              </div>
            )}

            {activeTab === 1 && (
              <div id="asset-description">
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
                      <MarkdownField
                        source="description"
                        record={{ description }}
                      />
                    );
                  }}
                />
              </div>
            )}

            {activeTab === 2 && (
              <div id="asset-provenance">
                <Provenance />
              </div>
            )}

            {activeTab === 3 && (
              <div id="asset-privacy">
                <DataPrivacy />
              </div>
            )}

            {activeTab === 4 && (
              <div id="asset-quality">
                <DataQuality />
              </div>
            )}

            {activeTab === 5 && (
              <div id="asset-address">
                <DataAddress />
              </div>
            )}

            {activeTab === 6 && (
              <div id="asset-thing-description">
                <ThingDescription />
              </div>
            )}
          </Box>
        </Box>
      </SimpleShowLayout>
    </Show>
  );
};
