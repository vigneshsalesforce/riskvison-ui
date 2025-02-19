// src/features/pra/components/PraView.tsx
import React, { useState, useEffect } from 'react';
import GenericView from '../../../components/generic/GenericView';
import { useParams, useNavigate } from 'react-router-dom';
import usePraApi from '../hooks/usePraApi';
import PraForm from '../components/PraForm';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import Button from '../../../components/common/Button'
import Toast from '../../../components/common/Toast';
import { WizardObjectDefinition, Field } from '../types';
import useWizardObjectDefinitionApi from '../../common/hooks/useWizardObjectDefinitionApi';

const PraView: React.FC = () => {
    const { praId } = useParams<{ praId: string }>();
    const navigate = useNavigate();
    const { getPropertyRiskAssessment, updatePropertyRiskAssessment } = usePraApi();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const { data: praData, error } = getPropertyRiskAssessment(praId || "");
    const { data: wizardData, error: wizardError, isLoading } = useWizardObjectDefinitionApi("propertyriskassessment");
    const [wizardObjectDefinition, setWizardObjectDefinition] = useState<WizardObjectDefinition | null>(null);

    useEffect(() => {
        if (wizardData) {
            setWizardObjectDefinition(wizardData);
        }
    }, [wizardData]);

    const handleEdit = () => {
        setIsEditModalOpen(true);
    };

    const handleSave = () => {
        setIsEditModalOpen(false);
    };

    if (error || wizardError) {
        return <Toast type="error" message="Error fetching the Property Risk Assessment" id="error_pra" />;
    }
    if(isLoading){
         return (
            <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                {/* <CircularProgress /> */}
            </Box>
        )
    }


    const renderFieldValue = (field: Field, value: any) => {
        if (value === null || value === undefined) {
            return <Typography variant="body2" color="text.secondary"> - </Typography>;
        }


         if(field.type === 'date'){
            try {
                const date = new Date(value);
                return  <Typography variant="body2" >{date.toLocaleDateString()}</Typography>
           } catch (e) {
                 return  <Typography variant="body2" >{value}</Typography>
           }

        }
        if(field.type === 'datetime'){
          try {
                const date = new Date(value);
                return <Typography variant="body2" >{date.toLocaleString()}</Typography>
           } catch (e) {
                 return  <Typography variant="body2" >{value}</Typography>
           }
        }
          if(field.type === 'time'){
          try {
                const date = new Date(value);
                return <Typography variant="body2" >{date.toLocaleTimeString()}</Typography>
           } catch (e) {
                 return  <Typography variant="body2" >{value}</Typography>
           }
        }

        if (field.type === 'checkbox') {
            return  <Typography variant="body2" >{value ? 'Yes' : 'No'}</Typography>
        }

        return  <Typography variant="body2" >{value}</Typography>
    };

    return (
        <Box>
            <Box sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                mb: 4,
            }}>
                {praId &&
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleEdit}
                        sx={{ textTransform: "none" }}
                    >
                        Edit Property Risk Assessment
                    </Button>}
            </Box>
            <Card>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Property Risk Assessment Details
                    </Typography>

                    {praData?.data && wizardObjectDefinition && (
                        <Grid container spacing={3}>
                            {wizardObjectDefinition.screens.map((screen) =>
                                screen.sections.map((section) => (
                                    <React.Fragment key={section.name}>
                                          <Grid item xs={12}>
                                            <Typography variant="h6" mt={2} mb={1}>{section.name}</Typography>
                                        </Grid>

                                        {section.fields.map((field) => (
                                            <Grid item xs={12} md={6} key={field.name}>
                                               <Typography variant="subtitle1" >{field.label}</Typography>
                                               {renderFieldValue(field, praData.data[field.name])}
                                            </Grid>
                                        ))}
                                    </React.Fragment>
                                ))
                            )}
                        </Grid>
                    )}
                </CardContent>
            </Card>



            {isEditModalOpen && (
                <PraForm
                    open={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    propertyRiskAssessment={praData?.data}
                    onSaved={handleSave}
                    mutation={updatePropertyRiskAssessment}
                />
            )}
        </Box>
    );
};

export default PraView;