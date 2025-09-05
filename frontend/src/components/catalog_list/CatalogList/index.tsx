import { Paper, Grid, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { DatasetCard } from "./DatasetCard";
import { ErrorBoundary } from "./ErrorBoundary";
import { LoadingSkeleton } from "./LoadingSkeleton";

interface CatalogListProps {
  record?: any[];
  loading?: boolean;
}

export const CatalogList = ({ record, loading = false }: CatalogListProps) => {
  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!record || record.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          No datasets found
        </Typography>
        <Typography variant="body2" color="textSecondary">
          The catalog appears to be empty or the connection failed.
        </Typography>
      </Paper>
    );
  }

  return (
    <ErrorBoundary>
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {record?.map((dataset, index) => (
          <ErrorBoundary key={dataset?.["@id"] + index} fallback={
            <Grid item xs={12} md={6} lg={4}>
              <Paper sx={{ p: 2, textAlign: "center", bgcolor: "error.light" }}>
                <Typography variant="body2" color="error">
                  Failed to load dataset
                </Typography>
              </Paper>
            </Grid>
          }>
            <DatasetCard
              dataset={dataset}
              index={index}
            />
          </ErrorBoundary>
        ))}
      </Grid>
    </ErrorBoundary>
  );
};

CatalogList.propTypes = {
  record: PropTypes.array,
  loading: PropTypes.bool,
};
