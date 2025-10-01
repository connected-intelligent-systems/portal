import { Typography } from "@mui/material";
import { useTranslate } from "react-admin";
import { MarkdownInput } from "../../../../components/markdown";

export const DetailedDescriptionTab = () => {
  const translate = useTranslate();

  return (
    <>
      <Typography variant="h6" gutterBottom>
        {translate("resources.assets.create.detailedDescription.title")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {translate("resources.assets.create.detailedDescription.description")}
      </Typography>
      <MarkdownInput source="description" />
    </>
  );
};
