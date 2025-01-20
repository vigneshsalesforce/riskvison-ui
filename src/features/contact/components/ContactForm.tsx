// src/features/contact/components/ContactForm.tsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Modal, CircularProgress } from "@mui/material";
import DynamicForm from "../../../components/generic/DynamicForm";
import useObjectDefinitionApi from '../../common/hooks/useObjectDefinitionApi';
import {  useNavigate } from 'react-router-dom';
import {logger} from '../../../utils/logger';
import {Contact} from '../types';
import useContactApi from '../hooks/useContactApi';
import Toast from '../../../components/common/Toast';

interface ContactFormModalProps {
    open: boolean;
    onClose: () => void;
    contact?: Contact;
     onSaved: () => void;
}

const ContactForm: React.FC<ContactFormModalProps> = ({
    open,
    onClose,
    contact,
    onSaved,
}) => {
    const [fields, setFields] = useState([]);
    const [initialValues, setInitialValues] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(false);
    const { objectDefinition, isLoading, error } = useObjectDefinitionApi("contact");
    const navigate = useNavigate();
    const {createContact, updateContact} = useContactApi();


    useEffect(() => {
        if(objectDefinition && objectDefinition.fields) {
            setFields(objectDefinition.fields || []);
            setInitialValues(contact || {});
        }
    }, [objectDefinition, contact]);


    const handleSave = async (data: Record<string, any>) => {
        setLoading(true);
         try {
            if (contact?._id) {
               await updateContact.mutateAsync({id: contact._id, data});
            } else {
                 await createContact.mutateAsync(data);
            }
            onSaved();
        } catch (error: any) {
          logger.error("Error saving contact:", error);
        } finally {
            console.log("Contact saved successfully");
            setLoading(false);
            onClose();
            navigate("/contacts");
        }
    };

    const handleClose = () => {
        onClose();
        navigate("/contacts");
    }


    if(isLoading){
         return (
            <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                <CircularProgress />
            </Box>
        )
    }
    if(error) {
     return <Toast type="error" message="Error loading form data" id="contact_form"/>
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
                    {contact?._id ? "Edit Contact" : "Create Contact"}
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
                        objectName="contact"
                    />
                )}
            </Box>
        </Modal>
    );
};

export default ContactForm;