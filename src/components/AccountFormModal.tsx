// components/AccountFormModal.tsx

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Box, Typography, Modal, CircularProgress } from "@mui/material";
import apiService from "./../services/api";
import DynamicForm from "./DynamicForm";
import ErrorHandler from "./ErrorHandler";
import { useDispatch } from "react-redux";
import { fetchAccounts } from "../slices/accountListSlice";
import logger from "../utils/logger";
import { useToast } from "./Toast";

interface AccountFormModalProps {
    open: boolean;
    onClose: () => void;
    account?: Record<string, any>; // Used for editing
    onSaved: (account: Record<string, any>) => void; // Callback to pass saved account back to parent
}

const AccountFormModal: React.FC<AccountFormModalProps> = ({
    open,
    onClose,
    account = {},
    onSaved,
}) => {
    const [fields, setFields] = useState([]);
    const [initialValues, setInitialValues] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const objectDefinitionCache = useRef<Record<string, any | null>>({});
    const dispatch = useDispatch();
    const { showToast } = useToast();

    const fetchFormData = useCallback(async () => {
        setLoading(true);
        try {
            const definitionCacheKey = `/object/account`;
            let definitionData = null;

            if (objectDefinitionCache.current[definitionCacheKey]) {
                definitionData = objectDefinitionCache.current[definitionCacheKey];
            } else {
                const definitionRes = await apiService.get(definitionCacheKey);
                definitionData = definitionRes.data;
                objectDefinitionCache.current[definitionCacheKey] = definitionData;
            }


            // Fetch account details only if editing an existing account
            const accountRes = account?._id
                ? await apiService.get(`/account/${account._id}/view`)
                : { data: {} };

              setFields(definitionData.fields || []);
            setInitialValues(accountRes.data || {});
            setError(null);
        } catch (error: any) {
            logger.error("Error loading form data:", error);
            setError(error.message || "Error loading form data");
             showToast('error', error.message || "Error loading form data", 'Error');
        } finally {
            setLoading(false);
        }
         // eslint-disable-next-line react-hooks/exhaustive-deps
    },[account, showToast]);

    useEffect(() => {
        fetchFormData()
    }, [fetchFormData]);



    const handleSave = async (data: Record<string, any>) => {
        setLoading(true);
        try {
            let response;
            if (account?._id) {
                response = await apiService.put(`/account/${account._id}/update`, data);
            } else {
                response = await apiService.post(`/account/create`, data);
            }
            onSaved(response.data);
             showToast('success', 'Account Saved successfully', 'Success');
            setError(null);
        } catch (error: any) {
            logger.error("Error saving account:", error);
               showToast('error', error.message || "Error saving account", 'Error');
            setError(error.message || "Error saving account");
        } finally {
            setLoading(false);
            onClose();
             dispatch(fetchAccounts({page: 1, search:""}));
        }
    };


    const handleLookupData =  useCallback(async (objectName: string, searchTerm?: string) => {
        try{
              const response = await apiService.get(`/${objectName}/list`, {
                  params:{ search: searchTerm}
               });
               return response.data.data;
        } catch(e:any){
            logger.error("Error fetching lookup data", e);
            showToast('error', e.message || "Error fetching lookup data", 'Error');
          return [];
        }
         // eslint-disable-next-line react-hooks/exhaustive-deps
    },[showToast]);

    const handleCloseError = () => {
        setError(null);
    };


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
                <ErrorHandler message={error || ""} open={!!error} onClose={handleCloseError}/>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                        <CircularProgress />
                    </Box>
                ) : (
                    <DynamicForm
                        fields={fields}
                        initialValues={initialValues}
                        onSubmit={handleSave}
                       onCancel={onClose}
                       onLookupData={handleLookupData}
                    />
                )}
            </Box>
        </Modal>
    );
};

export default AccountFormModal;