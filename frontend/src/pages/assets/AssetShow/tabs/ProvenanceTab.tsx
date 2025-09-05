import { Labeled, FunctionField, useTranslate } from "react-admin";
import { Typography, Box, Link } from "@mui/material";

export const ProvenanceTab = () => {
  const translate = useTranslate();

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Information about the origin and history of this asset.
      </Typography>

      <Labeled
        fullWidth
        label={translate("resources.assets.tabs.provenanceTab.wasDerivedFrom")}
      >
        <FunctionField
          render={(record: any) =>
            record?.provenance?.derivedFromId ||
            translate("resources.assets.tabs.provenanceTab.noSourceEntity")
          }
        />
      </Labeled>

      <Labeled
        fullWidth
        label={translate("resources.assets.tabs.provenanceTab.wasGeneratedBy")}
      >
        <FunctionField
          render={(record: any) =>
            record?.provenance?.generatedByDescription ||
            translate(
              "resources.assets.tabs.provenanceTab.noActivityDescription"
            )
          }
        />
      </Labeled>

      <Labeled
        fullWidth
        label={translate("resources.assets.tabs.provenanceTab.wasAttributedTo")}
      >
        <FunctionField
          render={(record: any) =>
            record?.provenance?.attributedToId ||
            translate("resources.assets.tabs.provenanceTab.noAgent")
          }
        />
      </Labeled>
    </Box>
  );
};
