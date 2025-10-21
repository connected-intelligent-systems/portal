import {
  List,
  Datagrid,
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
          label={translate("resources.catalog.manager.catalogName")}
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
          label={translate("resources.catalog.manager.description")}
          sortable={false}
          render={(record: LocalCatalog) => (
            <Box>
              {record.description ? (
                <Typography variant="body2">{record.description}</Typography>
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
          label={translate("resources.catalog.fields.dateAdded")}
          showTime
          sortable={false}
        />
      </Datagrid>
    </List>
  );
};
