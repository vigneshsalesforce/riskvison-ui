// pages/Accounts/AccountView.tsx

import React, {  useState } from "react";
import {
    Box,
    Typography,
    CircularProgress,
    Grid,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Link,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import AccountFormModal from "../../components/AccountFormModal";
import ErrorHandler from "../../components/ErrorHandler";
import useEntityData from "../../hooks/useEntityData";


interface Field {
    name: string;
    label: string;
    type: string;
    required: boolean;
    options?: {
        static?: string[];
        dynamic?: {
            objectName: string;
            displayField: string;
            valueField: string;
        };
    };
}



const AccountView: React.FC = () => {
    const { accountId } = useParams<{ accountId: string }>();
    const navigate = useNavigate();


    const {
        entity: account,
        objectDefinition,
        loading,
        error,
        clearError,
        lookupValues,
    } = useEntityData<{_id:string, Name: string, Type: string}>({
          objectName: "account",
          entityId: accountId
    });


    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleEdit = () => {
        setIsEditModalOpen(true);
    };



     const formatFieldValue = (field: Field, value: any): React.ReactNode => {
        if (value === null || value === undefined) return " ";
        if (typeof value === "boolean") return value ? "Yes" : "No";
        if (Array.isArray(value)) return value.join(", ");


        if (field.type === "lookup" && field.options?.dynamic) {
          const {  valueField } = field.options.dynamic;
          const lookupId = account?.[field.name];

          const displayValue = lookupValues[field.name] || lookupId;
            return (
                <Link
                    component="button"
                    onClick={() => navigate(`/accounts/${lookupId}/view`)}
                    sx={{
                        textDecoration: "underline",
                        cursor: "pointer",
                        color: "primary.main"
                    }}
                >
                    {displayValue}
                </Link>
            );
        }

      return String(value);
    };

    const handleSave = (updatedAccount: Record<string, any>) => {
        setIsEditModalOpen(false);
         // setAccount(updatedAccount);
    };


    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="300px"
            >
                <CircularProgress />
            </Box>
        );
    }

    if (!account || !objectDefinition) {
        return (
            <Box p={4}>
                <Typography variant="h6" color="textSecondary">
                    Account not found or object definition missing.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4, maxWidth: "1200px", margin: "0 auto" }}>
            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 4,
                }}
            >
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
                        {account.Name || "Unnamed Account"}
                    </Typography>
                    {account.Type && (
                        <Chip
                            label={account.Type}
                            color="primary"
                            variant="outlined"
                            size="small"
                        />
                    )}
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleEdit}
                    sx={{ textTransform: "none" }}
                >
                    Edit Account
                </Button>
            </Box>
             <ErrorHandler message={error || ""} open={!!error} onClose={clearError}/>

            {/* Account Details */}
            <Card elevation={2}>
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: "medium" }}>
                        Account Information
                    </Typography>
                    <Divider sx={{ mb: 3 }} />

                    <Grid container spacing={3}>
                        {objectDefinition.fields?.length ? (
                            objectDefinition.fields.map((field) => (
                                <Grid item xs={12} sm={6} md={4} key={field.name}>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                fontWeight: "bold",
                                                color: "text.secondary",
                                                mb: 0.5,
                                            }}
                                        >
                                            {field.label}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                wordBreak: "break-word",
                                                color: account[field.name] ? "text.primary" : "text.secondary",
                                            }}
                                        >
                                            {formatFieldValue(field, account[field.name])}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))
                        ) : (
                            <Grid item xs={12}>
                                <Typography variant="body1" color="textSecondary">
                                    No fields available in the object definition.
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                </CardContent>
            </Card>

            {/* Edit Modal */}
            {isEditModalOpen && (
                <AccountFormModal
                    open={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    account={account}
                    onSaved={handleSave}
                />
            )}
        </Box>
    );
};

export default AccountView;