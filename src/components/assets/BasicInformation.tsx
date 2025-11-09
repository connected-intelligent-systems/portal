import { useRecordContext, useTranslate, useLocale } from "react-admin";
import { Box, Typography, Chip } from "@mui/material";
import { getAbstractValue } from "../../utils/multiLanguageUtils";

export const BasicInformation = () => {
  const translate = useTranslate();
  const locale = useLocale();
  const record = useRecordContext();

  if (!record) return null;

  return (
    <Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "140px 1fr",
          gap: 1.5,
          mb: 2,
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontWeight: 500 }}
        >
          {translate("resources.assets.tabs.basicInformation.category")}
        </Typography>
        <Typography variant="body2">{record?.theme?.title || "-"}</Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontWeight: 500 }}
        >
          {translate("resources.assets.tabs.basicInformation.mediaType")}
        </Typography>
        <Typography variant="body2">{record?.mediaType || "-"}</Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontWeight: 500 }}
        >
          {translate("resources.assets.tabs.basicInformation.keywords")}
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {record?.keywords ? (
            (Array.isArray(record.keywords)
              ? record.keywords
              : [record.keywords]
            ).map((keyword: string, index: number) => (
              <Chip
                key={index}
                label={keyword}
                color="secondary"
                variant="outlined"
                size="small"
              />
            ))
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontStyle: "italic" }}
            >
              {translate("resources.assets.tabs.basicInformation.noKeywords")}
            </Typography>
          )}
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontWeight: 500 }}
        >
          {translate("resources.assets.tabs.versioningTab.version")}
        </Typography>
        <Typography variant="body2">{record?.version || "-"}</Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontWeight: 500 }}
        >
          {translate("resources.assets.tabs.versioningTab.creator")}
        </Typography>
        <Typography variant="body2">{record?.creator?.name || "-"}</Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontWeight: 500 }}
        >
          {translate("resources.assets.tabs.versioningTab.created")}
        </Typography>
        <Typography variant="body2">
          {record?.created
            ? new Date(record.created).toLocaleDateString()
            : "-"}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontWeight: 500 }}
        >
          {translate("resources.assets.tabs.versioningTab.modified")}
        </Typography>
        <Typography variant="body2">
          {record?.modified
            ? new Date(record.modified).toLocaleDateString()
            : "-"}
        </Typography>
      </Box>

      <Box>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {translate("resources.assets.tabs.basicInformation.shortDescription")}
        </Typography>
        <Typography variant="body2">
          {getAbstractValue(record?.abstracts, record?.abstract, locale) ||
            translate(
              "resources.assets.tabs.basicInformation.noShortDescription"
            )}
        </Typography>
      </Box>
    </Box>
  );
};
