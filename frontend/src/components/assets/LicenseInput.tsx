import { AutocompleteInput, FormDataConsumer, TextInput } from "react-admin";

const licenseChoices = [
  { id: "Apache-2.0", name: "Apache License 2.0" },
  { id: "MIT", name: "MIT License" },
  { id: "GPL-3.0-only", name: "GNU General Public License v3.0 only" },
  { id: "GPL-2.0-only", name: "GNU General Public License v2.0 only" },
  { id: "BSD-3-Clause", name: "BSD 3-Clause \"New\" or \"Revised\" License" },
  { id: "BSD-2-Clause", name: "BSD 2-Clause \"Simplified\" License" },
  { id: "MPL-2.0", name: "Mozilla Public License 2.0" },
  { id: "CDDL-1.0", name: "Common Development and Distribution License 1.0" },
  { id: "EPL-2.0", name: "Eclipse Public License 2.0" },
  { id: "LGPL-2.1-only", name: "GNU Lesser General Public License v2.1 only" },
  { id: "AGPL-3.0-only", name: "GNU Affero General Public License v3.0 only" },
  { id: "Unlicense", name: "The Unlicense" },
  { id: "BSL-1.0", name: "Boost Software License 1.0" },
  { id: "ISC", name: "ISC License" },
  { id: "Custom", name: "Custom" },
];

export const LicenseInput = () => {
  return (
    <>
      <AutocompleteInput
        source="dct:license.@id"
        label="License"
        helperText="Select a license from the list or choose Custom to enter a custom license URL."
        choices={licenseChoices}
        fullWidth
      />
      <FormDataConsumer>
        {({ formData, ...rest }) =>
          formData["dct:license.@id"] === "Custom" && (
            <TextInput
              source="dct:license.custom"
              label="Custom License URL"
              helperText="Enter the URL of the custom license."
              fullWidth
              {...rest}
            />
          )
        }
      </FormDataConsumer>
    </>
  );
};
