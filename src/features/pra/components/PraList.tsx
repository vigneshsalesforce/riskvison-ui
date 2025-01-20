// src/features/pra/components/PraList.tsx
import React, {useState} from 'react';
import GenericList from '../../../components/generic/GenericList';
import usePraApi from '../hooks/usePraApi';
import { PropertyRiskAssessment } from '../types';
import { useNavigate } from 'react-router-dom';
import PraForm from './PraForm';
import { Box } from '@mui/material';

const PraList: React.FC = () => {
    const navigate = useNavigate();
    const {fetchPropertyRiskAssessments, deletePropertyRiskAssessment, updatePropertyRiskAssessment} = usePraApi();
      const [selectedPropertyRiskAssessment, setSelectedPropertyRiskAssessment] = useState<PropertyRiskAssessment | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

     const columns = [
        { label: 'Name', key: 'PropertyRiskAssessmentName' , isClickable: true },
      ];


     const handleCreate = () => {
       navigate(`/propertyriskassessments/create`)
    }


    const handleEdit = (item:PropertyRiskAssessment) => {
         setSelectedPropertyRiskAssessment(item)
         setIsModalOpen(true)
      }

      const handleName = (id: string) => {
        navigate(`/propertyriskassessment/${id}/view`)
      }

       const handleSave = () => {
        setIsModalOpen(false);
    };

    return (
       <Box>
            <GenericList<PropertyRiskAssessment>
                title='Property Risk Assessments'
               objectName="propertyriskassessment"
                columns={columns}
                fetchData={fetchPropertyRiskAssessments}
                onDelete={deletePropertyRiskAssessment.mutate}
                deleteLoading={deletePropertyRiskAssessment.isLoading ? deletePropertyRiskAssessment.variables : null}
                onCreate={handleCreate}
               onEdit={handleEdit}
               onNameClick={handleName}
           />
              {isModalOpen && (
                <PraForm
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    propertyRiskAssessment={selectedPropertyRiskAssessment}
                    onSaved={handleSave}
                    mutation={updatePropertyRiskAssessment}
                  />
              )}
       </Box>
    );
};

export default PraList;