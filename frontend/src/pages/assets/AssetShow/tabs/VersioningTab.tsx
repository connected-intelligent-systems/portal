import { Labeled, FunctionField, useTranslate } from "react-admin";
import { Typography, Box } from "@mui/material";

export const VersioningTab = () => {
  const translate = useTranslate();

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Version information and creation details for this asset.
      </Typography>

      <Labeled
        fullWidth
        label={translate("resources.assets.tabs.versioningTab.version")}
      >
        <FunctionField render={(record: any) => record?.version || "-"} />
      </Labeled>

      <Labeled
        fullWidth
        label={translate("resources.assets.tabs.versioningTab.creator")}
      >
        <FunctionField render={(record: any) => record?.creator?.name || "-"} />
      </Labeled>

      <Labeled
        fullWidth
        label={translate("resources.assets.tabs.versioningTab.created")}
      >
        <FunctionField
          render={(record: any) => {
            const created = record?.created;
            return created ? new Date(created).toLocaleDateString() : "-";
          }}
        />
      </Labeled>

      <Labeled
        fullWidth
        label={translate("resources.assets.tabs.versioningTab.modified")}
      >
        <FunctionField
          render={(record: any) => {
            const modified = record?.modified;
            return modified ? new Date(modified).toLocaleDateString() : "-";
          }}
        />
      </Labeled>

    </Box>
  );
};
