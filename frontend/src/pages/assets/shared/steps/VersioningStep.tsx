import {
  TextInput,
  ArrayInput,
  SimpleFormIterator,
  DateInput,
  useTranslate,
} from "react-admin";
import { Typography, Link } from "@mui/material";

export const VersioningStep = () => {
  const translate = useTranslate();

  return (
    <>
      <Typography variant="h6" gutterBottom>
        {translate("resources.assets.create.versioning.title")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {translate("resources.assets.create.versioning.description")}
        <Link
          href="https://www.dublincore.org/specifications/dublin-core/dcmi-terms/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Dublin Core Terms
        </Link>{" "}
        and{" "}
        <Link
          href="https://www.w3.org/TR/owl-ref/"
          target="_blank"
          rel="noopener noreferrer"
        >
          OWL Web Ontology Language
        </Link>
        .
      </Typography>
      <TextInput
        source="version"
        label={translate("resources.assets.create.versioning.fields.version")}
        helperText={translate(
          "resources.assets.create.versioning.fields.versionHelper"
        )}
        fullWidth
      />
      <TextInput
        source="creator.name"
        label={translate("resources.assets.create.versioning.fields.creator")}
        helperText={translate(
          "resources.assets.create.versioning.fields.creatorHelper"
        )}
        fullWidth
      />
      <DateInput
        source="created"
        label={translate("resources.assets.create.versioning.fields.created")}
        helperText={translate(
          "resources.assets.create.versioning.fields.createdHelper"
        )}
        fullWidth
      />
      <DateInput
        source="modified"
        label={translate("resources.assets.create.versioning.fields.modified")}
        helperText={translate(
          "resources.assets.create.versioning.fields.modifiedHelper"
        )}
        fullWidth
      />
      <ArrayInput
        source="hasVersion"
        label={translate(
          "resources.assets.create.versioning.fields.previousVersions"
        )}
      >
        <SimpleFormIterator>
          <TextInput
            source="version"
            label={translate(
              "resources.assets.create.versioning.fields.previousVersion"
            )}
            helperText={translate(
              "resources.assets.create.versioning.fields.previousVersionHelper"
            )}
          />
          <DateInput
            source="releaseDate"
            label={translate(
              "resources.assets.create.versioning.fields.issued"
            )}
            helperText={translate(
              "resources.assets.create.versioning.fields.issuedHelper"
            )}
          />
        </SimpleFormIterator>
      </ArrayInput>
    </>
  );
};
