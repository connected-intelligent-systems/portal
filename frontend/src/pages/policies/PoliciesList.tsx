import {
  List,
  Datagrid,
  DateField,
  FunctionField,
  useTranslate,
} from "react-admin";
import { Box, Typography, Chip, Tooltip } from "@mui/material";
import {
  Security as SecurityIcon,
  Block as BlockIcon,
  Assignment as AssignmentIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";

export const PoliciesList = () => {
  const translate = useTranslate();

  const renderNameWithId = (record: any) => (
    <Box>
      <Typography variant="body2" fontWeight="medium">
        {record?.name || "Untitled Policy"}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        ID: {record?.id}
      </Typography>
    </Box>
  );

  const renderRulesCount = (record: any) => {
    const permissions = record?.rules?.permissions?.length || 0;
    const obligations = record?.rules?.obligations?.length || 0;
    const prohibitions = record?.rules?.prohibitions?.length || 0;
    const total = permissions + obligations + prohibitions;

    if (total === 0) {
      return (
        <Chip 
          label="0"
          size="small"
          icon={<SecurityIcon fontSize="small" />}
          variant="outlined"
          sx={{ 
            minWidth: 'auto', 
            height: 20, 
            '& .MuiChip-label': { px: 0.5 },
            color: 'text.disabled',
            borderColor: 'text.disabled',
            '& .MuiChip-icon': { color: 'text.disabled' }
          }}
        />
      );
    }

    return (
      <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
        {permissions > 0 && (
          <Tooltip title={`${permissions} permission${permissions > 1 ? 's' : ''}`}>
            <Chip 
              label={permissions} 
              color="primary" 
              size="small"
              icon={<SecurityIcon fontSize="small" />}
              sx={{ minWidth: 'auto', height: 20, '& .MuiChip-label': { px: 0.5 } }}
            />
          </Tooltip>
        )}
        {obligations > 0 && (
          <Tooltip title={`${obligations} obligation${obligations > 1 ? 's' : ''}`}>
            <Chip 
              label={obligations} 
              color="secondary" 
              size="small"
              icon={<AssignmentIcon fontSize="small" />}
              sx={{ minWidth: 'auto', height: 20, '& .MuiChip-label': { px: 0.5 } }}
            />
          </Tooltip>
        )}
        {prohibitions > 0 && (
          <Tooltip title={`${prohibitions} prohibition${prohibitions > 1 ? 's' : ''}`}>
            <Chip 
              label={prohibitions} 
              color="error" 
              size="small"
              icon={<BlockIcon fontSize="small" />}
              sx={{ minWidth: 'auto', height: 20, '& .MuiChip-label': { px: 0.5 } }}
            />
          </Tooltip>
        )}
      </Box>
    );
  };

  return (
    <List empty={false} exporter={false}>
      <Datagrid
        style={{ tableLayout: "fixed" }}
        bulkActionButtons={false}
        rowClick="show"
      >
        <FunctionField
          label={translate("resources.policies.fields.name")}
          render={renderNameWithId}
          sortable={false}
        />

        <FunctionField
          label={translate("resources.policies.list.rules")}
          render={renderRulesCount}
          sortable={false}
        />
      </Datagrid>
    </List>
  );
};
