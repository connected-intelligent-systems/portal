import { useState } from "react";
import {
  Create,
  SimpleForm,
  Toolbar,
  SaveButton,
  useNotify,
  useRedirect,
  useTranslate,
} from "react-admin";
import { useFormContext } from "react-hook-form";
import { Stepper, Step, StepLabel, Button, Box } from "@mui/material";
import {
  BasicInformationStep,
  DataAddressStep,
  OptionalFeaturesStep,
} from "../shared/steps";
import { ErrorBoundary } from "../../catalogs/DatasetCard/ErrorBoundary";

interface AssetCreateToolbarProps {
  activeStep: number;
  /* eslint-disable-next-line no-unused-vars */
  setActiveStep: (step: number) => void;
  /* eslint-disable-next-line no-unused-vars */
  markStepCompleted: (step: number) => void;
  notify: any;
  redirect: any;
  translate: any;
}

const stepRequiredFields: Record<number, string[]> = {
  0: ["title", "abstract"], // Basic Information
  1: ["dataAddress.type"], // Data Address - type is always required, other fields depend on type
  2: [], // Optional Features - no required fields
};

const AssetCreateToolbar = ({
  activeStep,
  setActiveStep,
  markStepCompleted,
  notify,
  redirect,
  translate,
  ...props
}: AssetCreateToolbarProps & any) => {
  const {
    getValues,
    formState: { errors },
  } = useFormContext();

  const checkRequiredFields = (stepIndex: number): boolean => {
    let requiredFields = stepRequiredFields[stepIndex] || [];
    const formData = getValues();

    // For step 1 (Data Address), add conditional required fields based on type
    if (stepIndex === 1) {
      const dataAddressType = formData?.dataAddress?.type;
      if (dataAddressType === "http" || dataAddressType === "HttpData") {
        requiredFields = [...requiredFields, "dataAddress.baseUrl"];
      } else if (dataAddressType === "s3" || dataAddressType === "AmazonS3") {
        requiredFields = [
          ...requiredFields,
          "dataAddress.region",
          "dataAddress.bucketName",
        ];
      }
    }

    // Check if all required fields have values
    const allFieldsFilled = requiredFields.every((field) => {
      const fieldValue = field
        .split(".")
        .reduce((obj, key) => obj?.[key], formData);
      return fieldValue && fieldValue.toString().trim() !== "";
    });

    // Check if there are no validation errors for required fields
    const noErrors = requiredFields.every((field) => {
      const fieldPath = field.split(".");
      let fieldError: any = errors;
      for (const key of fieldPath) {
        if (fieldError && typeof fieldError === "object") {
          fieldError = fieldError[key];
        } else {
          fieldError = undefined;
          break;
        }
      }
      return !fieldError;
    });

    return allFieldsFilled && noErrors;
  };

  const canAdvance = checkRequiredFields(activeStep);

  const handleNext = () => {
    if (canAdvance) {
      markStepCompleted(activeStep);
      const nextStep = activeStep + 1;
      setActiveStep(nextStep);
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
            {translate("resources.assets.create.buttons.back")}
          </Button>
        )}
      </Box>

      {/* Step 0: Basic Information - Only Next */}
      {activeStep === 0 && (
        <Button onClick={handleNext} variant="contained" disabled={!canAdvance}>
          {translate("resources.assets.create.buttons.next")}
        </Button>
      )}

      {/* Step 1: Data Address - Next */}
      {activeStep === 1 && (
        <Button onClick={handleNext} variant="contained" disabled={!canAdvance}>
          {translate("resources.assets.create.buttons.next")}
        </Button>
      )}

      {/* Step 2: Optional Features - Save */}
      {activeStep === 2 && (
        <SaveButton
          alwaysEnable
          mutationOptions={{
            onSuccess: () => {
              notify(translate("resources.assets.messages.assetCreated"));
              redirect("list", "assets");
            }
          }}
        />
      )}
    </Toolbar>
  );
};

export const AssetCreate = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const notify = useNotify();
  const redirect = useRedirect();
  const translate = useTranslate();

  const steps = [
    translate("resources.assets.create.steps.basicInformation"),
    translate("resources.assets.create.steps.dataAddress"),
    translate("resources.assets.create.steps.optionalFeatures"),
  ];

  const markStepCompleted = (stepIndex: number) => {
    setCompletedSteps((prev) => new Set(prev).add(stepIndex));
  };

  return (
    <ErrorBoundary>
      <Create>
        <SimpleForm
          toolbar={
            <AssetCreateToolbar
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              markStepCompleted={markStepCompleted}
              notify={notify}
              redirect={redirect}
              translate={translate}
            />
          }
        >
          <Box sx={{ width: "100%", mb: 2 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label, index) => (
                <Step key={label} completed={completedSteps.has(index)}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
          {activeStep === 0 && <BasicInformationStep />}
          {activeStep === 1 && <DataAddressStep />}
          {activeStep === 2 && <OptionalFeaturesStep />}
        </SimpleForm>
      </Create>
    </ErrorBoundary>
  );
};
