// src/features/contact/components/ContactList.tsx
import React, {useState} from 'react';
import GenericList from '../../../components/generic/GenericList';
import useContactApi from '../hooks/useContactApi';
import { Contact } from '../types';
import { useNavigate } from 'react-router-dom';
import ContactForm from './ContactForm';
import { Box } from '@mui/material';

const ContactList: React.FC = () => {
    const navigate = useNavigate();
    const {fetchContacts, deleteContact, updateContact} = useContactApi();
      const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

     const columns = [
        { label: 'Name', key: 'Name', isClickable: true },
        { label: 'Email', key: 'Email' },
        { label: 'Phone', key: 'Phone' },
      ];


     const handleCreate = () => {
       navigate(`/contacts/create`)
    }


    const handleEdit = (item:Contact) => {
         setSelectedContact(item)
         setIsModalOpen(true)
      }

      const handleName = (id: string) => {
        navigate(`/contact/${id}/view`)
      }

       const handleSave = () => {
        setIsModalOpen(false);
    };

    return (
       <Box>
            <GenericList<Contact>
                title='Contacts'
               objectName="contact"
                columns={columns}
                fetchData={fetchContacts}
                onDelete={deleteContact.mutate}
                deleteLoading={deleteContact.isLoading ? deleteContact.variables : null}
                onCreate={handleCreate}
               onEdit={handleEdit}
               onNameClick={handleName}
           />
              {isModalOpen && (
                <ContactForm
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    contact={selectedContact}
                    onSaved={handleSave}
                    mutation={updateContact}
                  />
              )}
       </Box>
    );
};

export default ContactList;