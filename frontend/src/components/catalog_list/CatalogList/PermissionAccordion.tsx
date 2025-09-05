import { TextField, ArrayField, Datagrid } from "react-admin";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import PropTypes from "prop-types";

interface PermissionAccordionProps {
  record: any;
}

export const PermissionAccordion = ({ record }: PermissionAccordionProps) => {
  const accordionSummaryStyle = {
    padding: 0,
    "&.MuiAccordionSummary-root": {
      minHeight: 30,
    },
  };

  if (record?.["odrl:permission"].length === 0) {
    return null;
  }

  return (
    <Accordion square elevation={0} disableGutters>
      <AccordionSummary
        expandIcon={<ArrowDropDownIcon />}
        sx={accordionSummaryStyle}
      >
        <Typography variant="caption">Permissions</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }}>
        <ArrayField
          source="odrl:permission"
          label="Permissions"
          emptyText="No Permissions"
          record={record}
        >
          <Datagrid
            bulkActionButtons={false}
            rowClick={false}
            hover={false}
            size="small"
          >
            <TextField
              source="odrl:action.@id"
              label="Action"
              sortable={false}
            />
            <ArrayField source="odrl:constraint" label="Constraints">
              <Datagrid
                hover={false}
                bulkActionButtons={false}
                style={{ tableLayout: "fixed" }}
                size="small"
              >
                <TextField
                  source="odrl:leftOperand.@id"
                  label="Left Operand"
                  sortable={false}
                />
                <TextField
                  source="odrl:operator.@id"
                  label="Operator"
                  sortable={false}
                />
                <TextField
                  source="odrl:rightOperand"
                  label="Right Operand"
                  sortable={false}
                />
              </Datagrid>
            </ArrayField>
          </Datagrid>
        </ArrayField>
      </AccordionDetails>
    </Accordion>
  );
};

PermissionAccordion.propTypes = {
  record: PropTypes.object,
};
