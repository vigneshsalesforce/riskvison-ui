// src/features/account/components/AccountList.tsx
import React, {useState} from 'react';
import GenericList from '../../../components/generic/GenericList';
import useAccountApi from '../hooks/useAccountApi';
import { Account } from '../types';
import { useNavigate } from 'react-router-dom';
import AccountForm from './AccountForm';
import { Box } from '@mui/material';

const AccountList: React.FC = () => {
    const navigate = useNavigate();
    const {fetchAccounts, deleteAccount, updateAccount} = useAccountApi();
      const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

     const columns = [
        { label: 'Name', key: 'Name', isClickable: true },
        { label: 'Address', key: 'BillingStreet' },
        { label: 'Phone', key: 'Phone' },
      ];


     const handleCreate = () => {
       navigate(`/accounts/create`)
    }


    const handleEdit = (item:Account) => {
         setSelectedAccount(item)
         setIsModalOpen(true)
      }

      const handleName = (id: string) => {
        navigate(`/account/${id}/view`)
      }

       const handleSave = () => {
        setIsModalOpen(false);
    };

    return (
       <Box>
            <GenericList<Account>
                title='Accounts'
               objectName="account"
                columns={columns}
                fetchData={fetchAccounts}
                onDelete={deleteAccount.mutate}
                deleteLoading={deleteAccount.isLoading ? deleteAccount.variables : null}
                onCreate={handleCreate}
               onEdit={handleEdit}
               onNameClick={handleName}
           />
              {isModalOpen && (
                <AccountForm
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    account={selectedAccount}
                    onSaved={handleSave}
                    mutation={updateAccount}
                  />
              )}
       </Box>
    );
};

export default AccountList;