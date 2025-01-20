// src/features/building/components/BuildingView.tsx
import React, { useState } from 'react';
import GenericView from '../../../components/generic/GenericView';
import { useParams, useNavigate } from 'react-router-dom';
import useBuildingApi from '../hooks/useBuildingApi';
import BuildingForm from '../components/BuildingForm';
import { Box } from '@mui/material';
import Button from '../../../components/common/Button'
import Toast from '../../../components/common/Toast';

const BuildingView: React.FC = () => {
    const { buildingId } = useParams<{ buildingId: string }>();
     const navigate = useNavigate();
     const {getBuilding, updateBuilding} = useBuildingApi();
      const [isEditModalOpen, setIsEditModalOpen] = useState(false);
      const {data, error} = getBuilding(buildingId || "");

    const handleEdit = () => {
        setIsEditModalOpen(true);
    };

    const handleSave = () => {
        setIsEditModalOpen(false);
    };
      if(error) {
           return <Toast type="error" message="Error fetching the Building" id="error_building"/>
      }

    return (
        <Box>
           <Box sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    mb: 4,
                }}>
                {buildingId &&
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleEdit}
                      sx={{ textTransform: "none" }}
                  >
                      Edit Building
                    </Button>}
            </Box>
          <GenericView
           objectName="building"
           objectId={buildingId || ""}
          />
          {isEditModalOpen && (
             <BuildingForm
                open={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                building={data.data.data}
               onSaved={handleSave}
               mutation={updateBuilding}
              />
          )}
        </Box>
    );
};

export default BuildingView;