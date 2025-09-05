import React from "react";
import {
  Box,
  Skeleton,
  Card,
  CardContent,
  Grid,
} from "@mui/material";

interface LoadingSkeletonProps {
  variant?: "card" | "dialog";
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = "card"
}) => {
  if (variant === "dialog") {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="text" width="60%" height={40} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="40%" height={24} sx={{ mb: 3 }} />
        <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
          <Skeleton variant="rectangular" width={80} height={24} />
          <Skeleton variant="rectangular" width={100} height={24} />
        </Box>
        <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="70%" height={20} sx={{ mb: 3 }} />
        <Skeleton variant="rectangular" width="100%" height={200} />
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <Grid item xs={12} md={6} lg={4} key={item}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Skeleton variant="text" width="80%" height={32} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="70%" height={20} sx={{ mb: 2 }} />
              <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                <Skeleton variant="rectangular" width={60} height={24} />
                <Skeleton variant="rectangular" width={80} height={24} />
              </Box>
              <Skeleton variant="rectangular" width="100%" height={36} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
