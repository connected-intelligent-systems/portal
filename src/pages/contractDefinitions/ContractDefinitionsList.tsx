import {
  List,
  Datagrid,
  FunctionField,
  ListActions,
  useTranslate,
} from "react-admin";
import { Box, Typography, Tooltip } from "@mui/material";
import { Warning as WarningIcon } from "@mui/icons-material";
import { ContractDefinition } from "../../types/contractDefinition";

export const ContractDefinitionsList = () => {
  const translate = useTranslate();

  const renderNameWithId = (record: ContractDefinition) => {
    const assetsSelector = record?.assetsSelector;
    const hasWarning = !assetsSelector || assetsSelector.length === 0;

    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {hasWarning && (
          <Tooltip
            title={translate(
              "resources.contract_definitions.list.warningTitle"
            )}
          >
            <WarningIcon color="warning" fontSize="small" />
          </Tooltip>
        )}
        <Box>
          <Typography variant="body2" fontWeight="medium">
            {record?.privateProperties?.name || "Untitled Contract Definition"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ID: {record?.id}
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <List empty={false} actions={<ListActions hasCreate />} exporter={false}>
      <Datagrid
        bulkActionButtons={false}
        rowClick="show"
        style={{ tableLayout: "fixed" }}
      >
        <FunctionField
          label={translate("resources.contract_definitions.fields.name")}
          render={renderNameWithId}
          sortable={true}
          sortBy="privateProperties.'https://w3id.org/edc/v0.0.1/ns/name'"
        />
      </Datagrid>
    </List>
  );
};
