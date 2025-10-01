import {
  List,
  Datagrid,
  TextField,
  FunctionField,
  useTranslate,
} from "react-admin";
import { Box, Typography, Chip } from "@mui/material";
import { ErrorBoundary } from "../catalogs/DatasetCard/ErrorBoundary";
import { Asset } from "../../types/asset";

export const AssetsList = () => {
  const translate = useTranslate();
  return (
    <ErrorBoundary>
      <List empty={false} exporter={false}>
        <Datagrid
          style={{ tableLayout: "fixed" }}
          bulkActionButtons={false}
          aria-label="Assets data table"
          rowClick="show"
        >
          <FunctionField
            label={translate("resources.assets.fields.title")}
            sortable={false}
            render={(record: Asset) => (
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  {record?.title || "Untitled"}
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
            render={(record: Asset) =>
              record?.theme?.title ? (
                <Chip
                  label={record.theme.title}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  -
                </Typography>
              )
            }
          />

          <FunctionField
            label={translate("resources.assets.fields.mediaType")}
            sortable={false}
            render={(record: Asset) =>
              record?.mediaType ? (
                <Chip
                  label={record.mediaType}
                  color="info"
                  variant="outlined"
                  size="small"
                />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  -
                </Typography>
              )
            }
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
    </ErrorBoundary>
  );
};
