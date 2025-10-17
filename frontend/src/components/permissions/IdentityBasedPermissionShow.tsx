import { Box, Card, CardContent, Chip, Typography } from "@mui/material";
import { Person as PersonIcon } from "@mui/icons-material";
import { useTranslate } from "react-admin";

import { InfoItem, InfoRow } from "./PermissionLayout";

type PermissionProps = {
  permission: any;
};

export const IdentityBasedPermissionShow = ({
  permission,
}: PermissionProps) => {
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
        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
          {rightOperand.map((id, index) => (
            <Chip key={index} label={id} size="small" variant="outlined" />
          ))}
        </Box>
      );
    }

    return <Chip label={rightOperand || "-"} size="small" variant="outlined" />;
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

        <InfoRow>
          <InfoItem label={translate("resources.policies.show.action")}>
            <Chip
              label={permission.action || "odrl:use"}
              color="success"
              variant="outlined"
              size="small"
            />
          </InfoItem>

          <InfoItem label={translate("resources.policies.show.operator")}>
            <Typography variant="body2">
              {formatOperator(constraint?.operator || "")}
            </Typography>
          </InfoItem>

          <InfoItem label={translate("resources.policies.show.identities")}>
            {renderIdentities(constraint?.rightOperand)}
          </InfoItem>
        </InfoRow>
      </CardContent>
    </Card>
  );
};
