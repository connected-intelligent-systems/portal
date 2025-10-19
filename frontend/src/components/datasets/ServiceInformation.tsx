import React from "react";
import { useTranslate } from "react-admin";
import {
  Typography,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

interface ServiceInformationProps {
  dataset: any;
}

export const ServiceInformation: React.FC<ServiceInformationProps> = ({
  dataset,
}) => {
  const translate = useTranslate();

  if (!dataset?.distributions || dataset.distributions.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        {translate(
          "resources.assets.tabs.serviceInformationTab.noDistributionInformation"
        )}
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {translate("resources.assets.tabs.serviceInformationTab.description")}
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>
              {translate("resources.assets.tabs.serviceInformationTab.format")}
            </TableCell>
            <TableCell sx={{ fontWeight: 600 }}>
              {translate(
                "resources.assets.tabs.serviceInformationTab.endpointUrl"
              )}
            </TableCell>
            <TableCell sx={{ fontWeight: 600 }}>
              {translate(
                "resources.assets.tabs.serviceInformationTab.serviceType"
              )}
            </TableCell>
            <TableCell sx={{ fontWeight: 600 }}>
              {translate(
                "resources.assets.tabs.serviceInformationTab.endpointDescription"
              )}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dataset.distributions.map((distribution: any, index: number) => (
            <TableRow key={index}>
              <TableCell>
                {distribution.format ? (
                  <Chip
                    label={distribution.format}
                    size="small"
                    color="primary"
                  />
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell>
                {distribution.accessService?.endpointUrl || "-"}
              </TableCell>
              <TableCell>{distribution.accessService?.type || "-"}</TableCell>
              <TableCell>
                {distribution.accessService?.endpointDescription || "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};
