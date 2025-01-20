// src/features/account/components/AccountView.tsx
import React, { useState } from 'react';
import GenericView from '../../../components/generic/GenericView';
import { useParams, useNavigate } from 'react-router-dom';
import useAccountApi from '../hooks/useAccountApi';
import AccountForm from '../components/AccountForm';
import { Box } from '@mui/material';
import Button from '../../../components/common/Button'
import Toast from '../../../components/common/Toast';

const AccountView: React.FC = () => {
    const { accountId } = useParams<{ accountId: string }>();
     const navigate = useNavigate();
     const {getAccount, updateAccount} = useAccountApi();
      const [isEditModalOpen, setIsEditModalOpen] = useState(false);
      const {data, error} = getAccount(accountId || "");

    const handleEdit = () => {
        setIsEditModalOpen(true);
    };

    const handleSave = () => {
        setIsEditModalOpen(false);
    };
      if(error) {
           return <Toast type="error" message="Error fetching the Account" id="error_account"/>
      }

    return (
        <Box>
           <Box sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    mb: 4,
                }}>
                {accountId &&
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleEdit}
                      sx={{ textTransform: "none" }}
                  >
                      Edit Account
                    </Button>}
            </Box>
          <GenericView
           objectName="account"
           objectId={accountId || ""}
          />
          {isEditModalOpen && (
             <AccountForm
                open={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                account={data.data.data}
               onSaved={handleSave}
               mutation={updateAccount}
              />
          )}
        </Box>
    );
};

export default AccountView;