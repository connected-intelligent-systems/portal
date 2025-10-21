import { Labeled, TextField, useTranslate } from "react-admin";
import { Typography, Box } from "@mui/material";

export const Provenance = () => {
  const translate = useTranslate();

  const provenanceFields = [
    {
      source: "provenance.derivedFromId",
      label: translate("resources.assets.tabs.provenanceTab.wasDerivedFrom"),
      emptyText: translate(
        "resources.assets.tabs.provenanceTab.noSourceEntity"
      ),
    },
    {
      source: "provenance.generatedByDescription",
      label: translate("resources.assets.tabs.provenanceTab.wasGeneratedBy"),
      emptyText: translate(
        "resources.assets.tabs.provenanceTab.noActivityDescription"
      ),
    },
    {
      source: "provenance.attributedToId",
      label: translate("resources.assets.tabs.provenanceTab.wasAttributedTo"),
      emptyText: translate("resources.assets.tabs.provenanceTab.noAgent"),
    },
  ];

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {translate("resources.assets.tabs.provenanceTab.shortDescription")}
      </Typography>
      {provenanceFields.map(({ source, label, emptyText }) => (
        <Labeled fullWidth label={label} key={source}>
          <TextField source={source} emptyText={emptyText} />
        </Labeled>
      ))}
    </Box>
  );
};
