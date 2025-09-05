import { useInput, useGetList, Loading, Error as RAError } from "react-admin";
import { Autocomplete, TextField, Chip, Box } from "@mui/material";
import { useState, useEffect } from "react";

interface AssetByIdSelectorProps {
  source: string;
  label?: string;
  fullWidth?: boolean;
  validate?: any[];
  helperText?: string;
}

export const AssetByIdSelector = ({
  source,
  label = "Assets",
  fullWidth = true,
  validate,
  helperText,
}: AssetByIdSelectorProps) => {
  const { field } = useInput({ source, validate });
  const [selectedAssets, setSelectedAssets] = useState<any[]>([]);

  // Fetch all assets
  const {
    data: assets,
    isLoading,
    error,
  } = useGetList("assets", {
    pagination: { page: 1, perPage: 1000 },
    sort: { field: "id", order: "ASC" },
    filter: {},
  });

  // Extract current selected asset IDs from the data structure and find full asset objects
  useEffect(() => {
    if (assets && field.value?.[0]?.operandRight) {
      const selectedIds = field.value[0].operandRight;
      const selected = assets.filter((asset: any) =>
        selectedIds.includes(asset.id)
      );
      setSelectedAssets(selected);
    }
  }, [assets, field.value]);

  const handleChange = (_: any, newValue: any[]) => {
    setSelectedAssets(newValue);

    if (newValue && newValue.length > 0) {
      field.onChange([
        {
          operandLeft: "https://w3id.org/edc/v0.0.1/ns/id",
          operator: "in",
          operandRight: newValue.map((asset) => asset.id),
        },
      ]);
    } else {
      field.onChange([]);
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <RAError error={error} resetErrorBoundary={() => {}} />;

  return (
    <Box sx={{ mb: 2, width: "100%" }}>
      <Autocomplete
        multiple
        fullWidth
        options={assets || []}
        getOptionLabel={(option: any) =>
          option?.properties?.["dct:title"] || "Unnamed Asset"
        }
        value={selectedAssets}
        onChange={handleChange}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => (
            <Chip
              label={option?.properties?.["dct:title"] || "Unnamed Asset"}
              {...getTagProps({ index })}
              key={option.id}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            fullWidth={fullWidth}
            variant="outlined"
            helperText={helperText}
          />
        )}
      />
    </Box>
  );
};
