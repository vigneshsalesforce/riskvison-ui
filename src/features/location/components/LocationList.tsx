// src/features/location/components/LocationList.tsx
import React, {useState} from 'react';
import GenericList from '../../../components/generic/GenericList';
import useLocationApi from '../hooks/useLocationApi';
import { Location } from '../types';
import { useNavigate } from 'react-router-dom';
import LocationForm from './LocationForm';
import { Box } from '@mui/material';

const LocationList: React.FC = () => {
    const navigate = useNavigate();
    const {fetchLocations, deleteLocation, updateLocation} = useLocationApi();
      const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

     const columns = [
        { label: 'Name', key: 'Name', isClickable: true },
        { label: 'Address', key: 'Address' },
      ];


     const handleCreate = () => {
       navigate(`/locations/create`)
    }


    const handleEdit = (item:Location) => {
         setSelectedLocation(item)
         setIsModalOpen(true)
      }

      const handleName = (id: string) => {
        navigate(`/location/${id}/view`)
      }

       const handleSave = () => {
        setIsModalOpen(false);
    };

    return (
       <Box>
            <GenericList<Location>
                title='Locations'
               objectName="location"
                columns={columns}
                fetchData={fetchLocations}
                onDelete={deleteLocation.mutate}
                deleteLoading={deleteLocation.isLoading ? deleteLocation.variables : null}
                onCreate={handleCreate}
               onEdit={handleEdit}
               onNameClick={handleName}
           />
              {isModalOpen && (
                <LocationForm
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    location={selectedLocation}
                    onSaved={handleSave}
                    mutation={updateLocation}
                  />
              )}
       </Box>
    );
};

export default LocationList;