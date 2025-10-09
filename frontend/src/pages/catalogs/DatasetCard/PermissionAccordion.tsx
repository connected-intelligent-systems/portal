import { TextField, ArrayField, Datagrid } from "react-admin";
import { useTranslate } from "react-admin";
import { EnsureArrayField } from "../../../components/EnsureArrayField";
import { DatasetPolicy } from "../../../types/catalog";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

interface PermissionAccordionProps {
  record: DatasetPolicy;
}

export const PermissionAccordion = ({ record }: PermissionAccordionProps) => {
  const translate = useTranslate();

  const accordionSummaryStyle = {
    padding: 0,
    "&.MuiAccordionSummary-root": {
      minHeight: 30,
    },
  };

  const hasPermissions = record?.permissions && record.permissions.length > 0;

  return (
    <Accordion square elevation={0} disableGutters>
      <AccordionSummary
        expandIcon={<ArrowDropDownIcon />}
        sx={accordionSummaryStyle}
      >
        <Typography variant="caption">
          {translate("resources.catalog.permissions.permissions")}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }}>
        {hasPermissions ? (
          <EnsureArrayField
            source="permissions"
            label={translate("resources.catalog.permissions.permissions")}
            emptyText={translate("resources.catalog.permissions.noPermissions")}
            record={record}
          >
            <Datagrid
              bulkActionButtons={false}
              rowClick={false}
              hover={false}
              size="small"
            >
              <TextField
                source="action"
                label={translate("resources.catalog.permissions.action")}
                sortable={false}
              />
              <EnsureArrayField
                source="constraints"
                label={translate("resources.catalog.permissions.constraints")}
              >
                <Datagrid
                  hover={false}
                  bulkActionButtons={false}
                  style={{ tableLayout: "fixed" }}
                  size="small"
                >
                  <TextField
                    source="leftOperand"
                    label={translate(
                      "resources.catalog.permissions.leftOperand"
                    )}
                    sortable={false}
                  />
                  <TextField
                    source="operator"
                    label={translate("resources.catalog.permissions.operator")}
                    sortable={false}
                  />
                  <TextField
                    source="rightOperand"
                    label={translate(
                      "resources.catalog.permissions.rightOperand"
                    )}
                    sortable={false}
                  />
                </Datagrid>
              </EnsureArrayField>
            </Datagrid>
          </EnsureArrayField>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
            {translate("resources.catalog.permissions.noPermissions")}
          </Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );
};
