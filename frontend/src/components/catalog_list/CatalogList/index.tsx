import { Paper, Grid, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { DatasetCard } from "./DatasetCard";

interface CatalogListProps {
  record: any[];
}

export const CatalogList = ({ record }: CatalogListProps) => {
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
    <Grid container spacing={3} sx={{ mt: 1 }}>
      {record?.map((dataset, index) => (
        <DatasetCard
          key={dataset?.["@id"] + index}
          dataset={dataset}
          index={index}
        />
      ))}
    </Grid>
  );
};

CatalogList.propTypes = {
  record: PropTypes.array,
};
