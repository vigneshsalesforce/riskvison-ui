// components/DynamicForm.tsx

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  InputLabel,
  FormControl,
  CircularProgress,
} from "@mui/material";
import ErrorHandler from "./ErrorHandler";
import { useToast } from "./Toast";
import logger from "../utils/logger";
import apiService from "../services/api";
import { debounce } from 'lodash';

interface DynamicOption {
    label: string;
    value: any;
}

interface Field {
  name: string;
  label: string;
  type: string;
  required: boolean;
    defaultValue?: any,
  options?: {
    static?: string[];
    dynamic?: {
      objectName: string;
      displayField: string;
      valueField: string;
      fetchOnLoad?: boolean; // If true, fetch options on mount
      searchable?: boolean; // if true , implement search for this lookup
        fetchData?: (searchTerm:string) => Promise<any[]>; // fetch data on search
    };
  };
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  };
    render?: (value: any, handleChange: (value: any) => void, field:Field) => React.ReactNode
  isHidden?: boolean;
  isReadOnly?: boolean;
}

interface DynamicFormProps {
  fields: Field[];
    onLookupData?: (objectName: string, searchTerm?: string) => Promise<any[]>;
  initialValues?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
  onCancel: () => void;
}


const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
    onLookupData,
  initialValues = {},
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialValues);
  const [dynamicOptions, setDynamicOptions] = useState<Record<string, DynamicOption[]>>({});
  const [loadingLookups, setLoadingLookups] = useState<Record<string, boolean>>({});
  const [lookupErrors, setLookupErrors] = useState<Record<string, string | null>>({});
    const cache = useRef<Record<string, any>>({});
     const [loadingAllLookups, setLoadingAllLookups] = useState(false);
     const { showToast } = useToast();


    const lookupFields = useMemo(() =>
        fields.filter(
        (field) => field.type === "lookup" && field.options?.dynamic
    ), [fields]);



    const fetchMultipleDynamicOptions = useCallback(async (lookupFields: Field[]) => {
         setLoadingAllLookups(true);
        try {
            const apiCalls = lookupFields.map((field) => {
                const { objectName, displayField, valueField } = field.options?.dynamic as any;
                const cacheKey = `/${objectName}/list`;
                 if (cache.current[cacheKey]) {
                    return Promise.resolve({data: {data: {data: cache.current[cacheKey]}}})
                }
                   return apiService.get(cacheKey)
            });


            const responses = await Promise.all(apiCalls);

             responses.forEach((response, index) => {
                const field = lookupFields[index];
                const { objectName, displayField, valueField } = field.options?.dynamic as any;
                const cacheKey = `/${objectName}/list`;
                let options = []

                if (response.data && response.data.data && Array.isArray(response.data.data)) {
                      options = response.data.data.map((item: any) => ({
                        label: item[displayField] as string,
                        value: item[valueField] as string,
                    }));
                } else if (response.data && response.data.data && response.data.data.data && Array.isArray(response.data.data.data)) {
                     options = response.data.data.data.map((item: any) => ({
                        label: item[displayField] as string,
                         value: item[valueField] as string,
                     }));
                }

                cache.current[cacheKey] = options;
                setDynamicOptions((prev) => ({
                    ...prev,
                    [field.name]: options
                }))
            })


            setLookupErrors((prev) =>
                lookupFields.reduce((acc, field) => {
                    acc[field.name] = null;
                    return acc;
                }, {} as Record<string, null>)
            );
        } catch (error:any) {
            logger.error("Error fetching multiple dynamic options", error);
            showToast('error', error.message || "Error fetching multiple dynamic options", 'Error');
            setLookupErrors((prev) =>
                lookupFields.reduce((acc, field) => {
                    acc[field.name] = error.message || `Error fetching dynamic options for ${field.name}`;
                    return acc;
                }, {} as Record<string, string>)
            );
        } finally {
            setLoadingAllLookups(false);
        }
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showToast]);

      useEffect(() => {
         if (lookupFields.length > 0) {
            fetchMultipleDynamicOptions(lookupFields.filter(field => field.options?.dynamic?.fetchOnLoad));
         }
    }, [lookupFields, fetchMultipleDynamicOptions]);

  const handleCloseError = (fieldName: string) => {
        setLookupErrors(prev => ({ ...prev, [fieldName]: null }));
  };


  const handleLookupChange =  useCallback(
        debounce(async (field: Field, searchTerm: string) => {
            if (!field || !field.options?.dynamic) {
                return;
            }
             setLoadingLookups((prev) => ({ ...prev, [field.name]: true }));
             try {
                 let options;
                 const { objectName, displayField, valueField, fetchData } = field.options.dynamic;
                  if (fetchData) {
                        const data = await fetchData(searchTerm);
                     options = data.map((item: any) => ({
                        label: item[displayField] as string,
                         value: item[valueField] as string,
                     }));
                    } else {
                         const response = await apiService.get(`/${objectName}/list`, {
                           params:{ search: searchTerm}
                         });
                    if (response.data && response.data.data && Array.isArray(response.data.data)) {
                      options = response.data.data.map((item: any) => ({
                        label: item[displayField] as string,
                          value: item[valueField] as string,
                     }));
                  } else if(response.data && response.data.data && response.data.data.data &&  Array.isArray(response.data.data.data)){
                     options = response.data.data.data.map((item: any) => ({
                        label: item[displayField] as string,
                        value: item[valueField] as string,
                   }));
                  }
                    }
                  setDynamicOptions((prev) => ({
                    ...prev,
                     [field.name]: options
                  }))
               setLookupErrors((prev) => ({ ...prev, [field.name]: null }));
                } catch (error: any) {
                    logger.error(`Error fetching dynamic options for ${field.name}`, error);
                    setLookupErrors((prev) => ({ ...prev, [field.name]: error.message || `Error fetching dynamic options for ${field.name}` }));
                    showToast('error', error.message || `Error fetching dynamic options for ${field.name}`, 'Error');
                } finally {
                   setLoadingLookups((prev) => ({ ...prev, [field.name]: false }));
                 }
           }, 500),
          [onLookupData, showToast]);

  const handleChange = (name: string, value: any) => {
      setFormData((prev) => ({ ...prev, [name]: value }));
      const field = fields.find(f => f.name === name);
        if(field && field.options?.dynamic) {
            handleLookupChange(field, value);
        }
  };

    const handleCustomChange = (value: any, name: string) => {
      setFormData((prev) => ({ ...prev, [name]: value }));
  };


    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, name:string) => {
      handleChange(name, event.target.checked)
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
      try {
          onSubmit(formData);
      } catch (e: any) {
          logger.error("Error submitting form data", e);
        showToast('error', "Error submitting form data", 'Error');
      }
  };


     const renderField = (field: Field): React.ReactNode => {
      if(field.render) {
          return field.render(formData[field.name], (value: any) => handleCustomChange(value, field.name) , field);
       }
          switch (field.type) {
           case "text":
             case "email":
            case "url":
          case "phone":
           case "currency":
           case "number":
             return(  <TextField
                      fullWidth
                      label={field.label}
                      required={field.required}
                      value={formData[field.name] || ""}
                    type={field.type}
                       onChange={(e) => handleChange(field.name, e.target.value)}
                      inputProps={{
                        readOnly: field.isReadOnly || false,
                        pattern: field.validation?.pattern,
                          minLength: field.validation?.minLength,
                          maxLength: field.validation?.maxLength,
                          min: field.validation?.min,
                         max: field.validation?.max
                      }}
                  />)
              case "date":
             case "datetime":
              case "time":
               return ( <TextField
                      fullWidth
                      label={field.label}
                      required={field.required}
                      type={field.type}
                      value={formData[field.name] || ""}
                      InputLabelProps={{ shrink: true }}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                  />)
            case "dropdown":
               return field.options?.static ? (
                    <FormControl fullWidth>
                        <InputLabel>{field.label}</InputLabel>
                        <Select
                            value={formData[field.name] || ""}
                            onChange={(e) => handleChange(field.name, e.target.value)}
                        >
                            {field.options.static.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                ) : null;
            case "checkbox":
                 return( <FormControlLabel
                      control={
                          <Checkbox
                              checked={!!formData[field.name]}
                              onChange={(e) =>
                                handleCheckboxChange(e, field.name)
                              }
                          />
                      }
                      label={field.label}
                  />);

            case "textarea":
                  return( <TextField
                      fullWidth
                      label={field.label}
                      required={field.required}
                      value={formData[field.name] || ""}
                      multiline
                      rows={4}
                     onChange={(e) => handleChange(field.name, e.target.value)}
                  />)

             case "lookup":
                 return field.options?.dynamic ? (
                    <FormControl fullWidth>
                       <InputLabel>{field.label}</InputLabel>
                        <ErrorHandler message={lookupErrors[field.name] || ""} open={!!lookupErrors[field.name]} onClose={() => handleCloseError(field.name)} />
                       {loadingLookups[field.name] || loadingAllLookups ? (
                            <CircularProgress size={24} />
                        ) : (
                            <Select
                                value={formData[field.name] || ""}
                             onChange={(e) => handleChange(field.name, e.target.value)}
                             onOpen={() => fetchMultipleDynamicOptions(lookupFields.filter(f => f.name === field.name))}
                            >
                                {dynamicOptions[field.name]?.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        )}
                    </FormControl>
                 ) : null;
           default:
                return null;

        }
  }


  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        {fields
          .filter((field) => !field.isHidden)
          .map((field) => (
            <Grid item xs={12} md={6} key={field.name}>
                  {renderField(field)}
            </Grid>
          ))}
      </Grid>
      <Box mt={3} display="flex" justifyContent="flex-end">
        <Button variant="outlined" onClick={onCancel} sx={{ mr: 2 }}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Save
        </Button>
      </Box>
    </form>
  );
};

export default DynamicForm;