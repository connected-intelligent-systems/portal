import { Box, Card, CardContent, Chip, Typography } from "@mui/material";
import { Policy as PolicyIcon } from "@mui/icons-material";
import { useTranslate } from "react-admin";

import { InfoItem, InfoRow } from "./PermissionLayout";

type PermissionProps = {
  permission: any;
};

export const GenericPermissionShow = ({ permission }: PermissionProps) => {
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

        <InfoRow>
          <InfoItem label={translate("resources.policies.show.action")}>
            <Chip
              label={permission.action || "odrl:use"}
              color="success"
              variant="outlined"
              size="small"
            />
          </InfoItem>
        </InfoRow>

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
                <InfoRow>
                  <InfoItem
                    label={translate("resources.policies.show.leftOperand")}
                  >
                    <Typography variant="body2" sx={{ mt: 0.25 }}>
                      {constraint.leftOperand}
                    </Typography>
                  </InfoItem>
                  <InfoItem
                    label={translate("resources.policies.show.operator")}
                  >
                    <Typography variant="body2" sx={{ mt: 0.25 }}>
                      {constraint.operator}
                    </Typography>
                  </InfoItem>
                  <InfoItem
                    label={translate("resources.policies.show.rightOperand")}
                  >
                    <Typography variant="body2" sx={{ mt: 0.25 }}>
                      {Array.isArray(constraint.rightOperand)
                        ? constraint.rightOperand.join(", ")
                        : constraint.rightOperand}
                    </Typography>
                  </InfoItem>
                </InfoRow>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
