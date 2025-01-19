import React, { useState } from 'react';
import { Box, Stepper, Step, StepLabel, Button, CircularProgress, Typography } from '@mui/material';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import WizardDynamicForm from './WizardDynamicForm';
import { Screen, WizardObjectDefinition } from '../../features/pra/types';
import './WizardForm.css';

interface WizardFormProps {
  wizardObjectDefinition: WizardObjectDefinition;
  initialValues: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
  onCancel: () => void;
  objectName: string;
}

const WizardForm: React.FC<WizardFormProps> = ({
  wizardObjectDefinition,
  initialValues,
  onSubmit,
  onCancel,
  objectName,
}) => {
  const [activeScreen, setActiveScreen] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>(initialValues);
  const [loading, setLoading] = useState(false);

  const handleNext = async (currentScreenData: Record<string, any>) => {
    setLoading(true);
    try {
      setFormData({ ...formData, ...currentScreenData });
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate async operation
      setActiveScreen((prevActiveStep) => prevActiveStep + 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate async operation
      setActiveScreen((prevActiveStep) => prevActiveStep - 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate async operation
      onSubmit(formData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!wizardObjectDefinition) {
    return <div>Loading...</div>;
  }

  return (
    <Box>
      <Box mt={2}>
        <Stepper activeStep={activeScreen} alternativeLabel>
          {wizardObjectDefinition.screens.map((screen: Screen) => (
            <Step key={screen.name}>
              <StepLabel>{screen.name}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      <Box p={2} mt={2}>
        <TransitionGroup component={null}>
          <CSSTransition key={activeScreen} timeout={500} classNames="slide">
            <Box>
              {wizardObjectDefinition.screens[activeScreen]?.sections.map((section) => (
                <Box key={section.name} mb={3}>
                  <Typography variant="h6" mb={2}>
                    {section.name}
                  </Typography>
                  <WizardDynamicForm
                    fields={section.fields}
                    initialValues={formData}
                    onSubmit={handleNext}
                  />
                </Box>
              ))}
            </Box>
          </CSSTransition>
        </TransitionGroup>
      </Box>
      <Box display="flex" justifyContent="space-between" mt={2} p={2}>
        <Button onClick={handleCancel} variant="contained" color="inherit">
          Cancel
        </Button>
        <Box>
          {activeScreen > 0 && (
            <Button onClick={handlePrevious} variant="contained" color="primary" disabled={loading}>
              Previous
            </Button>
          )}
          {loading && <CircularProgress size={20} sx={{ marginLeft: '10px' }} />}
          {activeScreen < wizardObjectDefinition.screens.length - 1 ? (
            <Button
              onClick={() => handleNext(formData)}
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ marginLeft: '10px' }}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSave}
              variant="contained"
              color="success"
              disabled={loading}
              sx={{ marginLeft: '10px' }}
            >
              Save
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default WizardForm;