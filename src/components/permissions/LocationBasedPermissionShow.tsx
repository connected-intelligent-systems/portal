import { Box, Card, CardContent, Typography } from "@mui/material";
import { LocationOn as LocationIcon } from "@mui/icons-material";
import { useTranslate } from "react-admin";

import { InfoItem, InfoRow } from "./PermissionLayout";

type PermissionProps = {
  permission: any;
};

export const LocationBasedPermissionShow = ({
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

  return (
    <Card variant="outlined" sx={{ mb: 1 }}>
      <CardContent sx={{ py: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <LocationIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="subtitle2" fontWeight="medium">
            {translate("resources.policies.show.locationBasedPermission")}
          </Typography>
        </Box>

        <InfoRow>
          <InfoItem label={translate("resources.policies.show.operator")}>
            <Typography variant="body2">
              {formatOperator(constraint?.operator || "")}
            </Typography>
          </InfoItem>

          <InfoItem label={translate("resources.policies.show.location")}>
            <Typography variant="body2">
              {constraint?.rightOperand || "-"}
            </Typography>
          </InfoItem>
        </InfoRow>
      </CardContent>
    </Card>
  );
};
