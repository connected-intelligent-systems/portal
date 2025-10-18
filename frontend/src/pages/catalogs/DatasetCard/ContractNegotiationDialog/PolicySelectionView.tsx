import React, { useMemo } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import { useTranslate } from "react-admin";
import { PolicyRulesTabs } from "../../../../components/policies/PolicyRulesTabs";

interface PolicySelectionViewProps {
  policies: any[];
  selectedPolicy: number;
  onSelectPolicy: (index: number) => void; // eslint-disable-line no-unused-vars, @typescript-eslint/no-unused-vars
}

export const PolicySelectionView: React.FC<PolicySelectionViewProps> = ({
  policies,
  selectedPolicy,
  onSelectPolicy,
}) => {
  const translate = useTranslate();

  const options = useMemo(
    () =>
      policies.map((policy: any, policyIndex: number) => {
        const baseLabel = `${translate("resources.catalog.dataset.policy")} ${
          policyIndex + 1
        }`;
        const shortId =
          typeof policy.id === "string" && policy.id.length > 0
            ? `${policy.id.slice(0, 12)}${policy.id.length > 12 ? "…" : ""}`
            : null;
        return {
          index: policyIndex,
          label: shortId ? `${baseLabel} • ${shortId}` : baseLabel,
        };
      }),
    [policies, translate]
  );

  if (!policies.length) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          {translate("resources.catalog.dataset.noPolicies")}
        </Typography>
        <Typography color="textSecondary">
          {translate("resources.catalog.dataset.noPoliciesDescription")}
        </Typography>
      </Box>
    );
  }

  const handleChange = (event: SelectChangeEvent<string>) => {
    onSelectPolicy(Number(event.target.value));
  };

  return (
    <Box sx={{ width: "100%", minWidth: 0 }}>
      <Typography variant="h6" gutterBottom>
        {translate("resources.catalog.dataset.selectPolicyForNegotiation")}
      </Typography>

      <FormControl fullWidth>
        <InputLabel id="policy-selection-label">
          {translate("resources.catalog.dataset.selectPolicyForNegotiation")}
        </InputLabel>
        <Select
          labelId="policy-selection-label"
          id="policy-selection"
          value={String(selectedPolicy)}
          label={translate(
            "resources.catalog.dataset.selectPolicyForNegotiation"
          )}
          onChange={handleChange}
        >
          {options.map((option) => (
            <MenuItem key={option.index} value={String(option.index)}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {policies.map((policy: any, policyIndex: number) =>
        selectedPolicy === policyIndex ? (
          <Box key={policyIndex} sx={{ mt: 3 }}>
            <PolicyRulesTabs
              permissions={policy.permissions}
              obligations={policy.obligations}
              prohibitions={policy.prohibitions}
            />
          </Box>
        ) : null
      )}
    </Box>
  );
};
