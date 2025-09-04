import {
  List,
  Datagrid,
  TextField,
  FunctionField,
  ListActions,
} from "react-admin";

export const ContractDefinitionsList = () => (
  <List empty={false} actions={<ListActions hasCreate />} exporter={false}>
    <Datagrid
      bulkActionButtons={false}
      rowClick="show"
      style={{ tableLayout: "fixed" }}
    >
      <TextField source="id" sortable={false} />
      <FunctionField
        label={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ width: "20px", flexShrink: 0 }}></span>
            <span>Name</span>
          </div>
        }
        render={(record: any) => {
          const assetsSelector = record?.assetsSelector;
          const hasWarning = !assetsSelector || assetsSelector.length === 0;

          return (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  width: "20px",
                  display: "inline-block",
                  textAlign: "center",
                  flexShrink: 0,
                }}
                title={
                  hasWarning
                    ? "This contract definition applies to ALL assets (no assets selected)"
                    : ""
                }
              >
                {hasWarning ? "⚠️" : ""}
              </span>
              <span style={{ flexGrow: 1 }}>
                {record?.privateProperties?.name}
              </span>
            </div>
          );
        }}
        sortable={false}
      />
    </Datagrid>
  </List>
);
