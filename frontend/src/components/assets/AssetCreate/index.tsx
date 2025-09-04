import { useState } from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  ArrayInput,
  SimpleFormIterator,
  DateInput,
  required,
  Toolbar,
  SaveButton,
  useNotify,
  useRedirect,
  AutocompleteInput,
} from "react-admin";
import { MarkdownInput } from "../../markdown";
import { useFormContext } from "react-hook-form";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Box,
  Link,
  Chip,
} from "@mui/material";
import { transformData } from "./helpers";
import { DataPrivacy } from "./DataPrivacy";
import { ProvenanceInput } from "./ProvenanceInput";
import { DataQuality } from "./DataQuality";
import { DataAddress } from "./DataAddress";

const steps = [
  "Basic Information",
  "Versioning",
  "Provenance",
  "Data Privacy",
  "Data Quality",
  "Data Address",
];

const stepRequiredFields: Record<number, string[]> = {
  0: ["properties.dct:title"], // Basic Information
  1: [], // Versioning - no required fields
  2: [], // Provenance - no required fields
  3: [], // Data Privacy - no required fields
  4: [], // Data Quality - no required fields
  5: ["dataAddress.type"], // Data Address - requires data address type
};

const categoryChoices = [
  { id: "File", name: "File" },
  { id: "Service", name: "Service" },
  { id: "TimeSeries", name: "Time Series" },
  { id: "Geospatial", name: "Geospatial" },
  { id: "Text", name: "Text" },
  { id: "Tabular", name: "Tabular" },
  { id: "Scientific", name: "Scientific" },
];

const mediaTypeChoices = [
  { id: "text/csv", name: "CSV" },
  { id: "application/json", name: "JSON" },
  { id: "application/xml", name: "XML" },
  { id: "application/yaml", name: "YAML" },
  { id: "application/vnd.apache.parquet", name: "Parquet" },
  { id: "application/x-hdf5", name: "HDF5" },
  { id: "application/avro", name: "Avro" },
  { id: "application/orc", name: "ORC" },
];

const AssetCreateToolbar = ({
  activeStep,
  setActiveStep,
  markStepCompleted,
  setMaxReachedStep,
  ...props
}: any) => {
  const { getValues } = useFormContext();

  const checkRequiredFields = (stepIndex: number): boolean => {
    const requiredFields = stepRequiredFields[stepIndex] || [];
    const formData = getValues();

    return requiredFields.every((field) => {
      const fieldValue = field
        .split(".")
        .reduce((obj, key) => obj?.[key], formData);
      return fieldValue && fieldValue.toString().trim() !== "";
    });
  };

  const canAdvance = checkRequiredFields(activeStep);

  const handleNext = () => {
    if (canAdvance) {
      markStepCompleted(activeStep);
      const nextStep = activeStep + 1;
      setActiveStep(nextStep);
      setMaxReachedStep((prev: number) => Math.max(prev, nextStep));
    }
  };

  const handleBack = () => {
    setActiveStep((prev: number) => prev - 1);
  };

  return (
    <Toolbar {...props}>
      <Box sx={{ flex: "1 1 auto" }}>
        {activeStep > 0 && (
          <Button onClick={handleBack} sx={{ mr: 1 }}>
            Back
          </Button>
        )}
      </Box>
      {activeStep < steps.length - 1 && (
        <Button
          onClick={handleNext}
          variant="contained"
          disabled={!canAdvance}
          sx={{
            ...(canAdvance ? {} : { opacity: 0.6 }),
          }}
        >
          Next
        </Button>
      )}
      {activeStep === steps.length - 1 && (
        <SaveButton
          type="button"
          transform={(data) => transformData(data)}
          label="Save"
        />
      )}
    </Toolbar>
  );
};

