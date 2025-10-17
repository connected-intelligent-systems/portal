import { Datagrid, Labeled, TextField, useTranslate } from "react-admin";
import { Typography, Box } from "@mui/material";
import { EnsureArrayField } from "../EnsureArrayField";

export const DataPrivacy = () => {
  const translate = useTranslate();
  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {translate("resources.assets.tabs.dataPrivacyTab.shortDescription")}
      </Typography>

      <Labeled
        fullWidth
        label={translate(
          "resources.assets.tabs.dataPrivacyTab.personalDataHandling"
        )}
      >
        <EnsureArrayField
          source="privacySettings.personalDataHandling"
          emptyText={translate(
            "resources.assets.tabs.dataPrivacyTab.noPersonalDataHandling"
          )}
        >
          <Datagrid
            bulkActionButtons={false}
            rowClick={false}
            size="small"
            hover={false}
            sx={{
              "& .MuiTableCell-root": {
                whiteSpace: "normal",
                wordBreak: "break-word",
              },
            }}
          >
            <TextField
              source="personalData"
              label={translate(
                "resources.assets.tabs.dataPrivacyTab.personalDataType"
              )}
              emptyText="-"
              sortable={false}
            />
            <TextField
              source="purpose"
              label={translate("resources.assets.tabs.dataPrivacyTab.purpose")}
              emptyText="-"
              sortable={false}
            />
            <TextField
              source="legalBasis"
              label={translate(
                "resources.assets.tabs.dataPrivacyTab.legalBasis"
              )}
              emptyText="-"
              sortable={false}
            />
            <TextField
              source="applicableLaw"
              label={translate(
                "resources.assets.tabs.dataPrivacyTab.applicableLaw"
              )}
              emptyText="-"
              sortable={false}
            />
          </Datagrid>
        </EnsureArrayField>
      </Labeled>
    </Box>
  );
};
