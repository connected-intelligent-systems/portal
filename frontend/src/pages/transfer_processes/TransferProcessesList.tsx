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

const DIRECTION_CHOICES = [
  { id: "CONSUMER", name: "CONSUMER" },
  { id: "PROVIDER", name: "PROVIDER" },
];

const TRANSFER_TYPE_CHOICES = [
  { id: "HttpData-PULL", name: "HttpData-PULL" },
  { id: "HttpData-PUSH", name: "HttpData-PUSH" },
  { id: "AmazonS3-PUSH", name: "AmazonS3-PUSH" },
];

const STATE_CHOICES = [
  { id: "INITIAL", name: "INITIAL" },
  { id: "PROVISIONING", name: "PROVISIONING" },
  { id: "PROVISIONING_REQUESTED", name: "PROVISIONING_REQUESTED" },
  { id: "PROVISIONED", name: "PROVISIONED" },
  { id: "REQUESTING", name: "REQUESTING" },
  { id: "REQUESTED", name: "REQUESTED" },
  { id: "STARTING", name: "STARTING" },
  { id: "STARTUP_REQUESTED", name: "STARTUP_REQUESTED" },
  { id: "STARTED", name: "STARTED" },
  { id: "SUSPENDING", name: "SUSPENDING" },
  { id: "SUSPENDING_REQUESTED", name: "SUSPENDING_REQUESTED" },
  { id: "SUSPENDED", name: "SUSPENDED" },
  { id: "RESUMING", name: "RESUMING" },
  { id: "RESUMED", name: "RESUMED" },
  { id: "COMPLETING", name: "COMPLETING" },
  { id: "COMPLETING_REQUESTED", name: "COMPLETING_REQUESTED" },
  { id: "COMPLETED", name: "COMPLETED" },
  { id: "TERMINATING", name: "TERMINATING" },
  { id: "TERMINATING_REQUESTED", name: "TERMINATING_REQUESTED" },
  { id: "TERMINATED", name: "TERMINATED" },
  { id: "DEPROVISIONING", name: "DEPROVISIONING" },
  { id: "DEPROVISIONING_REQUESTED", name: "DEPROVISIONING_REQUESTED" },
  { id: "DEPROVISIONED", name: "DEPROVISIONED" },
];

const TransferProcessesListActions = ({
  filters,
}: {
  filters: ReactElement[];
}) => (
  <TopToolbar>
    <FilterButton filters={filters} />
  </TopToolbar>
);

export const TransferProcessesList = () => {
  const translate = useTranslate();
  const filters = useMemo(
    () => [
      <SelectInput
        key="transferDirection"
        source="transferDirection"
        label={translate("resources.transferprocesses.filters.direction")}
        choices={DIRECTION_CHOICES}
        emptyText=""
        resettable
      />,
      <SelectInput
        key="transferType"
        source="transferType"
        label={translate("resources.transferprocesses.filters.transferType")}
        choices={TRANSFER_TYPE_CHOICES}
        emptyText=""
        resettable
      />,
      <SelectInput
        key="state"
        source="state"
        label={translate("resources.transferprocesses.filters.state")}
        choices={STATE_CHOICES}
        emptyText=""
        resettable
      />,
    ],
    [translate]
  );

  return (
    <List
      empty={false}
      exporter={false}
      filters={filters}
      actions={<TransferProcessesListActions filters={filters} />}
    >
      <Datagrid bulkActionButtons={false} rowClick="show">
        <TextField
          label={translate("resources.transferprocesses.fields.id")}
          source="id"
          sortable={true}
        />
        <TextField
          label={translate("resources.transferprocesses.fields.assetId")}
          source="assetId"
          sortable={false}
        />
        <TextField
          label={translate(
            "resources.transferprocesses.fields.transferDirection"
          )}
          source="transferDirection"
          sortable={false}
        />
        <TextField
          label={translate("resources.transferprocesses.fields.state")}
          source="state"
          sortable={false}
        />
        <TextField
          label={translate("resources.transferprocesses.fields.transferType")}
          source="transferType"
          sortable={false}
        />
        <DateField
          label={translate("resources.transferprocesses.fields.stateTimestamp")}
          source="stateTimestamp"
          sortable={true}
          sortBy="stateTimestamp"
          showTime
        />
      </Datagrid>
    </List>
  );
};
