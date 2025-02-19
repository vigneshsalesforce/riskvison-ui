import React, { useState } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  CircularProgress,
  Typography,
  Paper,
} from "@mui/material";
import WizardDynamicForm from "./WizardDynamicForm";
import { WizardObjectDefinition } from "../../features/pra/types";
import { logger } from "../../utils/logger";
import "./WizardForm.css";

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
  const [activeSection, setActiveSection] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>(initialValues);
  const [loading, setLoading] = useState(false);

  const handleScreenSubmit = (screenData: Record<string, any>) => {
    const updatedFormData = {
      ...formData,
      ...screenData,
    };
    setFormData(updatedFormData);

    if (activeScreen === wizardObjectDefinition.screens.length - 1) {
      handleFinalSubmit(updatedFormData);
    } else {
      setActiveScreen((prev) => prev + 1);
      setActiveSection(0); // Reset section index when moving to next screen
    }
  };

  const handleSectionSubmit = (sectionData: Record<string, any>) => {
    const updatedFormData = {
      ...formData,
      ...sectionData,
    };
    setFormData(updatedFormData);

    const currentScreen = wizardObjectDefinition.screens[activeScreen];
    if (activeSection < currentScreen.sections.length - 1) {
      setActiveSection((prev) => prev + 1);
    } else {
      handleScreenSubmit(updatedFormData);
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
    if (activeSection > 0) {
      setActiveSection((prev) => prev - 1);
    } else if (activeScreen > 0) {
      setActiveScreen((prev) => prev - 1);
      const previousScreen = wizardObjectDefinition.screens[activeScreen - 1];
      setActiveSection(previousScreen.sections.length - 1);
    }
  };

  const isSingleScreen = wizardObjectDefinition.screens.length === 1;
  const currentScreen = wizardObjectDefinition.screens[activeScreen];

  if (isSingleScreen && currentScreen.sections.length === 1) {
    return (
      <Box>
        <Typography variant="h5" mb={3}>
          {wizardObjectDefinition.label}
        </Typography>
        <Paper elevation={3} sx={{ p: 4 }}>
          <WizardDynamicForm
            fields={currentScreen.sections[0].fields}
            initialValues={formData}
            onSubmit={handleFinalSubmit}
            autoSave={false}
          />
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
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" mb={3}>
        {wizardObjectDefinition.label}
      </Typography>
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Screen-level stepper */}
        <Stepper activeStep={activeScreen} alternativeLabel sx={{ mb: 4 }}>
          {wizardObjectDefinition.screens.map((screen) => (
            <Step key={screen.name}>
              <StepLabel>{screen.name}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Section-level stepper */}
        <Stepper activeStep={activeSection} alternativeLabel sx={{ mb: 4 }}>
          {currentScreen.sections.map((section) => (
            <Step key={section.name}>
              <StepLabel>{section.name}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ minHeight: "200px", mb: 4 }}>
          <Typography variant="h6" mb={2}>
            {currentScreen.sections[activeSection].name}
          </Typography>
          <WizardDynamicForm
            fields={currentScreen.sections[activeSection].fields}
            initialValues={formData}
            onSubmit={handleSectionSubmit}
            autoSave={false}
          />
        </Box>

        <Box display="flex" justifyContent="space-between" mt={4}>
          <Button
            onClick={handlePrevious}
            variant="outlined"
            disabled={activeScreen === 0 && activeSection === 0}
          >
            Previous
          </Button>
          <Button
            onClick={() => handleSectionSubmit(formData)}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {activeScreen === wizardObjectDefinition.screens.length - 1 &&
            activeSection === currentScreen.sections.length - 1 ? (
              loading ? (
                <CircularProgress size={20} />
              ) : (
                "Save"
              )
            ) : (
              "Next"
            )}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default WizardForm;