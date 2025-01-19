// src/features/location/components/LocationView.tsx
import React, { useState } from 'react';
import GenericView from '../../../components/generic/GenericView';
import { useParams, useNavigate } from 'react-router-dom';
import useLocationApi from '../hooks/useLocationApi';
import LocationForm from '../components/LocationForm';
import { Box } from '@mui/material';
import Button from '../../../components/common/Button'
import Toast from '../../../components/common/Toast';

const LocationView: React.FC = () => {
    const { locationId } = useParams<{ locationId: string }>();
     const navigate = useNavigate();
     const {getLocation, updateLocation} = useLocationApi();
      const [isEditModalOpen, setIsEditModalOpen] = useState(false);
      const {data, error} = getLocation(locationId || "");

    const handleEdit = () => {
        setIsEditModalOpen(true);
    };

    const handleSave = () => {
        setIsEditModalOpen(false);
    };
      if(error) {
           return <Toast type="error" message="Error fetching the Location" id="error_location"/>
      }

    return (
        <Box>
           <Box sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    mb: 4,
                }}>
                {locationId &&
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleEdit}
                      sx={{ textTransform: "none" }}
                  >
                      Edit Location
                    </Button>}
            </Box>
          <GenericView
           objectName="location"
           objectId={locationId || ""}
          />
          {isEditModalOpen && (
             <LocationForm
                open={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                location={data.data.data}
               onSaved={handleSave}
               mutation={updateLocation}
              />
          )}
        </Box>
    );
};

export default LocationView;