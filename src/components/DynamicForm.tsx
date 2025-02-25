// src/components/generic/DynamicForm.tsx
import React, { useState, useEffect, useRef } from "react";
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
    FormHelperText,
} from "@mui/material";
import { useForm, Controller } from 'react-hook-form';
import api from "../services/api";
import { logger } from "../utils/logger";
import {Field} from './../types';
import Toast from '../components/common/Toast';
import { useNavigate } from 'react-router-dom';


interface DynamicFormProps {
  fields: Field[];
  initialValues?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
  onCancel: () => void;
  objectName?: string;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
    fields,
    initialValues = {},
    onSubmit,
    onCancel,
    objectName
}) => {
    const { handleSubmit, control, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: initialValues
    });
     const navigate = useNavigate();
    const [dynamicOptions, setDynamicOptions] = useState<Record<string, any[]>>({});
    const [loadingLookups, setLoadingLookups] = useState<Record<string, boolean>>({});
    const [lookupErrors, setLookupErrors] = useState<Record<string, string | null>>({});
    const cache = useRef<Record<string, any>>({});
    const [loadingAllLookups, setLoadingAllLookups] = useState(false);


    useEffect(() => {
        const lookupFields = fields.filter(
            (field) => field.type === "lookup" && field.options?.dynamic
        );
        if (lookupFields.length > 0) {
            fetchMultipleDynamicOptions(lookupFields);
        }
    }, [fields]);


    const handleCloseError = (fieldName: string) => {
        setLookupErrors(prev => ({ ...prev, [fieldName]: null }));
    };


    const fetchMultipleDynamicOptions = async (lookupFields: Field[]) => {
        setLoadingAllLookups(true);
        try {
            const apiCalls = lookupFields.map((field) => {
                const { objectName, displayField, valueField } = field.options?.dynamic as any;
                const cacheKey = `/${objectName}/list`;
                if (cache.current[cacheKey]) {
                   return Promise.resolve({data: {data: {data: cache.current[cacheKey]}}})
                }
                return api.get(cacheKey)
            });

            const responses = await Promise.all(apiCalls);

            responses.forEach((response, index) => {
                const field = lookupFields[index];
                const { objectName, displayField, valueField } = field.options?.dynamic as any;
                const cacheKey = `/${objectName}/list`;

                if (response.data && response.data.data && response.data.data.data) {
                    const options = response.data.data.data.map((item: any) => ({
                        label: item[displayField],
                        value: item[valueField],
                    }));
                   cache.current[cacheKey] = options;
                    setDynamicOptions((prev) => ({
                        ...prev,
                        [field.name]: options
                    }))
                     const lookupValue = getValues(field.name);
                        if (lookupValue) {
                             const foundLookup = options.find((item:any) => item.value === lookupValue);
                              if(foundLookup) {
                                  setValue(field.name, foundLookup.value)
                             }
                        }
                }
            })


            setLookupErrors((prev) =>
                lookupFields.reduce((acc, field) => {
                    acc[field.name] = null;
                    return acc;
                }, {} as Record<string, null>)
            );
        } catch (error:any) {
            logger.error("Error fetching multiple dynamic options", error)
            setLookupErrors((prev) =>
                lookupFields.reduce((acc, field) => {
                    acc[field.name] = error.message || `Error fetching dynamic options for ${field.name}`;
                    return acc;
                }, {} as Record<string, string>)
            );
        } finally {
            setLoadingAllLookups(false);
        }
    };

    const onSubmitHandler = (data:any) => {
      onSubmit(data)
    }
    const handleCancel = () => {
      if(onCancel) {
        onCancel();
         if(objectName) {
            navigate(`/${objectName}s`);
         }
      }
    }
    return (
        <form onSubmit={handleSubmit(onSubmitHandler)}>
            <Grid container spacing={3}>
                {fields
                    .filter((field) => !field.isHidden)
                    .map((field) => (
                        <Grid item xs={12} md={6} key={field.name}>
                            {field.type === "text" && (
                                <Controller
                                    name={field.name}
                                    control={control}
                                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                                     <TextField
                                        fullWidth
                                        label={field.label}
                                        required={field.required}
                                        value={value || ""}
                                        onChange={onChange}
                                        inputProps={{
                                            readOnly: field.isReadOnly || false,
                                            pattern: field.validation?.pattern,
                                            minLength: field.validation?.minLength,
                                            maxLength: field.validation?.maxLength,
                                        }}
                                         error={!!error}
                                          helperText={error ? error.message : undefined}
                                      />
                                    )}
                                />

                            )}

                             {field.type === "email" && (
                                 <Controller
                                    name={field.name}
                                    control={control}
                                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                                <TextField
                                  fullWidth
                                  label={field.label}
                                  required={field.required}
                                    type="email"
                                    value={value || ""}
                                  onChange={onChange}
                                  error={!!error}
                                   helperText={error ? error.message : undefined}
                                />
                                    )}
                                />
                            )}


                            {field.type === "url" && (
                                 <Controller
                                    name={field.name}
                                    control={control}
                                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                                <TextField
                                  fullWidth
                                  label={field.label}
                                  required={field.required}
                                    type="url"
                                     value={value || ""}
                                  onChange={onChange}
                                   error={!!error}
                                   helperText={error ? error.message : undefined}
                                />
                                    )}
                                />
                            )}


                            {field.type === "phone" && (
                                <Controller
                                    name={field.name}
                                    control={control}
                                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                                        <TextField
                                          fullWidth
                                          label={field.label}
                                          required={field.required}
                                            type="tel"
                                            value={value || ""}
                                          onChange={onChange}
                                         error={!!error}
                                            helperText={error ? error.message : undefined}
                                        />
                                    )}
                                />
                            )}


                            {field.type === "file" && (
                                <Button
                                    variant="outlined"
                                    component="label"
                                    fullWidth
                                >
                                    Upload {field.label}
                                    <Controller
                                        name={field.name}
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <input
                                                type="file"
                                                hidden
                                                onChange={(e) => onChange(e.target.files?.[0])}
                                            />
                                        )}
                                    />
                                </Button>
                            )}

                            {field.type === "currency" && (
                                <Controller
                                    name={field.name}
                                    control={control}
                                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                                        <TextField
                                            fullWidth
                                            label={field.label}
                                            required={field.required}
                                            type="number"
                                            value={value || ""}
                                            onChange={(e) => onChange(parseFloat(e.target.value) || "")}
                                             error={!!error}
                                          helperText={error ? error.message : undefined}
                                            inputProps={{ min: 0, step: "0.01" }}
                                        />
                                    )}
                                />
                            )}

                            {field.type === "number" && (
                                <Controller
                                    name={field.name}
                                    control={control}
                                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                                        <TextField
                                            fullWidth
                                            label={field.label}
                                            required={field.required}
                                            type="number"
                                            value={value || ""}
                                            onChange={(e) => onChange(parseFloat(e.target.value) || "")}
                                               error={!!error}
                                              helperText={error ? error.message : undefined}
                                        />
                                    )}
                                />
                            )}

                            {field.type === "date" && (
                                <Controller
                                  name={field.name}
                                    control={control}
                                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                                        <TextField
                                          fullWidth
                                            label={field.label}
                                            required={field.required}
                                            type="date"
                                            InputLabelProps={{ shrink: true }}
                                            onChange={onChange}
                                              error={!!error}
                                               helperText={error ? error.message : undefined}
                                            value={value || ''}
                                        />
                                    )}
                                />

                            )}

                            {field.type === "datetime" && (
                                <Controller
                                    name={field.name}
                                    control={control}
                                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                                    <TextField
                                      fullWidth
                                        label={field.label}
                                        required={field.required}
                                        type="datetime-local"
                                        InputLabelProps={{ shrink: true }}
                                        onChange={onChange}
                                          error={!!error}
                                           helperText={error ? error.message : undefined}
                                        value={value || ''}
                                    />
                                    )}
                                />
                            )}

                            {field.type === "time" && (
                                <Controller
                                  name={field.name}
                                    control={control}
                                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                                        <TextField
                                            fullWidth
                                            label={field.label}
                                            required={field.required}
                                            type="time"
                                            InputLabelProps={{ shrink: true }}
                                            onChange={onChange}
                                             error={!!error}
                                              helperText={error ? error.message : undefined}
                                            value={value || ''}
                                        />
                                  )}
                                />
                            )}

                           {field.type === "dropdown" && field.options?.static && (
                                <Controller
                                    name={field.name}
                                    control={control}
                                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                                        <FormControl fullWidth>
                                            <InputLabel>{field.label}</InputLabel>
                                            <Select
                                              value={value || ""}
                                              onChange={onChange}
                                               error={!!error}
                                             renderValue={(selected) => selected}
                                               helperText={error ? error.message : undefined}
                                            >
                                                {field.options.static?.map((option) => (
                                                    <MenuItem key={option} value={option}>
                                                        {option}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {error &&  <FormHelperText error>{error.message}</FormHelperText>}
                                        </FormControl>
                                    )}
                                />
                            )}

                           {field.type === "checkbox" && (
                                  <Controller
                                  name={field.name}
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <FormControlLabel
                                          control={
                                            <Checkbox
                                              checked={!!value}
                                              onChange={(e) => onChange(e.target.checked)}
                                            />
                                          }
                                          label={field.label}
                                        />
                                    )}
                                />
                            )}
                            {field.type === "textarea" && (
                                <Controller
                                    name={field.name}
                                    control={control}
                                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                                <TextField
                                  fullWidth
                                    label={field.label}
                                    required={field.required}
                                  value={value || ""}
                                  multiline
                                  rows={4}
                                    onChange={onChange}
                                   error={!!error}
                                    helperText={error ? error.message : undefined}
                                />
                                    )}
                                />
                            )}
                            {field.type === "lookup" && field.options?.dynamic && (
                                <Controller
                                    name={field.name}
                                    control={control}
                                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                                       <FormControl fullWidth>
                                          <InputLabel>{field.label}</InputLabel>
                                           {lookupErrors[field.name] &&  <Toast type="error" message={lookupErrors[field.name] || ""} id={field.name} />}
                                          {loadingAllLookups ? (
                                            <CircularProgress size={24} />
                                          ) : (
                                            <Select
                                                value={value || ""}
                                                onChange={onChange}
                                            >
                                                {dynamicOptions[field.name]?.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                      {option.label}
                                                    </MenuItem>
                                                ))}
                                             </Select>
                                          )}
                                       </FormControl>
                                     )}
                                />
                            )}
                        </Grid>
                    ))}
            </Grid>
            <Box mt={3} display="flex" justifyContent="flex-end">
                <Button variant="outlined" onClick={handleCancel} sx={{ mr: 2 }}>
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