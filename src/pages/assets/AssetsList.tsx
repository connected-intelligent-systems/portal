import {
  List,
  Datagrid,
  TextField,
  FunctionField,
  useTranslate,
  useLocale,
} from "react-admin";
import { Box, Typography, Chip } from "@mui/material";
import { Asset } from "../../types/asset";
import { getTitleValue } from "../../utils/multiLanguageUtils";

export const AssetsList = () => {
  const translate = useTranslate();
  const locale = useLocale();
  return (
    <List empty={false} exporter={false}>
      <Datagrid
        bulkActionButtons={false}
        aria-label="Assets data table"
        rowClick="show"
      >
        <FunctionField
          label={translate("resources.assets.fields.title")}
          sortable={true}
          sortBy="properties.'http://purl.org/dc/terms/title'"
          render={(record: Asset) => (
            <Box>
              <Typography variant="body2" fontWeight="medium">
                {getTitleValue(record?.titles, record?.title, locale) ||
                  "Untitled"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ID: {record?.id}
              </Typography>
            </Box>
          )}
        />

        <FunctionField
          label={translate("resources.assets.fields.category")}
          sortable={false}
          render={(record: Asset) => (
            <Typography variant="body2">
              {record?.theme?.title || "-"}
            </Typography>
          )}
        />

        <FunctionField
          label={translate("resources.assets.fields.mediaType")}
          sortable={false}
          render={(record: Asset) => (
            <Typography variant="body2">{record?.mediaType || "-"}</Typography>
          )}
        />

        <FunctionField
          label={translate("resources.assets.fields.keywords")}
          sortable={false}
          render={(record: Asset) => {
            if (!record?.keywords || record.keywords.length === 0) {
              return (
                <Typography variant="body2" color="text.secondary">
                  -
                </Typography>
              );
            }
            return (
              <Box
                sx={{
                  display: "flex",
                  gap: 0.5,
                  flexWrap: "wrap",
                  maxWidth: 150,
                }}
              >
                {record.keywords.slice(0, 2).map((keyword, index) => (
                  <Chip
                    key={index}
                    label={keyword}
                    size="small"
                    variant="outlined"
                  />
                ))}
                {record.keywords.length > 2 && (
                  <Typography variant="caption" color="text.secondary">
                    +{record.keywords.length - 2}
                  </Typography>
                )}
              </Box>
            );
          }}
        />

        <TextField
          source="dataAddress.type"
          label={translate("resources.assets.fields.dataAddressType")}
          sortable={false}
        />
      </Datagrid>
    </List>
  );
};
