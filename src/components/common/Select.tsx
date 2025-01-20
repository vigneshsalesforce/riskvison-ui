// src/components/common/Select.tsx
import { FormControl, InputLabel, Select as MuiSelect, SelectProps, MenuItem } from '@mui/material';

interface CustomSelectProps<T extends string | number> extends Omit<SelectProps<T>, 'onChange' | 'value'> {
    label: string;
    options: { label: string, value: T }[];
    value?: T | null;
    onChange?: (value: T) => void;
}


const Select = <T extends string | number>({ label, options, value, onChange, ...props }: CustomSelectProps<T>) => {

    const handleChange = (event: any) => {
      const selectedValue = event.target.value as T
      if(onChange) {
        onChange(selectedValue);
      }
    };

    return (
        <FormControl fullWidth>
            <InputLabel>{label}</InputLabel>
            <MuiSelect
                label={label}
                value={value === null ? '' : value}
                onChange={handleChange}
               {...props}
            >
                {options.map((option) => (
                    <MenuItem key={String(option.value)} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </MuiSelect>
        </FormControl>
    );
};

export default Select;