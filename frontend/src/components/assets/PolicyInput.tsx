import {
  ArrayInput,
  AutocompleteInput,
  SimpleFormIterator,
  HiddenInput,
} from "react-admin";
import {
  Typography,
  Link,
  Box,
} from "@mui/material";

const permissionChoices = [
  { id: "odrl:use", name: "Use" },
  { id: "odrl:distribute", name: "Distribute" },
  { id: "odrl:reproduce", name: "Reproduce" },
  { id: "odrl:modify", name: "Modify" },
];

const prohibitionChoices = [
  { id: "odrl:commercialize", name: "Commercialize" },
  { id: "odrl:sell", name: "Sell" },
  { id: "odrl:derive", name: "Derive" },
];

export const PolicyInput = () => {
  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Define the policies for this asset, including permissions and
        prohibitions. For more information, see the{" "}
        <Link
          href="https://www.w3.org/TR/odrl-model/"
          target="_blank"
          rel="noopener noreferrer"
        >
          ODRL Information Model
        </Link>
        .
      </Typography>
      <HiddenInput source="odrl:hasPolicy.@type" defaultValue="odrl:Policy" />
      <ArrayInput source="odrl:hasPolicy.odrl:permission" label="Permissions">
        <SimpleFormIterator>
          <AutocompleteInput
            source="odrl:action"
            label="Action"
            helperText="An action that is permitted on the dataset."
            choices={permissionChoices}
            fullWidth
          />
        </SimpleFormIterator>
      </ArrayInput>
      <ArrayInput source="odrl:hasPolicy.odrl:prohibition" label="Prohibitions">
        <SimpleFormIterator>
          <AutocompleteInput
            source="odrl:action"
            label="Action"
            helperText="An action that is prohibited on the dataset."
            choices={prohibitionChoices}
            fullWidth
          />
        </SimpleFormIterator>
      </ArrayInput>
    </Box>
  );
};
