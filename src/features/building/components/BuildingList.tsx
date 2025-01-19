// src/features/building/components/BuildingList.tsx
import React, {useState} from 'react';
import GenericList from '../../../components/generic/GenericList';
import useBuildingApi from '../hooks/useBuildingApi';
import { Building } from '../types';
import { useNavigate } from 'react-router-dom';
import BuildingForm from './BuildingForm';
import { Box } from '@mui/material';

const BuildingList: React.FC = () => {
    const navigate = useNavigate();
    const {fetchBuildings, deleteBuilding, updateBuilding} = useBuildingApi();
      const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

     const columns = [
        { label: 'Name', key: 'Name', isClickable: true },
        { label: 'Address', key: 'Address' },
      ];


     const handleCreate = () => {
       navigate(`/buildings/create`)
    }


    const handleEdit = (item:Building) => {
         setSelectedBuilding(item)
         setIsModalOpen(true)
      }

      const handleName = (id: string) => {
        navigate(`/building/${id}/view`)
      }

       const handleSave = () => {
        setIsModalOpen(false);
    };

    return (
       <Box>
            <GenericList<Building>
                title='Buildings'
               objectName="building"
                columns={columns}
                fetchData={fetchBuildings}
                onDelete={deleteBuilding.mutate}
                deleteLoading={deleteBuilding.isLoading ? deleteBuilding.variables : null}
                onCreate={handleCreate}
               onEdit={handleEdit}
               onNameClick={handleName}
           />
              {isModalOpen && (
                <BuildingForm
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    building={selectedBuilding}
                    onSaved={handleSave}
                    mutation={updateBuilding}
                  />
              )}
       </Box>
    );
};

export default BuildingList;