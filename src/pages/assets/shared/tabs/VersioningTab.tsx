import { TextInput, DateInput, useTranslate } from "react-admin";
import { Typography } from "@mui/material";

export const VersioningTab = () => {
  const translate = useTranslate();

  return (
    <>
      <Typography variant="h6" gutterBottom>
        {translate("resources.assets.create.versioning.title")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {translate("resources.assets.create.versioning.description")}
      </Typography>
      <TextInput
        source="version"
        label={translate("resources.assets.create.versioning.fields.version")}
        helperText={translate(
          "resources.assets.create.versioning.fields.versionHelper"
        )}
        fullWidth
      />
      <TextInput
        source="creator.name"
        label={translate("resources.assets.create.versioning.fields.creator")}
        helperText={translate(
          "resources.assets.create.versioning.fields.creatorHelper"
        )}
        fullWidth
      />
      <DateInput
        source="created"
        label={translate("resources.assets.create.versioning.fields.created")}
        helperText={translate(
          "resources.assets.create.versioning.fields.createdHelper"
        )}
        fullWidth
      />
      <DateInput
        source="modified"
        label={translate("resources.assets.create.versioning.fields.modified")}
        helperText={translate(
          "resources.assets.create.versioning.fields.modifiedHelper"
        )}
        fullWidth
      />
    </>
  );
};
