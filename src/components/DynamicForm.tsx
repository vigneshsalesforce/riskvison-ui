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
} from "@mui/material";
import api from "../services/api";
import ErrorHandler from "./ErrorHandler";

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
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  };
  isHidden?: boolean;
  isReadOnly?: boolean;
}

interface DynamicFormProps {
  fields: Field[];
  initialValues?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
  onCancel: () => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  initialValues = {},
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialValues);
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
                    console.log(response.data.data.data)
                    const options = response.data.data.data.map((item: any) => ({
                        label: item[displayField],
                        value: item[valueField],
                    }));
                    cache.current[cacheKey] = options;
                    setDynamicOptions((prev) => ({
                        ...prev,
                        [field.name]: options
                    }))
                }
            })

            setLookupErrors((prev) =>
                lookupFields.reduce((acc, field) => {
                    acc[field.name] = null;
                    return acc;
                }, {} as Record<string, null>)
            );
        } catch (error:any) {
            console.error("Error fetching multiple dynamic options", error);
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



  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        {fields
          .filter((field) => !field.isHidden)
          .map((field) => (
            <Grid item xs={12} md={6} key={field.name}>
              {field.type === "text" && (
                <TextField
                  fullWidth
                  label={field.label}
                  required={field.required}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  inputProps={{
                    readOnly: field.isReadOnly || false,
                    pattern: field.validation?.pattern,
                    minLength: field.validation?.minLength,
                    maxLength: field.validation?.maxLength,
                  }}
                />
              )}

              {field.type === "email" && (
                <TextField
                  fullWidth
                  label={field.label}
                  required={field.required}
                  value={formData[field.name] || ""}
                  type="email"
                  onChange={(e) => handleChange(field.name, e.target.value)}
                />
              )}

              {field.type === "url" && (
                <TextField
                  fullWidth
                  label={field.label}
                  required={field.required}
                  value={formData[field.name] || ""}
                  type="url"
                  onChange={(e) => handleChange(field.name, e.target.value)}
                />
              )}

              {field.type === "phone" && (
                <TextField
                  fullWidth
                  label={field.label}
                  required={field.required}
                  value={formData[field.name] || ""}
                  type="tel"
                  onChange={(e) => handleChange(field.name, e.target.value)}
                />
              )}

                {field.type === "file" && (
                    <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                    >
                        Upload {field.label}
                        <input
                            type="file"
                            hidden
                            onChange={(e) => handleChange(field.name, e.target.files?.[0])}
                        />
                    </Button>
                )}

              {field.type === "currency" && (
                <TextField
                  fullWidth
                  label={field.label}
                  required={field.required}
                  value={formData[field.name] || ""}
                  type="number"
                  onChange={(e) => handleChange(field.name, parseFloat(e.target.value) || "")}
                  inputProps={{ min: 0, step: "0.01" }}
                />
              )}

              {field.type === "number" && (
                <TextField
                  fullWidth
                  label={field.label}
                  required={field.required}
                  value={formData[field.name] || ""}
                  type="number"
                  onChange={(e) => handleChange(field.name, parseFloat(e.target.value) || "")}
                />
              )}

              {field.type === "date" && (
                <TextField
                  fullWidth
                  label={field.label}
                  required={field.required}
                  type="date"
                  value={formData[field.name] || ""}
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                />
              )}

              {field.type === "datetime" && (
                <TextField
                  fullWidth
                  label={field.label}
                  required={field.required}
                  type="datetime-local"
                  value={formData[field.name] || ""}
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                />
              )}

              {field.type === "time" && (
                <TextField
                  fullWidth
                  label={field.label}
                  required={field.required}
                  type="time"
                  value={formData[field.name] || ""}
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                />
              )}

              {field.type === "dropdown" && field.options?.static && (
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
              )}

              {field.type === "checkbox" && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!formData[field.name]}
                      onChange={(e) =>
                        handleChange(field.name, e.target.checked)
                      }
                    />
                  }
                  label={field.label}
                />
              )}

              {field.type === "textarea" && (
                <TextField
                  fullWidth
                  label={field.label}
                  required={field.required}
                  value={formData[field.name] || ""}
                  multiline
                  rows={4}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                />
              )}

              {field.type === "lookup" && field.options?.dynamic && (
                <FormControl fullWidth>
                  <InputLabel>{field.label}</InputLabel>
                    <ErrorHandler message={lookupErrors[field.name] || ""} open={!!lookupErrors[field.name]} onClose={() => handleCloseError(field.name)} />
                  {loadingAllLookups ? (
                    <CircularProgress size={24} />
                  ) : (
                    <Select
                      value={formData[field.name]}
                      onChange={(e) => handleChange(field.name, e.target.value)}
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