export const AssetCreate = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [maxReachedStep, setMaxReachedStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const notify = useNotify();
  const redirect = useRedirect();

  const handleStepClick = (stepIndex: number) => {
    // Allow navigation to any step up to the furthest reached step
    if (stepIndex <= maxReachedStep) {
      setActiveStep(stepIndex);
    }
  };

  const markStepCompleted = (stepIndex: number) => {
    setCompletedSteps((prev) => new Set(prev).add(stepIndex));
  };

  const onSuccess = () => {
    notify("Asset created successfully");
    redirect("list", "assets");
  };

  return (
    <Create mutationOptions={{ onSuccess }}>
      <SimpleForm
        toolbar={
          <AssetCreateToolbar
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            markStepCompleted={markStepCompleted}
            setMaxReachedStep={setMaxReachedStep}
          />
        }
      >
        <Box sx={{ width: "100%", mb: 2 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => {
              const requiredCount = stepRequiredFields[index]?.length || 0;
              const hasRequired = requiredCount > 0;
              const isClickable = index <= maxReachedStep;

              return (
                <Step key={label} completed={completedSteps.has(index)}>
                  <StepLabel
                    sx={{
                      cursor: isClickable ? "pointer" : "default",
                      "& .MuiStepLabel-label": {
                        color: isClickable
                          ? "primary.main !important"
                          : "text.disabled !important",
                        fontWeight: isClickable ? "normal" : "normal",
                      },
                      "& .MuiStepLabel-iconContainer": {
                        color: isClickable ? "primary.main" : "text.disabled",
                      },
                      "& .MuiStepIcon-root": {
                        color: isClickable ? "primary.main" : "text.disabled",
                      },
                    }}
                    onClick={() => handleStepClick(index)}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      <span>{label}</span>
                      {hasRequired && (
                        <Chip
                          label={`${requiredCount} required`}
                          size="small"
                          color={
                            completedSteps.has(index) ? "success" : "default"
                          }
                          variant="outlined"
                          sx={{ fontSize: "0.6rem", height: 16 }}
                        />
                      )}
                      {!hasRequired && (
                        <Chip
                          label="optional"
                          size="small"
                          color="default"
                          variant="outlined"
                          sx={{ fontSize: "0.6rem", height: 16 }}
                        />
                      )}
                    </Box>
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>
        </Box>

        {activeStep === 0 && (
          <>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
            <TextInput
              source="properties.dct:title"
              label="Title"
              helperText='A name given to the dataset. E.g., "Weather Observations Dataset"'
              validate={required()}
              fullWidth
            />
            <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
              Description
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              A free-text account of the dataset. Supports Markdown formatting.
              E.g., "Hourly temperature and humidity readings collected from IoT
              sensors."
            </Typography>
            <MarkdownInput source="properties.dct:description" />
            <ArrayInput
              source="properties.dcat:keyword"
              label="Keywords"
              sx={{ mt: 3 }}
            >
              <SimpleFormIterator>
                <TextInput
                  source=""
                  label="Keyword"
                  helperText='A keyword or tag describing the dataset. E.g., "weather", "temperature"'
                />
              </SimpleFormIterator>
            </ArrayInput>
            <AutocompleteInput
              source="properties.dcat:theme.dct:title"
              label="Category"
              helperText="A main category of the dataset."
              choices={categoryChoices}
              fullWidth
            />
            <AutocompleteInput
              source="properties.dcat:mediaType"
              label="Media Type"
              helperText="The media type of the dataset distribution."
              choices={mediaTypeChoices}
              fullWidth
            />
          </>
        )}

        {activeStep === 1 && (
          <>
            <Typography variant="h6" gutterBottom>
              Versioning
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Specify versioning and metadata information for this asset, based
              on Dublin Core Terms and OWL vocabularies. For more information,
              see{" "}
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
              source="properties.owl:versionInfo"
              label="Version"
              helperText="The version of the dataset."
              fullWidth
            />
            <TextInput
              source="properties.dct:creator.schema:name"
              label="Creator"
              helperText="An entity primarily responsible for making the dataset."
              fullWidth
            />
            <DateInput
              source="properties.dct:created"
              label="Created"
              helperText="The date of creation of the dataset."
              fullWidth
            />
            <DateInput
              source="properties.dct:modified"
              label="Modified"
              helperText="The date of the last modification of the dataset."
              fullWidth
            />
            <ArrayInput
              source="properties.dct:hasVersion"
              label="Previous Versions"
            >
              <SimpleFormIterator>
                <TextInput
                  source="owl:versionInfo"
                  label="Version"
                  helperText="The version number of a previous version."
                />
                <DateInput
                  source="dct:issued"
                  label="Issued"
                  helperText="The date of issuance of a previous version."
                />
              </SimpleFormIterator>
            </ArrayInput>
          </>
        )}

        {activeStep === 2 && (
          <>
            <Typography variant="h6" gutterBottom>
              Provenance
            </Typography>
            <ProvenanceInput />
          </>
        )}

        {activeStep === 3 && (
          <>
            <Typography variant="h6" gutterBottom>
              Data Privacy
            </Typography>
            <DataPrivacy />
          </>
        )}

        {activeStep === 4 && (
          <>
            <Typography variant="h6" gutterBottom>
              Data Quality
            </Typography>
            <DataQuality />
          </>
        )}

        {activeStep === 5 && (
          <>
            <Typography variant="h6" gutterBottom>
              Data Address
            </Typography>
            <DataAddress />
          </>
        )}
      </SimpleForm>
    </Create>
  );
};
