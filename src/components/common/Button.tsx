// src/components/common/Button.tsx
import React, { ReactNode } from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';

interface ButtonProps extends MuiButtonProps {
    children: ReactNode;
    onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
    return (
        <MuiButton
            {...props}
        >
            {children}
        </MuiButton>
    );
};

export default Button;