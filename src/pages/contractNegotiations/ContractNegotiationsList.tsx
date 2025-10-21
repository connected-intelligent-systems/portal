import { ReactElement, useMemo } from "react";
import {
  Datagrid,
  DateField,
  FilterButton,
  List,
  SelectInput,
  TextField,
  TopToolbar,
  useTranslate,
} from "react-admin";

const NEGOTIATION_TYPE_CHOICES = [
  { id: "CONSUMER", name: "CONSUMER" },
  { id: "PROVIDER", name: "PROVIDER" },
];

const NEGOTIATION_STATE_CHOICES = [
  { id: "INITIAL", name: "INITIAL" },
  { id: "REQUESTING", name: "REQUESTING" },
  { id: "REQUESTED", name: "REQUESTED" },
  { id: "OFFERING", name: "OFFERING" },
  { id: "OFFERED", name: "OFFERED" },
  { id: "ACCEPTING", name: "ACCEPTING" },
  { id: "ACCEPTED", name: "ACCEPTED" },
  { id: "AGREEING", name: "AGREEING" },
  { id: "AGREED", name: "AGREED" },
  { id: "VERIFYING", name: "VERIFYING" },
  { id: "VERIFIED", name: "VERIFIED" },
  { id: "FINALIZING", name: "FINALIZING" },
  { id: "FINALIZED", name: "FINALIZED" },
  { id: "DECLINING", name: "DECLINING" },
  { id: "DECLINED", name: "DECLINED" },
  { id: "TERMINATING", name: "TERMINATING" },
  { id: "TERMINATED", name: "TERMINATED" },
];

const ContractNegotiationsListActions = ({
  filters,
}: {
  filters: ReactElement[];
}) => (
  <TopToolbar>
    <FilterButton filters={filters} />
  </TopToolbar>
);

export const ContractNegotiationsList = () => {
  const translate = useTranslate();
  const filters = useMemo(
    () => [
      <SelectInput
        key="state"
        source="state"
        label={translate("resources.contractnegotiations.filters.state")}
        choices={NEGOTIATION_STATE_CHOICES}
        emptyText=""
        resettable
      />,
      <SelectInput
        key="type"
        source="type"
        label={translate("resources.contractnegotiations.filters.type")}
        choices={NEGOTIATION_TYPE_CHOICES}
        emptyText=""
        resettable
      />,
    ],
    [translate]
  );
  return (
    <List
      exporter={false}
      filters={filters}
      actions={<ContractNegotiationsListActions filters={filters} />}
    >
      <Datagrid rowClick="show" bulkActionButtons={false}>
        <TextField
          source="id"
          label={translate("resources.contractnegotiations.fields.id")}
          sortable={true}
        />
        <TextField
          source="state"
          label={translate("resources.contractnegotiations.fields.state")}
          sortable={false}
        />
        <TextField
          source="type"
          label={translate("resources.contractnegotiations.fields.type")}
          sortable={false}
        />
        <DateField
          source="createdAt"
          showTime
          label={translate("resources.contractnegotiations.fields.createdAt")}
          sortable={true}
        />
      </Datagrid>
    </List>
  );
};
