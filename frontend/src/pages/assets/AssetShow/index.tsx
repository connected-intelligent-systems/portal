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
import { Typography, Box, Tabs, Tab, Chip } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import SecurityIcon from "@mui/icons-material/Security";
import AssessmentIcon from "@mui/icons-material/Assessment";
import CloudIcon from "@mui/icons-material/Cloud";
import { MarkdownField } from "../../../components/markdown";
import {
  Provenance,
  DataPrivacy,
  DataQuality,
  DataAddress,
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

              {/* Basic Information Section */}
              <Box sx={{ mt: 3 }}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "140px 1fr",
                    gap: 1.5,
                    mb: 2,
                  }}
                >
                  {/* Category */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    {translate(
                      "resources.assets.tabs.basicInformation.category"
                    )}
                  </Typography>
                  <Typography variant="body2">
                    {record?.theme?.title || "-"}
                  </Typography>

                  {/* Media Type */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    {translate(
                      "resources.assets.tabs.basicInformation.mediaType"
                    )}
                  </Typography>
                  <Typography variant="body2">
                    {record?.mediaType || "-"}
                  </Typography>

                  {/* Keywords */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    {translate(
                      "resources.assets.tabs.basicInformation.keywords"
                    )}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {record?.keywords ? (
                      (Array.isArray(record.keywords)
                        ? record.keywords
                        : [record.keywords]
                      ).map((keyword: string, index: number) => (
                        <Chip
                          key={index}
                          label={keyword}
                          color="secondary"
                          variant="outlined"
                          size="small"
                        />
                      ))
                    ) : (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontStyle: "italic" }}
                      >
                        {translate(
                          "resources.assets.tabs.basicInformation.noKeywords"
                        )}
                      </Typography>
                    )}
                  </Box>

                  {/* Version */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    {translate("resources.assets.tabs.versioningTab.version")}
                  </Typography>
                  <Typography variant="body2">
                    {record?.version || "-"}
                  </Typography>

                  {/* Creator */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    {translate("resources.assets.tabs.versioningTab.creator")}
                  </Typography>
                  <Typography variant="body2">
                    {record?.creator?.name || "-"}
                  </Typography>

                  {/* Created */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    {translate("resources.assets.tabs.versioningTab.created")}
                  </Typography>
                  <Typography variant="body2">
                    {record?.created
                      ? new Date(record.created).toLocaleDateString()
                      : "-"}
                  </Typography>

                  {/* Modified */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    {translate("resources.assets.tabs.versioningTab.modified")}
                  </Typography>
                  <Typography variant="body2">
                    {record?.modified
                      ? new Date(record.modified).toLocaleDateString()
                      : "-"}
                  </Typography>
                </Box>

                {/* Short Description */}
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {translate(
                      "resources.assets.tabs.basicInformation.shortDescription"
                    )}
                  </Typography>
                  <Typography variant="body2">
                    {record?.abstract ||
                      translate(
                        "resources.assets.tabs.basicInformation.noShortDescription"
                      )}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        />

        <Box sx={{ mt: 3 }}>
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
            </Tabs>
          </Box>

          <Box sx={{ mt: 3 }}>
            {activeTab === 0 && (
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

            {activeTab === 1 && (
              <div id="asset-provenance">
                <Provenance />
              </div>
            )}

            {activeTab === 2 && (
              <div id="asset-privacy">
                <DataPrivacy />
              </div>
            )}

            {activeTab === 3 && (
              <div id="asset-quality">
                <DataQuality />
              </div>
            )}

            {activeTab === 4 && (
              <div id="asset-address">
                <DataAddress />
              </div>
            )}
          </Box>
        </Box>
      </SimpleShowLayout>
    </Show>
  );
};
