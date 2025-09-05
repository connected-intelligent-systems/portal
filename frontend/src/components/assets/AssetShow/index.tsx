import React, { useState } from "react";
import {
  Show,
  SimpleShowLayout,
  TopToolbar,
  DeleteButton,
  FunctionField,
} from "react-admin";
import { Typography, Box, Tabs, Tab } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import DescriptionIcon from "@mui/icons-material/Description";
import HistoryIcon from "@mui/icons-material/History";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import SecurityIcon from "@mui/icons-material/Security";
import AssessmentIcon from "@mui/icons-material/Assessment";
import CloudIcon from "@mui/icons-material/Cloud";
import { BasicInformationShow } from "./BasicInformationShow";
import { VersioningShow } from "./VersioningShow";
import { ProvenanceShow } from "./ProvenanceShow";
import { DataPrivacyShow } from "./DataPrivacyShow";
import { DataQualityShow } from "./DataQualityShow";
import { DataAddressShow } from "./DataAddressShow";
import { MarkdownField } from "../../markdown";

const AssetShowBar = () => {
  return (
    <TopToolbar>
      <DeleteButton mutationMode="pessimistic" />
    </TopToolbar>
  );
};

export const AssetShow = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Show actions={<AssetShowBar />}>
      <SimpleShowLayout>
        <FunctionField
          source="properties.http://purl.org/dc/terms/title"
          render={(record: any) => (
            <>
              <Typography variant="h4" gutterBottom>
                {record?.properties?.["http://purl.org/dc/terms/title"] ||
                  "Untitled Asset"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ID: {record.id}
              </Typography>
            </>
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
            >
              <Tab icon={<InfoIcon />} label="Basic Info" />
              <Tab icon={<DescriptionIcon />} label="Detailed Description" />
              <Tab icon={<HistoryIcon />} label="Versioning" />
              <Tab icon={<AccountTreeIcon />} label="Provenance" />
              <Tab icon={<SecurityIcon />} label="Data Privacy" />
              <Tab icon={<AssessmentIcon />} label="Data Quality" />
              <Tab icon={<CloudIcon />} label="Data Address" />
            </Tabs>
          </Box>

          <Box sx={{ mt: 3 }}>
            {activeTab === 0 && <BasicInformationShow />}

            {activeTab === 1 && (
              <FunctionField
                render={(record: any) => {
                  const description =
                    record?.properties?.[
                      "http://purl.org/dc/terms/description"
                    ];
                  if (!description) {
                    return (
                      <Typography variant="body2" color="text.secondary">
                        No detailed description available
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
            )}

            {activeTab === 2 && <VersioningShow />}

            {activeTab === 3 && <ProvenanceShow />}

            {activeTab === 4 && <DataPrivacyShow />}

            {activeTab === 5 && <DataQualityShow />}

            {activeTab === 6 && <DataAddressShow />}
          </Box>
        </Box>
      </SimpleShowLayout>
    </Show>
  );
};
