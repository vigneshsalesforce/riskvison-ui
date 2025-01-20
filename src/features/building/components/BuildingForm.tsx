// src/features/building/components/BuildingForm.tsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Modal, CircularProgress } from "@mui/material";
import DynamicForm from "../../../components/generic/DynamicForm";
import useObjectDefinitionApi from '../../common/hooks/useObjectDefinitionApi';
import {  useNavigate } from 'react-router-dom';
import {logger} from '../../../utils/logger';
import {Building} from '../types';
import useBuildingApi from '../hooks/useBuildingApi';
import Toast from '../../../components/common/Toast';

interface BuildingFormModalProps {
    open: boolean;
    onClose: () => void;
    building?: Building;
     onSaved: () => void;
}

const BuildingForm: React.FC<BuildingFormModalProps> = ({
    open,
    onClose,
    building,
    onSaved,
}) => {
    const [fields, setFields] = useState([]);
    const [initialValues, setInitialValues] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(false);
    const { objectDefinition, isLoading, error } = useObjectDefinitionApi("building");
    const navigate = useNavigate();
    const {createBuilding, updateBuilding} = useBuildingApi();


    useEffect(() => {
        if(objectDefinition && objectDefinition.fields) {
            setFields(objectDefinition.fields || []);
            setInitialValues(building || {});
        }
    }, [objectDefinition, building]);


    const handleSave = async (data: Record<string, any>) => {
        setLoading(true);
         try {
            if (building?._id) {
               await updateBuilding.mutateAsync({id: building._id, data});
            } else {
                 await createBuilding.mutateAsync(data);
            }
            onSaved();
        } catch (error: any) {
          logger.error("Error saving building:", error);
        } finally {
            setLoading(false);
            onClose();
            navigate("/buildings");
        }
    };

    const handleClose = () => {
        onClose();
        navigate("/buildings");
    }


    if(isLoading){
         return (
            <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                <CircularProgress />
            </Box>
        )
    }
    if(error) {
     return <Toast type="error" message="Error loading form data" id="building_form"/>
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
                    {building?._id ? "Edit Building" : "Create Building"}
                </Typography>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                        <CircularProgress />
                    </Box>
                ) : (
                    <DynamicForm
                        fields={fields}
                        initialValues={initialValues}
                        onSubmit={handleSave}
                         onCancel={handleClose}
                        objectName="building"
                    />
                )}
            </Box>
        </Modal>
    );
};

export default BuildingForm;