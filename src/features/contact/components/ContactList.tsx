// src/features/contact/components/ContactList.tsx
import React from 'react';
import GenericList from '../../../components/generic/GenericList';
import useContactApi from '../hooks/useContactApi';
import { Contact } from '../types';
import { useNavigate } from 'react-router-dom';

const ContactList: React.FC = () => {
    const navigate = useNavigate();
    const {fetchContacts, deleteContact} = useContactApi();
     const columns = [
        { label: 'Name', key: 'Name', isClickable: true },
        { label: 'Email', key: 'email' },
         {label: 'Phone', key: 'phone'}
      ];

    const handleCreate = () => {
       navigate("/contacts/create")
    }

    return (
        <GenericList<Contact>
            objectName="contact"
            columns={columns}
            fetchData={fetchContacts}
            onDelete={deleteContact.mutate}
            deleteLoading={deleteContact.isLoading ? deleteContact.variables : null}
           onCreate={handleCreate}
        />
    );
};

export default ContactList;