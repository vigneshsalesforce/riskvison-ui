// src/features/pra/components/PraView.tsx
import React, { useState } from 'react';
import GenericView from '../../../components/generic/GenericView';
import { useParams, useNavigate } from 'react-router-dom';
import usePraApi from '../hooks/usePraApi';
import PraForm from '../components/PraForm';
import { Box } from '@mui/material';
import Button from '../../../components/common/Button'
import Toast from '../../../components/common/Toast';

const PraView: React.FC = () => {
    const { praId } = useParams<{ praId: string }>();
     const navigate = useNavigate();
     const {getPropertyRiskAssessment, updatePropertyRiskAssessment} = usePraApi();
      const [isEditModalOpen, setIsEditModalOpen] = useState(false);
      const {data, error} = getPropertyRiskAssessment(praId || "");

    const handleEdit = () => {
        setIsEditModalOpen(true);
    };

    const handleSave = () => {
        setIsEditModalOpen(false);
    };
      if(error) {
           return <Toast type="error" message="Error fetching the Property Risk Assessment" id="error_pra"/>
      }

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
          <GenericView
           objectName="propertyriskassessment"
           objectId={praId || ""}
          />
          {isEditModalOpen && (
             <PraForm
                open={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                propertyRiskAssessment={data}
               onSaved={handleSave}
               mutation={updatePropertyRiskAssessment}
              />
          )}
        </Box>
    );
};

export default PraView;