//pages/Accounts/AccountView.tsx
import React, { useState, useEffect, useRef } from "react";
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
import api from "../../services/api";
import AccountFormModal from "../../components/AccountFormModal";
import ErrorHandler from "../../components/ErrorHandler";

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

interface ObjectDefinition {
    name: string;
    label: string;
    fields: Field[];
}

const AccountView: React.FC = () => {
    const { accountId } = useParams<{ accountId: string }>();
    const navigate = useNavigate();

    const [account, setAccount] = useState<Record<string, any> | null>(null);
    const [objectDefinition, setObjectDefinition] = useState<ObjectDefinition | null>(null);
    const [loading, setLoading] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const objectDefinitionCache = useRef<Record<string, ObjectDefinition | null>>({});
    const lookupDataCache = useRef<Record<string, any[]>>({}); // Cache for lookup data
    const [lookupValues, setLookupValues] = useState<Record<string, any>>({});



    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch Object Definition
                const definitionCacheKey = `/object/account`;
                let definitionData = null;

                if (objectDefinitionCache.current[definitionCacheKey]) {
                    definitionData = objectDefinitionCache.current[definitionCacheKey];
                } else {
                    const definitionRes = await api.get(definitionCacheKey);
                    definitionData = definitionRes.data.data;
                    objectDefinitionCache.current[definitionCacheKey] = definitionData;
                }

                setObjectDefinition(definitionData);

                // Fetch Account Data
                const accountRes = await api.get(`/account/${accountId}/view`);
                setAccount(accountRes.data.data);
                setError(null);


            } catch (error: any) {
                console.error("Error fetching account details:", error);
                setError(error.message || "Error fetching account details");
                navigate("/accounts");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [accountId, navigate]);

    useEffect(() => {
        const fetchLookups = async () => {
          if (!account || !objectDefinition) return;


          const lookupFields = objectDefinition.fields?.filter(
                (field) => field.type === "lookup" && field.options?.dynamic && account[field.name]
            ) || [];

            if(lookupFields.length === 0) {
              return;
            }

            const fetchLookupData = async (field:Field) => {
                const { objectName, valueField } = field.options?.dynamic || {}
              if(!objectName || !valueField) {
                return [];
              }

                const cacheKey = `/${objectName}/list`

                 if (lookupDataCache.current[cacheKey]) {
                    return lookupDataCache.current[cacheKey];
                  }

                try {
                    const response = await api.get(cacheKey);
                  if(response.data && response.data.data && response.data.data.data) {
                     lookupDataCache.current[cacheKey] = response.data.data.data;
                     return response.data.data.data;

                  }
                    return [];
                } catch (error:any) {
                    console.error(`Error fetching lookup data for ${objectName}:`, error);
                    return [];
                }
            };


            const lookupResults = await Promise.all(lookupFields.map(fetchLookupData));

            const updatedLookupValues: Record<string, any> = {};
            lookupFields.forEach((field, index) => {
              const { displayField, valueField } = field.options?.dynamic || {};
                const lookupList = lookupResults[index] || [];
                const currentLookupId = account[field.name];
                if(currentLookupId && displayField) {
                    const foundLookup = lookupList.find((item:any) => item[valueField] === currentLookupId);
                    updatedLookupValues[field.name] = foundLookup ? foundLookup[displayField] : currentLookupId
                } else {
                    updatedLookupValues[field.name] = currentLookupId;
                }
            });
            setLookupValues(updatedLookupValues);
        };

        fetchLookups();
    }, [account, objectDefinition]);


    const handleEdit = () => {
        setIsEditModalOpen(true);
    };

    const formatFieldValue = (field: Field, value: any): React.ReactNode => {
      if (value === null || value === undefined) return " ";
      if (typeof value === "boolean") return value ? "Yes" : "No";
      if (Array.isArray(value)) return value.join(", ");


        if (field.type === "lookup" && field.options?.dynamic) {
          const { objectName, valueField } = field.options.dynamic;
          const lookupId = account[field.name];

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


    const handleCloseError = () => {
        setError(null);
    };

    const handleSave = (updatedAccount: Record<string, any>) => {
        setAccount(updatedAccount);
        setIsEditModalOpen(false);
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
            <ErrorHandler message={error || ""} open={!!error} onClose={handleCloseError}/>

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