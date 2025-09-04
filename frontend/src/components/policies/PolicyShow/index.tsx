import {
  Show,
  SimpleShowLayout,
  TopToolbar,
  DeleteButton,
  TextField,
  DateField,
  ArrayField,
  Datagrid,
} from "react-admin";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const PolicyShowBar = () => {
  return (
    <TopToolbar>
      <DeleteButton mutationMode="pessimistic" />
    </TopToolbar>
  );
};

export const PolicyShow = () => {
  const accordionSummaryStyle = {
    padding: 0,
    "&.MuiAccordionSummary-root": {
      minHeight: "auto",
    },
    "& .MuiAccordionSummary-content": {
      margin: 0,
    },
  };

  return (
    <Show actions={<PolicyShowBar />}>
      <SimpleShowLayout>
        <TextField source="id" />
        <TextField label="Name" source="privateProperties.name" />
        <TextField
          label="Description"
          source="privateProperties.description"
          emptyText="-"
        />
        <DateField source="createdAt" label="Created At" showTime />
        <TextField label="Type" source="@type" />
        <TextField label="Policy Type" source="policy.@type" />
        <Accordion square elevation={0} disableGutters defaultExpanded>
          <AccordionSummary
            expandIcon={<ArrowDropDownIcon />}
            sx={accordionSummaryStyle}
          >
            <Typography variant="caption">Permissions</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <ArrayField source="policy.odrl:permission" label="Permissions">
              <Datagrid
                bulkActionButtons={false}
                rowClick={false}
                hover={false}
              >
                <TextField
                  source="odrl:action.@id"
                  label="Action"
                  sortable={false}
                />
                <ArrayField
                  source="odrl:constraint"
                  label="Constraint"
                  sortable={false}
                >
                  <Datagrid
                    bulkActionButtons={false}
                    rowClick={false}
                    style={{ tableLayout: "fixed" }}
                    hover={false}
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
      </SimpleShowLayout>
    </Show>
  );
};
