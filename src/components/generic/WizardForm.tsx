//src/components/generic/WizardForm.tsx
import React, { useState } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import WizardDynamicForm from "./WizardDynamicForm";
import { WizardObjectDefinition } from "../../features/pra/types";
import { logger } from "../../utils/logger";

interface WizardFormProps {
  wizardObjectDefinition: WizardObjectDefinition;
  initialValues: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
  onCancel: () => void;
}

const WizardForm: React.FC<WizardFormProps> = ({
  wizardObjectDefinition,
  initialValues,
  onSubmit,
  onCancel,
}) => {
  const [activeScreen, setActiveScreen] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>(initialValues);
  const [loading, setLoading] = useState(false);

  const handleScreenSubmit = (screenData: Record<string, any>) => {
    // Merge the new screen data with existing form data
    const updatedFormData = {
      ...formData,
      ...screenData,
    };
    setFormData(updatedFormData);

    // If this is the last screen, submit the entire form
    if (activeScreen === wizardObjectDefinition.screens.length - 1) {
      handleFinalSubmit(updatedFormData);
    } else {
      // Move to next screen
      setActiveScreen((prev) => prev + 1);
    }
  };

  const handleFinalSubmit = async (data: Record<string, any>) => {
    setLoading(true);
    try {
      logger.info("Submitting form data:", data);
      await onSubmit(data);
    } catch (error) {
      logger.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    setActiveScreen((prev) => prev - 1);
  };

  const isSingleScreen = wizardObjectDefinition.screens.length === 1;

  if (isSingleScreen) {
    const allFields = wizardObjectDefinition.screens[0].sections.flatMap(
      (section) => section.fields
    );

    return (
      <Box>
        <Typography variant="h5" mb={3}>
          {wizardObjectDefinition.label}
        </Typography>
        {wizardObjectDefinition.screens[0].sections.map((section) => (
          <Box key={section.name} mb={4}>
            <Typography variant="h6" mb={2}>
              {section.name}
            </Typography>
            <WizardDynamicForm
              fields={section.fields}
              initialValues={formData}
              onSubmit={handleFinalSubmit}
              autoSave={false}
            />
          </Box>
        ))}

        <Box display="flex" justifyContent="space-between" mt={4}>
          <Button onClick={onCancel} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={() => handleFinalSubmit(formData)}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : "Save"}
          </Button>
        </Box>
      </Box>
    );
  }

  const currentScreen = wizardObjectDefinition.screens[activeScreen];
  const allFieldsInCurrentScreen = currentScreen.sections.flatMap(
    (section) => section.fields
  );

  return (
    <Box>
      <Stepper activeStep={activeScreen} alternativeLabel>
        {wizardObjectDefinition.screens.map((screen) => (
          <Step key={screen.name}>
            <StepLabel>{screen.name}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box mt={4}>
        {currentScreen.sections.map((section) => (
          <Box key={section.name} mb={4}>
            <Typography variant="h6" mb={2}>
              {section.name}
            </Typography>
            <WizardDynamicForm
              fields={section.fields}
              initialValues={formData}
              onSubmit={handleScreenSubmit}
              autoSave={false}
            />
          </Box>
        ))}
      </Box>

      <Box display="flex" justifyContent="space-between" mt={4}>
        <Button
          onClick={handlePrevious}
          variant="outlined"
          disabled={activeScreen === 0}
        >
          Previous
        </Button>
        <Button
          onClick={() => handleScreenSubmit(formData)}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {activeScreen < wizardObjectDefinition.screens.length - 1
            ? "Next"
            : loading
            ? <CircularProgress size={20} />
            : "Save"}
        </Button>
      </Box>
    </Box>
  );
};

export default WizardForm;