import { TextInput, Labeled, useTranslate } from "react-admin";
import { Typography, Box } from "@mui/material";

export const ProvenanceTab = () => {
  const translate = useTranslate();

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {translate("resources.assets.create.provenance.description")}
      </Typography>
      <Labeled
        label={translate(
          "resources.assets.create.provenance.fields.wasDerivedFrom"
        )}
        fullWidth
      >
        <TextInput
          source="provenance.derivedFromId"
          label={translate(
            "resources.assets.create.provenance.fields.sourceEntityUri"
          )}
          helperText={translate(
            "resources.assets.create.provenance.fields.sourceEntityUriHelper"
          )}
          fullWidth
        />
      </Labeled>
      <Labeled
        label={translate(
          "resources.assets.create.provenance.fields.wasGeneratedBy"
        )}
        fullWidth
      >
        <TextInput
          source="provenance.generatedByDescription"
          label={translate(
            "resources.assets.create.provenance.fields.activityDescription"
          )}
          helperText={translate(
            "resources.assets.create.provenance.fields.activityDescriptionHelper"
          )}
          multiline
          fullWidth
        />
      </Labeled>
      <Labeled
        label={translate(
          "resources.assets.create.provenance.fields.wasAttributedTo"
        )}
        fullWidth
      >
        <TextInput
          source="provenance.attributedToId"
          label={translate(
            "resources.assets.create.provenance.fields.agentUri"
          )}
          helperText={translate(
            "resources.assets.create.provenance.fields.agentUriHelper"
          )}
          fullWidth
        />
      </Labeled>
    </Box>
  );
};
