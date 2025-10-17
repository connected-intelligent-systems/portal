import { Labeled, useRecordContext, useTranslate } from "react-admin";
import { Box, Typography } from "@mui/material";

export const BasicInformation = () => {
  const translate = useTranslate();
  const record = useRecordContext();

  if (!record) return null;

  const renderKeywords = () => {
    const keywords = record.keywords;
    if (!keywords) {
      return (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontStyle: "italic" }}
        >
          {translate("resources.assets.tabs.basicInformation.noKeywords")}
        </Typography>
      );
    }

    const keywordsArray = Array.isArray(keywords) ? keywords : [keywords];

    if (keywordsArray.length === 0) {
      return (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontStyle: "italic" }}
        >
          {translate("resources.assets.tabs.basicInformation.noKeywords")}
        </Typography>
      );
    }

    return <Typography variant="body2">{keywordsArray.join(", ")}</Typography>;
  };

  return (
    <Box>
      <Labeled
        fullWidth
        label={translate(
          "resources.assets.tabs.basicInformation.shortDescription"
        )}
      >
        <Typography
          variant="body2"
          color={!record.abstract ? "text.secondary" : undefined}
        >
          {record.abstract ||
            translate(
              "resources.assets.tabs.basicInformation.noShortDescription"
            )}
        </Typography>
      </Labeled>

      <Labeled
        fullWidth
        label={translate("resources.assets.tabs.basicInformation.keywords")}
      >
        {renderKeywords()}
      </Labeled>

      <Labeled
        fullWidth
        label={translate("resources.assets.tabs.basicInformation.category")}
      >
        <Typography variant="body2">{record.theme?.title || "-"}</Typography>
      </Labeled>

      <Labeled
        fullWidth
        label={translate("resources.assets.tabs.basicInformation.mediaType")}
      >
        <Typography variant="body2">{record.mediaType || "-"}</Typography>
      </Labeled>
    </Box>
  );
};
