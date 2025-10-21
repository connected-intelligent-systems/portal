import { type ReactNode } from "react";
import { Box, Stack, Typography } from "@mui/material";

type InfoItemProps = {
  label: string;
  children: ReactNode;
};

export const InfoItem = ({ label, children }: InfoItemProps) => (
  <Box sx={{ flex: 1, minWidth: 0 }}>
    <Typography variant="caption" color="text.secondary" display="block">
      {label}
    </Typography>
    <Box sx={{ mt: 0.5 }}>{children}</Box>
  </Box>
);

export const InfoRow = ({ children }: { children: ReactNode }) => (
  <Stack
    direction={{ xs: "column", sm: "row" }}
    spacing={2}
    useFlexGap
    sx={{ flexWrap: "wrap" }}
  >
    {children}
  </Stack>
);
