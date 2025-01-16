// src/features/contact/components/ContactView.tsx
import React, { useState } from 'react';
import GenericView from '../../../components/generic/GenericView';
import { useParams, useNavigate } from 'react-router-dom';
import useContactApi from '../hooks/useContactApi';
import ContactForm from './ContactForm';
import { Box, Button } from '@mui/material';
import Toast from '../../../components/common/Toast';
const ContactView: React.FC = () => {
    const { contactId } = useParams<{ contactId: string }>();
      const navigate = useNavigate();
    const {getContact, updateContact} = useContactApi();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
     const {data, error} = getContact(contactId || "");
    const handleEdit = () => {
        setIsEditModalOpen(true);
    };

    const handleSave = () => {
        setIsEditModalOpen(false);
    };
     if(error) {
           return <Toast type="error" message="Error fetching the contact" id="error_contact"/>
      }
    return (
        <Box>
             <Box sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    mb: 4,
                }}>
               {contactId &&
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleEdit}
                      sx={{ textTransform: "none" }}
                  >
                      Edit Contact
                    </Button>}
            </Box>
          <GenericView
             objectName="contact"
              objectId={contactId || ""}
          />
          {isEditModalOpen && (
            <ContactForm
                open={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                contact={data}
               onSaved={handleSave}
                mutation={updateContact}
            />
          )}
        </Box>
    );
};

export default ContactView;