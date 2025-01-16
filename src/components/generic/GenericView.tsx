// src/components/generic/GenericView.tsx
import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    Grid,
    Card,
    CardContent,
    Chip,
    Divider,
    Link
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import useObjectDefinitionApi from '../../features/common/hooks/useObjectDefinitionApi';
import { useQuery } from 'react-query';
import api from '../../services/api';
import {Field} from '../../types';

interface GenericViewProps {
    objectName: string;
    objectId: string;
}

const GenericView: React.FC<GenericViewProps> = ({ objectName, objectId }) => {
    const navigate = useNavigate();
    const { objectDefinition, isLoading:isObjectLoading } = useObjectDefinitionApi(objectName);
    const [lookupValues, setLookupValues] = useState<Record<string, any>>({});
    const [account, setAccount] = useState<Record<string, any> | null>(null);
    const {data, isLoading: isAccountLoading} = useQuery([objectName, objectId], () => api.get(`/${objectName}/${objectId}/view`));

    useEffect(() => {
         if(data && data.data && data.data.data) {
           setAccount(data.data.data)
         }
    }, [data])


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

                try {
                    const response = await api.get(`/${objectName}/list`);
                   if(response.data && response.data.data && response.data.data.data) {
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
                  updatedLookupValues[field.name] = foundLookup ? foundLookup[displayField] : currentLookupId;
                } else {
                     updatedLookupValues[field.name] = currentLookupId;
                }

            });
            setLookupValues(updatedLookupValues);

        };
        fetchLookups();
    }, [account, objectDefinition]);

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
              onClick={() => navigate(`/${objectName}/${lookupId}/view`)}
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


    if (isObjectLoading || isAccountLoading ) {
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
            </Box>
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
        </Box>
    );
};

export default GenericView;