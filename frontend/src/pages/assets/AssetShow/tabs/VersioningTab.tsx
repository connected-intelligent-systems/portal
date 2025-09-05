import { Labeled, FunctionField, useTranslate } from "react-admin";
import { Typography, Box, Link } from "@mui/material";

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

      <Labeled
        fullWidth
        label={translate(
          "resources.assets.tabs.versioningTab.previousVersions"
        )}
      >
        <FunctionField
          render={(record: any) => {
            const versions = record?.hasVersion;
            if (!versions) {
              return translate(
                "resources.assets.tabs.versioningTab.noPreviousVersions"
              );
            }

            // Handle case where single version is returned as object instead of array
            const versionsArray = Array.isArray(versions)
              ? versions
              : [versions];
            if (versionsArray.length === 0) {
              return translate(
                "resources.assets.tabs.versioningTab.noPreviousVersions"
              );
            }

            return (
              <Box sx={{ pl: 2 }}>
                {versionsArray.map((version: any, index: number) => (
                  <Box
                    key={index}
                    sx={{
                      mb: 1.5,
                      pb: 1,
                      borderBottom:
                        index < versionsArray.length - 1
                          ? "1px solid #eee"
                          : "none",
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.25 }}
                    >
                      {translate(
                        "resources.assets.tabs.versioningTab.versionLabel"
                      )}{" "}
                      {version.version || "-"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.25 }}
                    >
                      {translate(
                        "resources.assets.tabs.versioningTab.issuedLabel"
                      )}{" "}
                      {version.releaseDate
                        ? new Date(version.releaseDate).toLocaleDateString()
                        : "-"}
                    </Typography>
                  </Box>
                ))}
              </Box>
            );
          }}
        />
      </Labeled>
    </Box>
  );
};
