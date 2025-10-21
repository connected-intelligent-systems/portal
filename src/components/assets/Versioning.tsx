import {
  Labeled,
  useRecordContext,
  useTranslate,
  TextField,
} from "react-admin";
import { Box, Typography } from "@mui/material";

export const Versioning = () => {
  const translate = useTranslate();
  const record = useRecordContext();

  if (!record) return null;

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {translate("resources.assets.tabs.dataPrivacyTab.shortDescription")}
      </Typography>

      <Labeled
        fullWidth
        label={translate("resources.assets.fields.versioning")}
      >
        <TextField source="version" emptyText="-" />
      </Labeled>

      <Labeled fullWidth label={translate("resources.assets.fields.creator")}>
        <TextField source="creator.name" emptyText="-" />
      </Labeled>

      <Labeled fullWidth label={translate("resources.assets.fields.modified")}>
        <TextField source="modified" emptyText="-" />
      </Labeled>

      <Labeled fullWidth label={translate("resources.assets.fields.created")}>
        <TextField source="created" emptyText="-" />
      </Labeled>
    </Box>
  );
};
