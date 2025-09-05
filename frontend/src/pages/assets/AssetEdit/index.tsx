import { useState } from "react";
import {
  Edit,
  SimpleForm,
  Toolbar,
  SaveButton,
  useNotify,
  useRedirect,
  useTranslate,
  useRecordContext,
} from "react-admin";
import { useFormContext } from "react-hook-form";
import { Stepper, Step, StepLabel, Button, Box, Chip } from "@mui/material";
import * as assets from "../../../dataProvider/resources/assets";
import {
  BasicInformationStep,
  DataAddressStep,
  VersioningStep,
  DetailedDescriptionStep,
  ProvenanceStep,
  DataPrivacyStep,
  DataQualityStep,
} from "../shared/steps";
import { TranslatedErrorBoundary } from "../ErrorBoundary";

interface AssetEditToolbarProps {
  activeStep: number;
  /* eslint-disable-next-line no-unused-vars */
  setActiveStep: (step: number) => void;
  /* eslint-disable-next-line no-unused-vars */
  markStepCompleted: (step: number) => void;
  /* eslint-disable-next-line no-unused-vars */
  setMaxReachedStep: (setter: (prev: number) => number) => void;
  /* eslint-disable-next-line no-unused-vars */
  onUpdateAssetNow: (formData: any) => void;
}

const steps = [
  "Basic Information",
  "Data Address",
  "Versioning",
  "Detailed Description",
  "Provenance",
  "Data Privacy",
  "Data Quality",
];

const stepRequiredFields: Record<number, string[]> = {
  0: ["title", "abstract"], // Basic Information
  1: ["dataAddress.type"], // Data Address - requires data address type
  2: [], // Versioning - no required fields
  3: [], // Detailed Description - no required fields
  4: [], // Provenance - no required fields
  5: [], // Data Privacy - no required fields
  6: [], // Data Quality - no required fields
};

const AssetEditToolbar = ({
  activeStep,
  setActiveStep,
  markStepCompleted,
  setMaxReachedStep,
  onUpdateAssetNow,
  ...props
}: AssetEditToolbarProps & any) => {
  const { getValues } = useFormContext();
  const translate = useTranslate();

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

  const handleUpdateAssetNow = () => {
    if (onUpdateAssetNow) {
      const formData = getValues();
      onUpdateAssetNow(formData);
    }
  };

  return (
    <Toolbar {...props}>
      <Box sx={{ flex: "1 1 auto" }}>
        {activeStep > 0 && (
          <Button onClick={handleBack} sx={{ mr: 1 }}>
            {translate("resources.assets.edit.buttons.back")}
          </Button>
        )}
      </Box>

      {/* Smart toolbar for Data Address step (step 1) */}
      {activeStep === 1 && canAdvance && (
        <>
          <Button onClick={handleNext} variant="outlined" sx={{ mr: 1 }}>
            {translate("resources.assets.edit.buttons.next")}
          </Button>
          <Button onClick={handleUpdateAssetNow} variant="contained">
            {translate("resources.assets.edit.buttons.updateAssetNow")}
          </Button>
        </>
      )}

      {/* Regular Next button for other steps */}
      {activeStep < steps.length - 1 && activeStep !== 1 && (
        <Button
          onClick={handleNext}
          variant="contained"
          disabled={!canAdvance}
          sx={{
            ...(canAdvance ? {} : { opacity: 0.6 }),
          }}
        >
          {translate("resources.assets.edit.buttons.next")}
        </Button>
      )}

      {/* Final save button */}
      {activeStep === steps.length - 1 && (
        <SaveButton
          type="button"
          label={translate("resources.assets.edit.buttons.save")}
        />
      )}
    </Toolbar>
  );
};

export const AssetEdit = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [maxReachedStep, setMaxReachedStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const notify = useNotify();
  const redirect = useRedirect();
  const translate = useTranslate();
  const record = useRecordContext();

  const steps = [
    translate("resources.assets.edit.steps.basicInformation"),
    translate("resources.assets.edit.steps.dataAddress"),
    translate("resources.assets.edit.steps.versioning"),
    translate("resources.assets.edit.steps.detailedDescription"),
    translate("resources.assets.edit.steps.provenance"),
    translate("resources.assets.edit.steps.dataPrivacy"),
    translate("resources.assets.edit.steps.dataQuality"),
  ];

  const handleStepClick = (stepIndex: number) => {
    // Allow navigation to any step up to the furthest reached step
    if (stepIndex <= maxReachedStep) {
      setActiveStep(stepIndex);
    }
  };

  const markStepCompleted = (stepIndex: number) => {
    setCompletedSteps((prev) => new Set(prev).add(stepIndex));
  };

  const handleUpdateAssetNow = async (formData: any) => {
    try {
      await assets.update({
        id: record?.id || record?.["@id"],
        data: formData,
        previousData: record,
      });

      notify(translate("resources.assets.messages.assetUpdated"));

      // Redirect to assets list or asset view
      redirect("list", "assets");
    } catch (error) {
      console.error("Asset update failed:", error);
      notify(translate("resources.assets.messages.assetUpdateFailed"), {
        type: "error",
      });
    }
  };

  const onSuccess = () => {
    notify(translate("resources.assets.messages.assetUpdated"));
    redirect("list", "assets");
  };

  return (
    <TranslatedErrorBoundary>
      <Edit mutationOptions={{ onSuccess }}>
        <SimpleForm
          toolbar={
            <AssetEditToolbar
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              markStepCompleted={markStepCompleted}
              setMaxReachedStep={setMaxReachedStep}
              onUpdateAssetNow={handleUpdateAssetNow}
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
                            label={`${requiredCount} ${translate(
                              "resources.assets.edit.chips.required"
                            )}`}
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
                            label={translate(
                              "resources.assets.edit.chips.optional"
                            )}
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
          {activeStep === 0 && <BasicInformationStep />}
          {activeStep === 1 && <DataAddressStep />}
          {activeStep === 2 && <VersioningStep />}
          {activeStep === 3 && <DetailedDescriptionStep />}
          {activeStep === 4 && <ProvenanceStep />}
          {activeStep === 5 && <DataPrivacyStep />}
          {activeStep === 6 && <DataQualityStep />}
        </SimpleForm>
      </Edit>
    </TranslatedErrorBoundary>
  );
};
