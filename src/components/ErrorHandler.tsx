// components/ErrorHandler.tsx
import React from 'react';
import { Alert, AlertTitle, Collapse, IconButton, Box } from '@mui/material';
import { Close } from '@mui/icons-material';

interface ErrorHandlerProps {
    message: string;
    title?: string;
    open: boolean;
    onClose: () => void;
}


const ErrorHandler: React.FC<ErrorHandlerProps> = ({message, title = "Error", open, onClose}) => {
    return (
        <Collapse in={open}>
          <Alert
          severity="error"
            action={
                <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={onClose}
                >
                    <Close fontSize="inherit" />
                </IconButton>
            }
          >
          <AlertTitle>{title}</AlertTitle>
           {message}
          </Alert>
        </Collapse>
    );
};

export default ErrorHandler;