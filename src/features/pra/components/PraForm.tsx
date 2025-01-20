// src/features/pra/components/PraForm.tsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Modal, CircularProgress } from "@mui/material";
import usePraApi from '../hooks/usePraApi';
import {  useNavigate } from 'react-router-dom';
import {logger} from '../../../utils/logger';
import {PropertyRiskAssessment, WizardObjectDefinition} from '../types';
import Toast from '../../../components/common/Toast';
import WizardForm from '../../../components/generic/WizardForm';
import useWizardObjectDefinitionApi from '../../common/hooks/useWizardObjectDefinitionApi';

interface PraFormModalProps {
    open: boolean;
    onClose: () => void;
    propertyRiskAssessment?: PropertyRiskAssessment;
     onSaved: () => void;
}

const PraForm: React.FC<PraFormModalProps> = ({
    open,
    onClose,
    propertyRiskAssessment,
    onSaved,
}) => {
    const [initialValues, setInitialValues] = useState<Record<string, any>>({});
      const [wizardObjectDefinition, setWizardObjectDefinition] = useState<WizardObjectDefinition|null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const {createPropertyRiskAssessment, updatePropertyRiskAssessment} = usePraApi();
    const {data, error, isLoading} = useWizardObjectDefinitionApi("propertyriskassessment");


      useEffect(() => {
       setInitialValues(propertyRiskAssessment || {});
         if(data){
            setWizardObjectDefinition(data)
        }
    }, [ propertyRiskAssessment,data]);


    const handleSave = async (data: Record<string, any>) => {
        setLoading(true);
         try {
            if (propertyRiskAssessment?._id) {
               await updatePropertyRiskAssessment.mutateAsync({id: propertyRiskAssessment._id, data});
            } else {
                await createPropertyRiskAssessment.mutateAsync(data);
            }
            onSaved();
        } catch (error: any) {
          logger.error("Error saving property risk assessment:", error);
        } finally {
            setLoading(false);
            onClose();
        }
    };

    const handleClose = () => {
        onClose();
        navigate("/propertyriskassessments");
    }


      if(isLoading){
         return (
            <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                <CircularProgress />
            </Box>
        )
    }

    if(error) {
     return <Toast type="error" message="Error loading form data" id="pra_form"/>
   }

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "80%",
                    maxHeight: "90%",
                    overflowY: "auto",
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <Typography variant="h5" mb={3}>
                    {propertyRiskAssessment?._id ? "Edit Property Risk Assessment" : "Create Property Risk Assessment"}
                </Typography>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                        <CircularProgress />
                    </Box>
                ) : wizardObjectDefinition ? (
                    <WizardForm
                        wizardObjectDefinition={wizardObjectDefinition}
                        initialValues={initialValues}
                        onSubmit={handleSave}
                        onCancel={handleClose}
                        objectName="propertyriskassessment"
                    />
                 ) : (
                  <div> Wizard Object Definition not found </div>
                )}
            </Box>
        </Modal>
    );
};

export default PraForm;