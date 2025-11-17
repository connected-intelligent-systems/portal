import { useState } from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Chip,
  Button,
} from "@mui/material";
import { useTranslate, useLocale } from "react-admin";
import HandshakeIcon from "@mui/icons-material/Handshake";
import PolicyIcon from "@mui/icons-material/Policy";
import { ContractNegotiationDialog } from "../ContractNegotiationDialog";
import { Dataset } from "../../../types/catalog";
import {
  getTitleValue,
  getAbstractValue,
} from "../../../utils/multiLanguageUtils";

interface DatasetCardProps {
  dataset: Dataset;
  index: number;
  counterPartyAddress?: string;
}

export const DatasetCard = ({
  dataset,
  index,
  counterPartyAddress,
}: DatasetCardProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const translate = useTranslate();
  const locale = useLocale();

  const datasetTitle =
    getTitleValue(dataset?.titles, dataset?.title, locale) ||
    dataset?.name ||
    translate("resources.catalog.dataset.unnamedDataset");
  const datasetId = dataset?.id;
  const datasetIdDisplay = datasetId ?? "-";
  const datasetIdLabel = <>{datasetIdDisplay}</>;

  return (
    <>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minWidth: 300,
        }}
        role="article"
        aria-labelledby={`dataset-title-${index}`}
        aria-describedby={`dataset-description-${index}`}
      >
        <CardContent sx={{ flexGrow: 1, pb: 1 }}>
          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            id={`dataset-title-${index}`}
          >
            {datasetTitle}
          </Typography>

          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ display: "block", mb: 2 }}
            aria-label={translate("resources.catalog.dataset.aria.datasetId", {
              id: datasetIdDisplay,
            })}
          >
            {datasetIdLabel}
          </Typography>

          <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
            {dataset?.theme ? (
              <Chip
                size="small"
                label={
                  typeof dataset.theme === "object"
                    ? dataset.theme?.title ||
                      dataset.theme?.id ||
                      translate("resources.catalog.dataset.unknownCategory")
                    : dataset.theme
                }
                color="primary"
                variant="outlined"
              />
            ) : (
              <Chip
                size="small"
                label="placeholder"
                sx={{ visibility: "hidden" }}
              />
            )}
            {dataset?.mediaType ? (
              <Chip
                size="small"
                label={dataset.mediaType}
                color="info"
                variant="outlined"
              />
            ) : (
              <Chip
                size="small"
                label="placeholder"
                sx={{ visibility: "hidden" }}
              />
            )}
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
              {translate("resources.catalog.dataset.shortDescription")}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 2,
                lineHeight: 1.4,
                fontStyle: dataset?.abstract ? "normal" : "italic",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                minHeight: "4.3em",
              }}
              id={`dataset-description-${index}`}
            >
              {getAbstractValue(
                dataset?.abstracts,
                dataset?.abstract,
                locale
              ) ||
                translate("resources.catalog.dataset.noDescriptionAvailable")}
            </Typography>
          </Box>

          {/* Keywords */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
              {translate("resources.catalog.dataset.keywords")}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {Array.isArray(dataset?.keywords) &&
              dataset.keywords.length > 0 ? (
                dataset.keywords.map((keyword: string, index: number) => (
                  <Chip
                    key={index}
                    size="small"
                    label={keyword}
                    color="secondary"
                    variant="outlined"
                  />
                ))
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontStyle: "italic" }}
                >
                  {translate("resources.catalog.dataset.noKeywordsAvailable")}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Policy Count */}
          {dataset.policies && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <PolicyIcon fontSize="small" color="action" />
              <Typography variant="body2" color="textSecondary">
                {dataset.policies.length}{" "}
                {dataset.policies.length === 1
                  ? translate("resources.catalog.dataset.policyAvailable")
                  : translate("resources.catalog.dataset.policiesAvailable")}
              </Typography>
            </Box>
          )}
        </CardContent>

        {/* Action buttons */}
        <CardActions sx={{ p: 2, pt: 0 }}>
          <Button
            variant="contained"
            startIcon={<HandshakeIcon />}
            onClick={() => setDialogOpen(true)}
            disabled={!dataset.policies || dataset.policies.length === 0}
            fullWidth
            aria-label={translate(
              "resources.catalog.dataset.aria.viewAndNegotiate",
              { title: datasetTitle }
            )}
            aria-describedby={`dataset-description-${index}`}
          >
            {translate("resources.catalog.dataset.viewAndNegotiate")}
          </Button>
        </CardActions>
      </Card>

      <ContractNegotiationDialog
        counterPartyAddress={counterPartyAddress}
        dataset={dataset}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </>
  );
};
