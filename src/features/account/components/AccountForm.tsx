// src/features/account/components/AccountForm.tsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Modal, CircularProgress } from "@mui/material";
import DynamicForm from "../../../components/generic/DynamicForm";
import useObjectDefinitionApi from '../../common/hooks/useObjectDefinitionApi';
import {  useNavigate } from 'react-router-dom';
import {logger} from '../../../utils/logger';
import {Account} from '../types';
import useAccountApi from '../hooks/useAccountApi';
import Toast from '../../../components/common/Toast';

interface AccountFormModalProps {
    open: boolean;
    onClose: () => void;
    account?: Account;
     onSaved: () => void;
}

const AccountForm: React.FC<AccountFormModalProps> = ({
    open,
    onClose,
    account,
    onSaved,
}) => {
    const [fields, setFields] = useState([]);
    const [initialValues, setInitialValues] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(false);
    const { objectDefinition, isLoading, error } = useObjectDefinitionApi("account");
    const navigate = useNavigate();
    const {createAccount, updateAccount} = useAccountApi();


    useEffect(() => {
        if(objectDefinition && objectDefinition.fields) {
            setFields(objectDefinition.fields || []);
            setInitialValues(account || {});
        }
    }, [objectDefinition, account]);


    const handleSave = async (data: Record<string, any>) => {
        setLoading(true);
         try {
            if (account?._id) {
               await updateAccount.mutateAsync({id: account._id, data});
            } else {
                 await createAccount.mutateAsync(data);
            }
            onSaved();
        } catch (error: any) {
          logger.error("Error saving account:", error);
        } finally {
            setLoading(false);
            onClose();
        }
    };

    const handleClose = () => {
        onClose();
        navigate("/accounts");
    }


    if(isLoading){
         return (
            <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                <CircularProgress />
            </Box>
        )
    }
    if(error) {
     return <Toast type="error" message="Error loading form data" id="account_form"/>
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
                    {account?._id ? "Edit Account" : "Create Account"}
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
                        objectName="account"
                    />
                )}
            </Box>
        </Modal>
    );
};

export default AccountForm;