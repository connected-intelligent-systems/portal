import {
  TextInput,
  ArrayInput,
  SimpleFormIterator,
  AutocompleteInput,
  required,
  useTranslate,
} from "react-admin";
import { Typography } from "@mui/material";
import { getCategoryIds } from "../../../../utils/categories";

export const BasicInformationStep = () => {
  const translate = useTranslate();

  const categoryChoices = getCategoryIds().map((id) => ({
    id,
    name: translate(
      `resources.assets.create.basicInformation.categories.${id.toLowerCase()}`
    ),
  }));

  const mediaTypeChoices = [
    {
      id: "text/csv",
      name: translate(
        "resources.assets.create.basicInformation.mediaTypes.csv"
      ),
    },
    {
      id: "application/json",
      name: translate(
        "resources.assets.create.basicInformation.mediaTypes.json"
      ),
    },
    {
      id: "application/xml",
      name: translate(
        "resources.assets.create.basicInformation.mediaTypes.xml"
      ),
    },
    {
      id: "application/yaml",
      name: translate(
        "resources.assets.create.basicInformation.mediaTypes.yaml"
      ),
    },
    {
      id: "application/vnd.apache.parquet",
      name: translate(
        "resources.assets.create.basicInformation.mediaTypes.parquet"
      ),
    },
    {
      id: "application/x-hdf5",
      name: translate(
        "resources.assets.create.basicInformation.mediaTypes.hdf5"
      ),
    },
    {
      id: "application/avro",
      name: translate(
        "resources.assets.create.basicInformation.mediaTypes.avro"
      ),
    },
    {
      id: "application/orc",
      name: translate(
        "resources.assets.create.basicInformation.mediaTypes.orc"
      ),
    },
  ];
  return (
    <>
      <Typography variant="h6" gutterBottom>
        {translate("resources.assets.create.basicInformation.title")}
      </Typography>
      <TextInput
        source="title"
        label={translate(
          "resources.assets.create.basicInformation.fields.title"
        )}
        helperText={translate(
          "resources.assets.create.basicInformation.fields.titleHelper"
        )}
        validate={required()}
        fullWidth
      />
      <TextInput
        source="abstract"
        label={translate(
          "resources.assets.create.basicInformation.fields.shortDescription"
        )}
        helperText={translate(
          "resources.assets.create.basicInformation.fields.shortDescriptionHelper"
        )}
        validate={[
          required(),
          (value) => {
            if (value && value.length > 255) {
              return translate(
                "resources.assets.create.basicInformation.fields.shortDescriptionValidation"
              );
            }
            return undefined;
          },
        ]}
        fullWidth
        multiline
        rows={3}
      />
      <ArrayInput
        source="keywords"
        label={translate(
          "resources.assets.create.basicInformation.fields.keywords"
        )}
        sx={{ mt: 3 }}
      >
        <SimpleFormIterator>
          <TextInput
            source=""
            label={translate(
              "resources.assets.create.basicInformation.fields.keyword"
            )}
            helperText={translate(
              "resources.assets.create.basicInformation.fields.keywordHelper"
            )}
          />
        </SimpleFormIterator>
      </ArrayInput>
      <AutocompleteInput
        source="theme.title"
        label={translate(
          "resources.assets.create.basicInformation.fields.category"
        )}
        helperText={translate(
          "resources.assets.create.basicInformation.fields.categoryHelper"
        )}
        choices={categoryChoices}
        fullWidth
      />
      <AutocompleteInput
        source="mediaType"
        label={translate(
          "resources.assets.create.basicInformation.fields.mediaType"
        )}
        helperText={translate(
          "resources.assets.create.basicInformation.fields.mediaTypeHelper"
        )}
        choices={mediaTypeChoices}
        fullWidth
      />
    </>
  );
};
