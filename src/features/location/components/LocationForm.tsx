// src/features/location/components/LocationForm.tsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Modal, CircularProgress } from "@mui/material";
import DynamicForm from "../../../components/generic/DynamicForm";
import useObjectDefinitionApi from '../../common/hooks/useObjectDefinitionApi';
import {  useNavigate } from 'react-router-dom';
import {logger} from '../../../utils/logger';
import {Location} from '../types';
import useLocationApi from '../hooks/useLocationApi';
import Toast from '../../../components/common/Toast';

interface LocationFormModalProps {
    open: boolean;
    onClose: () => void;
    location?: Location;
     onSaved: () => void;
}

const LocationForm: React.FC<LocationFormModalProps> = ({
    open,
    onClose,
    location,
    onSaved,
}) => {
    const [fields, setFields] = useState([]);
    const [initialValues, setInitialValues] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(false);
    const { objectDefinition, isLoading, error } = useObjectDefinitionApi("location");
    const navigate = useNavigate();
    const {createLocation, updateLocation} = useLocationApi();


    useEffect(() => {
        if(objectDefinition && objectDefinition.fields) {
            setFields(objectDefinition.fields || []);
            setInitialValues(location || {});
        }
    }, [objectDefinition, location]);


    const handleSave = async (data: Record<string, any>) => {
        setLoading(true);
         try {
            if (location?._id) {
               await updateLocation.mutateAsync({id: location._id, data});
            } else {
                 await createLocation.mutateAsync(data);
            }
            onSaved();
        } catch (error: any) {
          logger.error("Error saving location:", error);
        } finally {
            setLoading(false);
            onClose();
            navigate("/locations");
        }
    };

    const handleClose = () => {
        onClose();
        navigate("/locations");
    }


    if(isLoading){
         return (
            <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                <CircularProgress />
            </Box>
        )
    }
    if(error) {
     return <Toast type="error" message="Error loading form data" id="location_form"/>
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
                    {location?._id ? "Edit Location" : "Create Location"}
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
                        objectName="location"
                    />
                )}
            </Box>
        </Modal>
    );
};

export default LocationForm;