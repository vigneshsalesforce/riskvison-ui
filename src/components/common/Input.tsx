// src/components/common/Input.tsx
import React, { } from 'react';
import { TextField } from '@mui/material';
import { StandardTextFieldProps } from '@mui/material';

interface InputProps extends StandardTextFieldProps {
}

const Input: React.FC<InputProps> = (props) => {
    return (
        <TextField
            {...props}
        />
    );
};

export default Input;