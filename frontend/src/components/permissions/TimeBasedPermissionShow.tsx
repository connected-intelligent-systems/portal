import { Box, Card, CardContent, Typography } from "@mui/material";
import { Schedule as ScheduleIcon } from "@mui/icons-material";
import { useTranslate } from "react-admin";

import { InfoItem, InfoRow } from "./PermissionLayout";

type PermissionProps = {
  permission: any;
};

export const TimeBasedPermissionShow = ({ permission }: PermissionProps) => {
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

        <InfoRow>
          <InfoItem label={translate("resources.policies.show.timeCondition")}>
            <Typography variant="body2">
              {formatOperator(constraint?.operator || "")}
            </Typography>
          </InfoItem>

          <InfoItem label={translate("resources.policies.show.dateTime")}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="body2">
                {constraint?.rightOperand
                  ? new Date(constraint.rightOperand).toLocaleString()
                  : "-"}
              </Typography>
            </Box>
          </InfoItem>
        </InfoRow>
      </CardContent>
    </Card>
  );
};
