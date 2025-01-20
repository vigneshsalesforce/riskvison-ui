import React, { useState, useEffect, useCallback } from 'react';
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
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import debounce from 'lodash/debounce';
import { Field } from '../../features/pra/types';
import { useQueryClient } from 'react-query';
import api from '../../services/api';
import { logger } from '../../utils/logger';
import Toast from '../common/Toast';

interface WizardDynamicFormProps {
  fields: Field[];
  initialValues?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
  autoSave?: boolean;
  autoSaveDelay?: number;
}

const WizardDynamicForm: React.FC<WizardDynamicFormProps> = ({
  fields,
  initialValues = {},
  onSubmit,
  autoSave = true,
  autoSaveDelay = 1000,
}) => {
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: initialValues,
  });

  const [dynamicOptions, setDynamicOptions] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saving' | 'saved' | 'error' | null>(null);
  const queryClient = useQueryClient();

  // Watch all form fields for autosave
  const formValues = watch();

  // Debounced autosave function
  const debouncedAutoSave = useCallback(
    debounce(async (data: Record<string, any>) => {
      if (autoSave && isDirty) {
        setAutoSaveStatus('saving');
        try {
          await onSubmit(data);
          setAutoSaveStatus('saved');
          setTimeout(() => setAutoSaveStatus(null), 2000);
        } catch (error) {
          logger.error('Autosave failed:', error);
          setAutoSaveStatus('error');
        }
      }
    }, autoSaveDelay),
    [autoSave, onSubmit, isDirty]
  );

  // Effect for autosave
  useEffect(() => {
    if (autoSave && isDirty) {
      debouncedAutoSave(formValues);
    }
    // Cleanup function to cancel pending debounced calls
    return () => {
      debouncedAutoSave.cancel();
    };
  }, [formValues, autoSave, debouncedAutoSave, isDirty]);

  // Load dynamic options for lookup fields
  useEffect(() => {
    const loadDynamicOptions = async () => {
      const lookupFields = fields.filter(
        (field) => field.type === 'lookup' && field.options?.dynamic
      );

      for (const field of lookupFields) {
        const { objectName, displayField, valueField } = field.options?.dynamic || {};
        try {
          const response = await api.get(`/${objectName}/list`);
          if (response.data?.data) {
            const options = response.data.data.data.map((item: any) => ({
              label: item[displayField],
              value: item[valueField],
            }));
            setDynamicOptions((prev) => ({
              ...prev,
              [field.name]: options,
            }));
          }
        } catch (error) {
          logger.error(`Error loading options for ${field.name}:`, error);
        }
      }
    };

    loadDynamicOptions();
  }, [fields]);

  // Reset form when initialValues change
  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  const onSubmitForm = (data: Record<string, any>) => {
    // Log the form data being submitted
    logger.info('Form data being submitted:', data);
    onSubmit(data);
  };

  const renderField = (field: Field) => {
    const commonProps = {
      fullWidth: true,
      label: field.label,
      required: field.required,
    };

    switch (field.type) {
      case 'text':
      case 'email':
      case 'url':
      case 'phone':
        return (
          <Controller
            name={field.name}
            control={control}
            rules={{ required: field.required }}
            defaultValue={initialValues[field.name] || ''}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <TextField
                {...commonProps}
                type={field.type}
                value={value || ''}
                onChange={onChange}
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
        );

      case 'number':
      case 'currency':
        return (
          <Controller
            name={field.name}
            control={control}
            rules={{ required: field.required }}
            defaultValue={initialValues[field.name] || ''}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <TextField
                {...commonProps}
                type="number"
                value={value || ''}
                onChange={(e) => onChange(parseFloat(e.target.value) || '')}
                error={!!error}
                helperText={error?.message}
                inputProps={{ step: field.type === 'currency' ? '0.01' : '1' }}
              />
            )}
          />
        );

      case 'date':
      case 'datetime':
      case 'time':
        return (
          <Controller
            name={field.name}
            control={control}
            rules={{ required: field.required }}
            defaultValue={initialValues[field.name] || ''}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <TextField
                {...commonProps}
                type={field.type === 'datetime' ? 'datetime-local' : field.type}
                value={value || ''}
                onChange={onChange}
                error={!!error}
                helperText={error?.message}
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
        );

      case 'textarea':
        return (
          <Controller
            name={field.name}
            control={control}
            rules={{ required: field.required }}
            defaultValue={initialValues[field.name] || ''}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <TextField
                {...commonProps}
                multiline
                rows={4}
                value={value || ''}
                onChange={onChange}
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
        );

      case 'dropdown':
        return (
          <Controller
            name={field.name}
            control={control}
            rules={{ required: field.required }}
            defaultValue={initialValues[field.name] || ''}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <FormControl fullWidth error={!!error}>
                <InputLabel>{field.label}</InputLabel>
                <Select value={value || ''} onChange={onChange} label={field.label}>
                  {field.options?.static?.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
                {error && <FormHelperText>{error.message}</FormHelperText>}
              </FormControl>
            )}
          />
        );

      case 'lookup':
        return (
          <Controller
            name={field.name}
            control={control}
            rules={{ required: field.required }}
            defaultValue={initialValues[field.name] || ''}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <FormControl fullWidth error={!!error}>
                <InputLabel>{field.label}</InputLabel>
                <Select value={value || ''} onChange={onChange} label={field.label}>
                  {dynamicOptions[field.name]?.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {error && <FormHelperText>{error.message}</FormHelperText>}
              </FormControl>
            )}
          />
        );

      case 'checkbox':
        return (
          <Controller
            name={field.name}
            control={control}
            defaultValue={initialValues[field.name] || false}
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
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <Grid container spacing={3}>
          {fields.map((field) => (
            <Grid item xs={12} md={6} key={field.name}>
              {renderField(field)}
            </Grid>
          ))}
        </Grid>

        {autoSaveStatus && (
          <Box mt={2}>
            {autoSaveStatus === 'saving' && (
              <Toast type="info" message="Saving changes..." id="autosave-status" />
            )}
            {autoSaveStatus === 'saved' && (
              <Toast type="success" message="All changes saved" id="autosave-status" />
            )}
            {autoSaveStatus === 'error' && (
              <Toast type="error" message="Error saving changes" id="autosave-status" />
            )}
          </Box>
        )}

        {!autoSave && (
          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Save'}
            </Button>
          </Box>
        )}
      </form>
    </Box>
  );
};

export default WizardDynamicForm;