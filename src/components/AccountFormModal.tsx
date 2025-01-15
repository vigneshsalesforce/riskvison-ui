import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Modal, CircularProgress } from "@mui/material";
import api from "./../services/api";
import DynamicForm from "./DynamicForm";
import ErrorHandler from "./ErrorHandler";
import { useDispatch } from "react-redux";
import { fetchAccounts } from "../slices/accountListSlice";

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


    useEffect(() => {
        const fetchFormData = async () => {
            setLoading(true);
            try {
                const definitionCacheKey = `/object/account`;
                let definitionData = null;

                if (objectDefinitionCache.current[definitionCacheKey]) {
                    definitionData = objectDefinitionCache.current[definitionCacheKey];
                } else {
                    const definitionRes = await api.get(definitionCacheKey);
                    definitionData = definitionRes.data.data;
                    objectDefinitionCache.current[definitionCacheKey] = definitionData;
                }

                // Fetch account details only if editing an existing account
                const accountRes = account?._id
                    ? await api.get(`/account/${account._id}/view`)
                    : { data: { data: {} } };


                setFields(definitionData.fields || []);
                setInitialValues(accountRes.data.data || {});
                setError(null);
            } catch (error: any) {
                console.error("Error loading form data:", error);
                setError(error.message || "Error loading form data");
            } finally {
                setLoading(false);
            }
        };

        fetchFormData();
    }, [account]);

    const handleSave = async (data: Record<string, any>) => {
        setLoading(true);
        try {
            let response;
            if (account?._id) {
                response = await api.put(`/account/${account._id}/update`, data);
            } else {
                response = await api.post(`/account/create`, data);
            }
            onSaved(response.data.data);
            setError(null);
        } catch (error: any) {
            console.error("Error saving account:", error);
            setError(error.message || "Error saving account");
        } finally {
            setLoading(false);
            onClose();
        dispatch(fetchAccounts({page: 1, search:""})); // Dispatch fetchAccounts after save
        }
    };

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
                    />
                )}
            </Box>
        </Modal>
    );
};

export default AccountFormModal;