// src/components/common/Toast.tsx
import React, { useEffect, useState } from 'react';
import { Alert, AlertTitle, Collapse, IconButton, Box } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { removeToast } from '../../redux/toastSlice';
import { useSelector } from 'react-redux';
import {RootState} from '../../redux/store'

interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

const Toast: React.FC<ToastProps> = ({ id, type, message }) => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(true);


  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [id]);


  const handleClose = () => {
    setOpen(false);
     dispatch(removeToast(id));
  };


  return (
      <Collapse in={open}>
      <Alert
            severity={type}
              action={
                <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={handleClose}
                >
                    <Close fontSize="inherit" />
                </IconButton>
            }
      >
        <AlertTitle>{type.toUpperCase()}</AlertTitle>
        {message}
        </Alert>
       </Collapse>

  );
};

interface ToastContainerProps {
  }

const ToastContainer: React.FC<ToastContainerProps> = () => {
     const toasts = useSelector((state: RootState) => state.toast.toasts);

    return (
        <Box sx={{
            position: 'fixed',
            top: 20,
            right: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            zIndex:1500
        }}>
            {toasts && toasts.map(toast =>
                  <Toast
                        key={toast.id}
                        id={toast.id}
                        type={toast.type}
                        message={toast.message}
                    />
            )}

        </Box>
    )
}

export default ToastContainer;