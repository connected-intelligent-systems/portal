import {
  List,
  Datagrid,
  TextField,
  DateField,
  FunctionField,
  useTranslate,
} from "react-admin";
import { Box, Typography } from "@mui/material";
import { LocalCatalog } from "../../types/catalog";

export const CatalogList = () => {
  const translate = useTranslate();

  return (
    <List empty={false} exporter={false} pagination={false} perPage={1000}>
      <Datagrid bulkActionButtons={false} rowClick="show">
        <FunctionField
          label={translate("resources.catalog.manager.catalogName", "Name")}
          sortable={false}
          render={(record: LocalCatalog) => (
            <Box>
              <Typography variant="body2" fontWeight="medium">
                {record.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {record.url}
              </Typography>
            </Box>
          )}
        />

        <FunctionField
          label={translate(
            "resources.catalog.manager.description",
            "Description"
          )}
          sortable={false}
          render={(record: LocalCatalog) => (
            <Box>
              {record.description ? (
                <Typography variant="body2">{record.description}</Typography>
              ) : record.lastConnected ? (
                <Typography variant="caption" color="text.secondary">
                  Last connected:{" "}
                  {new Date(record.lastConnected).toLocaleString()}
                </Typography>
              ) : (
                <Typography variant="caption" color="text.secondary">
                  -
                </Typography>
              )}
            </Box>
          )}
        />

        <DateField
          source="dateAdded"
          label={translate("resources.catalog.manager.added", "Date Added")}
          showTime
          sortable={false}
        />
      </Datagrid>
    </List>
  );
};
