import { useState } from "react";
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Button,
} from "@mui/material";
import HandshakeIcon from "@mui/icons-material/Handshake";
import PolicyIcon from "@mui/icons-material/Policy";
import { ContractNegotiationDialog } from "./ContractNegotiationDialog";

interface DatasetCardProps {
  dataset: any;
  index: number;
}

export const DatasetCard = ({ dataset, index }: DatasetCardProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const datasetTitle =
    dataset?.["dct:title"] || dataset?.name || "Unnamed Dataset";
  const datasetId = dataset?.["@id"];

  return (
    <Grid item xs={12} md={6} lg={4} key={datasetId + index}>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardContent sx={{ flexGrow: 1, pb: 1 }}>
          {/* Header */}
          <Typography variant="h6" component="h3" gutterBottom>
            {datasetTitle}
          </Typography>

          {/* ID - small and less prominent */}
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ display: "block", mb: 2 }}
          >
            ID: {datasetId}
          </Typography>

          {/* Participant, Type, Category, Media Type & Keywords */}
          <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
            {dataset["dspace:participantId"] && (
              <Chip
                size="small"
                label={dataset["dspace:participantId"]}
                variant="outlined"
              />
            )}
            {dataset.type && (
              <Chip
                size="small"
                label={dataset.type}
                color="primary"
                variant="outlined"
              />
            )}
            {dataset.contenttype && (
              <Chip
                size="small"
                label={dataset.contenttype}
                color="secondary"
                variant="outlined"
              />
            )}
            {dataset["dcat:theme"] && (
              <Chip
                size="small"
                label={
                  typeof dataset["dcat:theme"] === "object"
                    ? dataset["dcat:theme"]["dct:title"] ||
                      dataset["dcat:theme"]["@id"] ||
                      "Unknown Category"
                    : dataset["dcat:theme"]
                }
                color="primary"
                variant="outlined"
              />
            )}
            {dataset["dcat:mediaType"] && (
              <Chip
                size="small"
                label={dataset["dcat:mediaType"]}
                color="info"
                variant="outlined"
              />
            )}
          </Box>

          {/* Keywords */}
          {dataset["dcat:keyword"] && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                Keywords
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {Array.isArray(dataset["dcat:keyword"])
                  ? dataset["dcat:keyword"].map((keyword: string, index: number) => (
                      <Chip
                        key={index}
                        size="small"
                        label={keyword}
                        color="secondary"
                        variant="outlined"
                      />
                    ))
                  : (
                      <Chip
                        size="small"
                        label={dataset["dcat:keyword"]}
                        color="secondary"
                        variant="outlined"
                      />
                    )}
              </Box>
            </Box>
          )}

          {/* Policy Count */}
          {dataset["odrl:hasPolicy"] && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <PolicyIcon fontSize="small" color="action" />
              <Typography variant="body2" color="textSecondary">
                {dataset["odrl:hasPolicy"].length} polic
                {dataset["odrl:hasPolicy"].length === 1 ? "y" : "ies"} available
              </Typography>
            </Box>
          )}
        </CardContent>

        {/* Always visible Start Negotiation button */}
        <CardActions sx={{ p: 2, pt: 0 }}>
          <Button
            variant="contained"
            startIcon={<HandshakeIcon />}
            onClick={() => setDialogOpen(true)}
            disabled={
              !dataset["odrl:hasPolicy"] ||
              dataset["odrl:hasPolicy"].length === 0
            }
            fullWidth
          >
            View & Negotiate
          </Button>
        </CardActions>
      </Card>

      <ContractNegotiationDialog
        dataset={dataset}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </Grid>
  );
};
