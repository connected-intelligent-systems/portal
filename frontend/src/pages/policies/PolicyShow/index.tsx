import React from "react";
import {
  Show,
  SimpleShowLayout,
  DateField,
  FunctionField,
  useTranslate,
} from "react-admin";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Policy as PolicyIcon,
  AccessTime as AccessTimeIcon,
  Security as SecurityIcon,
  Block as BlockIcon,
} from "@mui/icons-material";
import { PolicyShowBar } from "./PolicyShowBar";

// Custom components for different permission types
const TimeBasedPermissionShow = ({ permission }: { permission: any }) => {
  const translate = useTranslate();
  const constraint = permission.constraints?.[0];

  const formatOperator = (operator: string) => {
    switch (operator) {
      case "odrl:gt":
        return translate("resources.policies.show.after");
      case "odrl:lt":
        return translate("resources.policies.show.before");
      case "odrl:eq":
        return translate("resources.policies.show.at");
      default:
        return operator;
    }
  };

  return (
    <Card variant="outlined" sx={{ mb: 1 }}>
      <CardContent sx={{ py: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <ScheduleIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="subtitle2" fontWeight="medium">
            {translate("resources.policies.show.timeBasedPermission")}
          </Typography>
        </Box>

        <Grid container spacing={1}>
          <Grid item xs={12} sm={4}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              {translate("resources.policies.show.action")}
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              <Chip
                label={permission.action || "odrl:use"}
                color="success"
                variant="outlined"
                size="small"
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              {translate("resources.policies.show.timeCondition")}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {formatOperator(constraint?.operator || "")}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              {translate("resources.policies.show.dateTime")}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
              <AccessTimeIcon
                fontSize="small"
                sx={{ mr: 0.5, color: "text.secondary" }}
              />
              <Typography variant="body2">
                {constraint?.rightOperand
                  ? new Date(constraint.rightOperand).toLocaleString()
                  : "-"}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const IdentityBasedPermissionShow = ({ permission }: { permission: any }) => {
  const translate = useTranslate();
  const constraint = permission.constraints?.[0];

  const formatOperator = (operator: string) => {
    switch (operator) {
      case "odrl:eq":
        return translate("resources.policies.show.equals");
      case "odrl:neq":
        return translate("resources.policies.show.notEquals");
      case "odrl:isNoneOf":
        return translate("resources.policies.show.isNoneOf");
      case "odrl:isPartOf":
        return translate("resources.policies.show.isPartOf");
      default:
        return operator;
    }
  };

  const renderIdentities = (rightOperand: any) => {
    if (Array.isArray(rightOperand)) {
      return (
        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mt: 0.5 }}>
          {rightOperand.map((id, index) => (
            <Chip key={index} label={id} size="small" variant="outlined" />
          ))}
        </Box>
      );
    }
    return (
      <Box sx={{ mt: 0.5 }}>
        <Chip label={rightOperand || "-"} size="small" variant="outlined" />
      </Box>
    );
  };

  return (
    <Card variant="outlined" sx={{ mb: 1 }}>
      <CardContent sx={{ py: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <PersonIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="subtitle2" fontWeight="medium">
            {translate("resources.policies.show.identityBasedPermission")}
          </Typography>
        </Box>

        <Grid container spacing={1}>
          <Grid item xs={12} sm={4}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              {translate("resources.policies.show.action")}
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              <Chip
                label={permission.action || "odrl:use"}
                color="success"
                variant="outlined"
                size="small"
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              {translate("resources.policies.show.operator")}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {formatOperator(constraint?.operator || "")}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              {translate("resources.policies.show.identities")}
            </Typography>
            {renderIdentities(constraint?.rightOperand)}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const LocationBasedPermissionShow = ({ permission }: { permission: any }) => {
  const translate = useTranslate();
  const constraint = permission.constraints?.[0];

  const formatOperator = (operator: string) => {
    switch (operator) {
      case "odrl:eq":
        return translate("resources.policies.show.equals");
      case "odrl:neq":
        return translate("resources.policies.show.notEquals");
      case "odrl:isNoneOf":
        return translate("resources.policies.show.isNoneOf");
      case "odrl:isPartOf":
        return translate("resources.policies.show.isPartOf");
      default:
        return operator;
    }
  };

  return (
    <Card variant="outlined" sx={{ mb: 1 }}>
      <CardContent sx={{ py: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <LocationIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="subtitle2" fontWeight="medium">
            {translate("resources.policies.show.locationBasedPermission")}
          </Typography>
        </Box>

        <Grid container spacing={1}>
          <Grid item xs={12} sm={4}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              {translate("resources.policies.show.action")}
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              <Chip
                label={permission.action || "odrl:use"}
                color="success"
                variant="outlined"
                size="small"
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              {translate("resources.policies.show.operator")}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {formatOperator(constraint?.operator || "")}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              {translate("resources.policies.show.location")}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {constraint?.rightOperand || "-"}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const GenericPermissionShow = ({ permission }: { permission: any }) => {
  const translate = useTranslate();

  return (
    <Card variant="outlined" sx={{ mb: 1 }}>
      <CardContent sx={{ py: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <PolicyIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="subtitle2" fontWeight="medium">
            {translate("resources.policies.show.customPermission")}
          </Typography>
        </Box>

        <Grid container spacing={1}>
          <Grid item xs={12} sm={6}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              {translate("resources.policies.show.action")}
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              <Chip
                label={permission.action || "odrl:use"}
                color="success"
                variant="outlined"
                size="small"
              />
            </Box>
          </Grid>
        </Grid>

        {permission.constraints && permission.constraints.length > 0 && (
          <Box sx={{ mt: 1 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              {translate("resources.policies.show.constraints")}
            </Typography>
            {permission.constraints.map((constraint: any, index: number) => (
              <Box
                key={index}
                sx={{
                  p: 1,
                  bgcolor: "grey.50",
                  borderRadius: 1,
                  mb: 0.5,
                  mt: 0.5,
                }}
              >
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      {translate("resources.policies.show.leftOperand")}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.25 }}>
                      {constraint.leftOperand}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      {translate("resources.policies.show.operator")}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.25 }}>
                      {constraint.operator}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      {translate("resources.policies.show.rightOperand")}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.25 }}>
                      {Array.isArray(constraint.rightOperand)
                        ? constraint.rightOperand.join(", ")
                        : constraint.rightOperand}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const PermissionRenderer = ({ permission }: { permission: any }) => {
  if (
    !permission ||
    !permission.constraints ||
    permission.constraints.length === 0
  ) {
    return <GenericPermissionShow permission={permission} />;
  }

  const firstConstraint = permission.constraints[0];

  switch (firstConstraint.leftOperand) {
    case "edc:time":
      return <TimeBasedPermissionShow permission={permission} />;
    case "edc:participantId":
      return <IdentityBasedPermissionShow permission={permission} />;
    case "edc:location":
      return <LocationBasedPermissionShow permission={permission} />;
    default:
      return <GenericPermissionShow permission={permission} />;
  }
};

export const PolicyShow = () => {
  const translate = useTranslate();
  const [activeTab, setActiveTab] = React.useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Show actions={<PolicyShowBar />}>
      <SimpleShowLayout>
        <FunctionField
          render={(record: any) => {
            const permissions = record?.rules?.permissions || [];
            const obligations = record?.rules?.obligations || [];
            const prohibitions = record?.rules?.prohibitions || [];

            return (
              <Box>
                {/* First row: Type and Date (right-aligned) */}
                <Grid container spacing={1.5} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      {translate("resources.policies.fields.type")}
                    </Typography>
                    <Box sx={{ mt: 0.5 }}>
                      {record?.type ? (
                        <Chip
                          label={record.type}
                          color="primary"
                          variant="outlined"
                          size="small"
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          -
                        </Typography>
                      )}
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: { xs: "flex-start", sm: "flex-end" },
                        height: "100%",
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        {translate("resources.policies.fields.createdAt")}
                      </Typography>
                      <Box sx={{ mt: 0.5 }}>
                        <DateField source="createdAt" showTime emptyText="-" />
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                {/* Policy Type row */}
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    {translate("resources.policies.fields.policyType")}
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    {record?.policyType ? (
                      <Chip
                        label={record.policyType}
                        color="secondary"
                        variant="outlined"
                        size="small"
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        -
                      </Typography>
                    )}
                  </Box>
                </Box>

                {/* Name row */}
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    {translate("resources.policies.fields.name")}
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 0.5 }}>
                    {record?.name || "-"}
                  </Typography>
                </Box>

                {/* Description row */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    {translate("resources.policies.fields.description")}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {record?.description ||
                      translate("resources.policies.show.noDescription")}
                  </Typography>
                </Box>

                {/* Tabs for Rules */}
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    aria-label="policy rules tabs"
                  >
                    <Tab
                      label={translate("resources.policies.show.permissions")}
                      icon={<SecurityIcon />}
                      disabled={permissions.length === 0}
                      sx={{
                        color:
                          permissions.length === 0
                            ? "text.disabled"
                            : undefined,
                      }}
                    />
                    <Tab
                      label={translate("resources.policies.show.obligations")}
                      icon={<PolicyIcon />}
                      disabled={obligations.length === 0}
                      sx={{
                        color:
                          obligations.length === 0
                            ? "text.disabled"
                            : undefined,
                      }}
                    />
                    <Tab
                      label={translate("resources.policies.show.prohibitions")}
                      icon={<BlockIcon />}
                      disabled={prohibitions.length === 0}
                      sx={{
                        color:
                          prohibitions.length === 0
                            ? "text.disabled"
                            : undefined,
                      }}
                    />
                  </Tabs>
                </Box>

                {/* Tab Content */}
                <Box sx={{ mt: 2 }}>
                  {activeTab === 0 && (
                    <Box>
                      {permissions.length === 0 ? (
                        <Box sx={{ p: 2, textAlign: "center" }}>
                          <Typography variant="body2" color="text.secondary">
                            {translate("resources.policies.show.noPermissions")}
                          </Typography>
                        </Box>
                      ) : (
                        <Box>
                          {permissions.map((permission: any, index: number) => (
                            <PermissionRenderer
                              key={index}
                              permission={permission}
                            />
                          ))}
                        </Box>
                      )}
                    </Box>
                  )}

                  {activeTab === 1 && (
                    <Box>
                      {obligations.length === 0 ? (
                        <Box sx={{ p: 2, textAlign: "center" }}>
                          <Typography variant="body2" color="text.secondary">
                            {translate("resources.policies.show.noObligations")}
                          </Typography>
                        </Box>
                      ) : (
                        <Box>
                          {obligations.map((obligation: any, index: number) => (
                            <PermissionRenderer
                              key={index}
                              permission={obligation}
                            />
                          ))}
                        </Box>
                      )}
                    </Box>
                  )}

                  {activeTab === 2 && (
                    <Box>
                      {prohibitions.length === 0 ? (
                        <Box sx={{ p: 2, textAlign: "center" }}>
                          <Typography variant="body2" color="text.secondary">
                            {translate(
                              "resources.policies.show.noProhibitions"
                            )}
                          </Typography>
                        </Box>
                      ) : (
                        <Box>
                          {prohibitions.map(
                            (prohibition: any, index: number) => (
                              <PermissionRenderer
                                key={index}
                                permission={prohibition}
                              />
                            )
                          )}
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>
              </Box>
            );
          }}
        />
      </SimpleShowLayout>
    </Show>
  );
};
