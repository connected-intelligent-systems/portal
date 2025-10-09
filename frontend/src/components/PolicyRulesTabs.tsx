import { useState } from "react";
import { useTranslate } from "react-admin";
import { Typography, Box, Tabs, Tab } from "@mui/material";
import {
  Policy as PolicyIcon,
  Security as SecurityIcon,
  Block as BlockIcon,
} from "@mui/icons-material";
import { PermissionRenderer } from "./PermissionComponents";

interface PolicyRulesTabsProps {
  permissions: any[];
  obligations: any[];
  prohibitions: any[];
}

export const PolicyRulesTabs = ({
  permissions,
  obligations,
  prohibitions,
}: PolicyRulesTabsProps) => {
  const translate = useTranslate();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="policy rules tabs"
        >
          <Tab
            label={translate("resources.policies.show.permissions")}
            icon={<SecurityIcon />}
            disabled={permissions.length === 0}
            sx={{
              color: permissions.length === 0 ? "text.disabled" : undefined,
            }}
          />
          <Tab
            label={translate("resources.policies.show.obligations")}
            icon={<PolicyIcon />}
            disabled={obligations.length === 0}
            sx={{
              color: obligations.length === 0 ? "text.disabled" : undefined,
            }}
          />
          <Tab
            label={translate("resources.policies.show.prohibitions")}
            icon={<BlockIcon />}
            disabled={prohibitions.length === 0}
            sx={{
              color: prohibitions.length === 0 ? "text.disabled" : undefined,
            }}
          />
        </Tabs>
      </Box>

      <Box sx={{ mt: 2 }}>
        {activeTab === 0 && (
          <Box>
            {permissions.length === 0 ? (
              <Box sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  {translate("resources.policies.show.noPermissions")}
                </Typography>
              </Box>
            ) : (
              <Box>
                {permissions.map((permission: any, index: number) => (
                  <PermissionRenderer key={index} permission={permission} />
                ))}
              </Box>
            )}
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            {obligations.length === 0 ? (
              <Box sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  {translate("resources.policies.show.noObligations")}
                </Typography>
              </Box>
            ) : (
              <Box>
                {obligations.map((obligation: any, index: number) => (
                  <PermissionRenderer key={index} permission={obligation} />
                ))}
              </Box>
            )}
          </Box>
        )}

        {activeTab === 2 && (
          <Box>
            {prohibitions.length === 0 ? (
              <Box sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  {translate("resources.policies.show.noProhibitions")}
                </Typography>
              </Box>
            ) : (
              <Box>
                {prohibitions.map((prohibition: any, index: number) => (
                  <PermissionRenderer key={index} permission={prohibition} />
                ))}
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};
