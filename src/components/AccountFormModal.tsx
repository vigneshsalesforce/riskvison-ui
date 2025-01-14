import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Modal,
  CircularProgress,
} from "@mui/material";
import api from "./../services/api";
import DynamicForm from "./DynamicForm";

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

  useEffect(() => {
    const fetchFormData = async () => {
      setLoading(true);
      try {
        
        // Fetch Object Definition (fields) and account details (if editing)
        const [definitionRes, accountRes] = await Promise.all([
          api.get(`/object/account`),
          account?._id
            ? api.get(`/account/${account._id}/view`)
            : Promise.resolve({ data: {} }),
        ]);

        console.log('Definition:', definitionRes.data);
        console.log('Account:', accountRes.data);

        // Set fields and initial values for the form
        setFields(definitionRes.data.data.fields || []);
        setInitialValues(accountRes.data.data || {});
      } catch (error) {
        console.error("Error loading form data:", error);
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
      onSaved(response.data);
    } catch (error) {
      console.error("Error saving account:", error);
    } finally {
      setLoading(false);
      onClose();
    }
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