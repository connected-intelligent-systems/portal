import {
  TextInput,
  ArrayInput,
  SimpleFormIterator,
  AutocompleteInput,
  required,
  useTranslate,
  useLocale,
} from "react-admin";
import { Typography } from "@mui/material";
import { getCategoryIds } from "../../../../utils/categories";
import { getMediaTypeChoices } from "../../../../utils/mediaTypes";

export const BasicInformationStep = () => {
  const translate = useTranslate();
  const locale = useLocale();

  const categoryChoices = getCategoryIds().map((id) => ({
    id,
    name: translate(
      `resources.assets.create.basicInformation.categories.${id.toLowerCase()}`
    ),
  }));

  const mediaTypeChoices = getMediaTypeChoices(locale);
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
