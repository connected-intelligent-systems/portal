import { Labeled, FunctionField, useTranslate } from "react-admin";
import { Box, Typography } from "@mui/material";

export const BasicInformation = () => {
  const translate = useTranslate();

  return (
    <Box>
      <Labeled
        fullWidth
        label={translate(
          "resources.assets.tabs.basicInformation.shortDescription"
        )}
      >
        <FunctionField
          render={(record: any) => {
            const abstract = record?.abstract;
            if (!abstract) {
              return (
                <Typography variant="body2" color="text.secondary">
                  {translate(
                    "resources.assets.tabs.basicInformation.noShortDescription"
                  )}
                </Typography>
              );
            }
            return <Typography variant="body2">{abstract}</Typography>;
          }}
        />
      </Labeled>

      <Labeled
        fullWidth
        label={translate("resources.assets.tabs.basicInformation.keywords")}
      >
        <FunctionField
          render={(record: any) => {
            const keywords = record?.keywords;
            if (!keywords) {
              return (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontStyle: "italic" }}
                >
                  {translate(
                    "resources.assets.tabs.basicInformation.noKeywords"
                  )}
                </Typography>
              );
            }

            // Handle case where single keyword is returned as string instead of array
            const keywordsArray = Array.isArray(keywords)
              ? keywords
              : [keywords];

            if (keywordsArray.length === 0) {
              return (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontStyle: "italic" }}
                >
                  {translate(
                    "resources.assets.tabs.basicInformation.noKeywords"
                  )}
                </Typography>
              );
            }

            return keywordsArray.map((keyword: string, index: number) => (
              <span key={index} style={{ marginRight: "8px" }}>
                {keyword}
                {index < keywordsArray.length - 1 ? ", " : ""}
              </span>
            ));
          }}
        />
      </Labeled>

      <Labeled
        fullWidth
        label={translate("resources.assets.tabs.basicInformation.category")}
      >
        <FunctionField render={(record: any) => record?.theme?.title || "-"} />
      </Labeled>

      <Labeled
        fullWidth
        label={translate("resources.assets.tabs.basicInformation.mediaType")}
      >
        <FunctionField render={(record: any) => record?.mediaType || "-"} />
      </Labeled>
    </Box>
  );
};
