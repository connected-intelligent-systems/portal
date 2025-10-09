import {
  ArrayInput,
  AutocompleteInput,
  SimpleFormIterator,
  useTranslate,
} from "react-admin";
import { Typography, Box } from "@mui/material";

export const DataPrivacyTab = () => {
  const translate = useTranslate();

  const personalDataChoices = [
    {
      id: "dpv:Location",
      name: translate(
        "resources.assets.create.dataPrivacy.personalDataTypes.location"
      ),
    },
    {
      id: "dpv:Demographic",
      name: translate(
        "resources.assets.create.dataPrivacy.personalDataTypes.demographic"
      ),
    },
    {
      id: "dpv:Financial",
      name: translate(
        "resources.assets.create.dataPrivacy.personalDataTypes.financial"
      ),
    },
    {
      id: "dpv:Health",
      name: translate(
        "resources.assets.create.dataPrivacy.personalDataTypes.health"
      ),
    },
    {
      id: "dpv:Biometric",
      name: translate(
        "resources.assets.create.dataPrivacy.personalDataTypes.biometric"
      ),
    },
    {
      id: "dpv:Genetic",
      name: translate(
        "resources.assets.create.dataPrivacy.personalDataTypes.genetic"
      ),
    },
    {
      id: "dpv:Communication",
      name: translate(
        "resources.assets.create.dataPrivacy.personalDataTypes.communication"
      ),
    },
    {
      id: "dpv:Social",
      name: translate(
        "resources.assets.create.dataPrivacy.personalDataTypes.social"
      ),
    },
    {
      id: "dpv:Tracking",
      name: translate(
        "resources.assets.create.dataPrivacy.personalDataTypes.tracking"
      ),
    },
    {
      id: "dpv:Behavioural",
      name: translate(
        "resources.assets.create.dataPrivacy.personalDataTypes.behavioural"
      ),
    },
    {
      id: "dpv:Identity",
      name: translate(
        "resources.assets.create.dataPrivacy.personalDataTypes.identity"
      ),
    },
  ];

  const purposeChoices = [
    {
      id: "dpv:ResearchAndDevelopment",
      name: translate(
        "resources.assets.create.dataPrivacy.purposes.researchAndDevelopment"
      ),
    },
    {
      id: "dpv:Marketing",
      name: translate("resources.assets.create.dataPrivacy.purposes.marketing"),
    },
    {
      id: "dpv:Advertising",
      name: translate(
        "resources.assets.create.dataPrivacy.purposes.advertising"
      ),
    },
    {
      id: "dpv:Security",
      name: translate("resources.assets.create.dataPrivacy.purposes.security"),
    },
    {
      id: "dpv:Personalisation",
      name: translate(
        "resources.assets.create.dataPrivacy.purposes.personalisation"
      ),
    },
    {
      id: "dpv:ServiceProvision",
      name: translate(
        "resources.assets.create.dataPrivacy.purposes.serviceProvision"
      ),
    },
    {
      id: "dpv:Analytics",
      name: translate("resources.assets.create.dataPrivacy.purposes.analytics"),
    },
    {
      id: "dpv:CustomerManagement",
      name: translate(
        "resources.assets.create.dataPrivacy.purposes.customerManagement"
      ),
    },
  ];

  const legalBasisChoices = [
    {
      id: "dpv:Consent",
      name: translate("resources.assets.create.dataPrivacy.legalBases.consent"),
    },
    {
      id: "dpv:Contract",
      name: translate(
        "resources.assets.create.dataPrivacy.legalBases.contract"
      ),
    },
    {
      id: "dpv:LegalObligation",
      name: translate(
        "resources.assets.create.dataPrivacy.legalBases.legalObligation"
      ),
    },
    {
      id: "dpv:VitalInterest",
      name: translate(
        "resources.assets.create.dataPrivacy.legalBases.vitalInterest"
      ),
    },
    {
      id: "dpv:PublicInterest",
      name: translate(
        "resources.assets.create.dataPrivacy.legalBases.publicInterest"
      ),
    },
    {
      id: "dpv:LegitimateInterest",
      name: translate(
        "resources.assets.create.dataPrivacy.legalBases.legitimateInterest"
      ),
    },
  ];

  const lawChoices = [
    {
      id: "dpv:GDPR",
      name: translate("resources.assets.create.dataPrivacy.laws.gdpr"),
    },
    {
      id: "dpv:CCPA",
      name: translate("resources.assets.create.dataPrivacy.laws.ccpa"),
    },
    {
      id: "dpv:LGPD",
      name: translate("resources.assets.create.dataPrivacy.laws.lgpd"),
    },
    {
      id: "dpv:PIPEDA",
      name: translate("resources.assets.create.dataPrivacy.laws.pipeda"),
    },
  ];
  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {translate("resources.assets.create.dataPrivacy.description")}
      </Typography>
      <ArrayInput
        source="privacySettings.personalDataHandling"
        label={translate(
          "resources.assets.create.dataPrivacy.fields.personalDataHandling"
        )}
      >
        <SimpleFormIterator>
          <AutocompleteInput
            source="personalData"
            label={translate(
              "resources.assets.create.dataPrivacy.fields.personalData"
            )}
            helperText={translate(
              "resources.assets.create.dataPrivacy.fields.personalDataHelper"
            )}
            choices={personalDataChoices}
            fullWidth
          />
          <AutocompleteInput
            source="purpose"
            label={translate(
              "resources.assets.create.dataPrivacy.fields.purpose"
            )}
            helperText={translate(
              "resources.assets.create.dataPrivacy.fields.purposeHelper"
            )}
            choices={purposeChoices}
            fullWidth
          />
          <AutocompleteInput
            source="legalBasis"
            label={translate(
              "resources.assets.create.dataPrivacy.fields.legalBasis"
            )}
            helperText={translate(
              "resources.assets.create.dataPrivacy.fields.legalBasisHelper"
            )}
            choices={legalBasisChoices}
            fullWidth
          />
          <AutocompleteInput
            source="applicableLaw"
            label={translate("resources.assets.create.dataPrivacy.fields.law")}
            helperText={translate(
              "resources.assets.create.dataPrivacy.fields.lawHelper"
            )}
            choices={lawChoices}
            fullWidth
          />
        </SimpleFormIterator>
      </ArrayInput>
    </Box>
  );
};
