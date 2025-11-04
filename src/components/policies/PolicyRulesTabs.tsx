import { useState, useMemo } from "react";
import type { SyntheticEvent, ReactElement, ReactNode } from "react";
import { useTranslate } from "react-admin";
import { Typography, Box, Tabs, Tab, useTheme } from "@mui/material";
import {
  Policy as PolicyIcon,
  Security as SecurityIcon,
  Block as BlockIcon,
  Code as CodeIcon,
} from "@mui/icons-material";
import { PermissionRenderer } from "../permissions";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { EditorState } from "@codemirror/state";
import { githubLight, githubDark } from "@uiw/codemirror-theme-github";

interface PolicyRulesTabsProps {
  permissions: any[];
  obligations: any[];
  prohibitions: any[];
  raw?: any;
}

interface TabConfig {
  id: string;
  icon: ReactElement;
  label: string;
  component: ReactNode;
}

export const PolicyRulesTabs = ({
  permissions,
  obligations,
  prohibitions,
  raw,
}: PolicyRulesTabsProps) => {
  const translate = useTranslate();
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  const visibleTabs = useMemo(() => {
    const tabs: TabConfig[] = [];

    if (permissions.length > 0) {
      tabs.push({
        id: "permissions",
        icon: <SecurityIcon />,
        label: translate("resources.policies.show.permissions"),
        component: (
          <Box>
            {permissions.map((permission: any, index: number) => (
              <PermissionRenderer key={index} permission={permission} />
            ))}
          </Box>
        ),
      });
    }

    if (obligations.length > 0) {
      tabs.push({
        id: "obligations",
        icon: <PolicyIcon />,
        label: translate("resources.policies.show.obligations"),
        component: (
          <Box>
            {obligations.map((obligation: any, index: number) => (
              <PermissionRenderer key={index} permission={obligation} />
            ))}
          </Box>
        ),
      });
    }

    if (prohibitions.length > 0) {
      tabs.push({
        id: "prohibitions",
        icon: <BlockIcon />,
        label: translate("resources.policies.show.prohibitions"),
        component: (
          <Box>
            {prohibitions.map((prohibition: any, index: number) => (
              <PermissionRenderer key={index} permission={prohibition} />
            ))}
          </Box>
        ),
      });
    }

    if (raw) {
      tabs.push({
        id: "raw",
        icon: <CodeIcon />,
        label: translate("resources.policies.show.raw"),
        component: (
          <CodeMirror
            value={JSON.stringify(raw, null, 2)}
            extensions={[json(), EditorState.readOnly.of(true)]}
            theme={theme.palette.mode === "dark" ? githubDark : githubLight}
            basicSetup={{
              lineNumbers: true,
              foldGutter: true,
            }}
          />
        ),
      });
    }

    return tabs;
  }, [permissions, obligations, prohibitions, raw, translate, theme]);

  const handleTabChange = (_: SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (visibleTabs.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          {translate("resources.policies.show.noRules")}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="policy rules tabs"
        >
          {visibleTabs.map((tab) => (
            <Tab key={tab.id} label={tab.label} icon={tab.icon} />
          ))}
        </Tabs>
      </Box>

      <Box sx={{ mt: 2 }}>{visibleTabs[activeTab]?.component}</Box>
    </Box>
  );
};
