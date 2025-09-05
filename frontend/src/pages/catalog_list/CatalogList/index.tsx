import { Paper, Grid, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useTranslate } from "react-admin";
import { DatasetCard } from "./DatasetCard";
import { ErrorBoundary } from "./ErrorBoundary";
import { Dataset } from "../../../types/catalog";

interface CatalogListProps {
  record?: Dataset[];
  loading?: boolean;
  counterPartyAddress?: string;
}

export const CatalogList = ({ record, loading = false, counterPartyAddress }: CatalogListProps) => {
  const translate = useTranslate();

  if (loading) {
    return (
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="textSecondary">
          {translate("resources.catalog.list.loading")}
        </Typography>
      </Paper>
    );
  }

  if (!record || record.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          {translate("resources.catalog.list.noDatasetsFound")}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {translate("resources.catalog.list.emptyCatalogMessage")}
        </Typography>
      </Paper>
    );
  }

  return (
    <ErrorBoundary>
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {record?.map((dataset, index) => (
          <ErrorBoundary
            key={dataset?.id || `dataset-${index}`}
            fallback={
              <Grid item xs={12} md={6} lg={4}>
                <Paper
                  sx={{ p: 2, textAlign: "center", bgcolor: "error.light" }}
                >
                  <Typography variant="body2" color="error">
                    {translate("resources.catalog.list.failedToLoadDataset")}
                  </Typography>
                </Paper>
              </Grid>
            }
          >
            <DatasetCard counterPartyAddress={counterPartyAddress} dataset={dataset} index={index} />
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
