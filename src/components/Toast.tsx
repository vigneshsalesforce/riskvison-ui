// src/components/Toast.tsx
import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { Snackbar, Alert, AlertTitle, IconButton, Slide } from '@mui/material';
import { Close } from '@mui/icons-material';
import { TransitionProps } from '@mui/material/transitions';

type ToastType = 'success' | 'info' | 'warning' | 'error';

interface ToastMessage {
    id: number;
    type: ToastType;
    message: string;
    title?: string;
}

interface ToastContextType {
    showToast: (type: ToastType, message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
    children: React.ReactNode;
}


const TransitionUp = React.forwardRef(function TransitionUp(
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  });


export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const [nextId, setNextId] = useState(0);
    const autoCloseDuration = 5000;

    const showToast = useCallback((type: ToastType, message: string, title?: string) => {
        const newToast: ToastMessage = {
            id: nextId,
            type,
            message,
            title,
        };
        setToasts((prevToasts) => [...prevToasts, newToast]);
        setNextId(nextId + 1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const closeToast = useCallback((id: number) => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useEffect(() => {
      if(toasts.length > 0) {
           const timer = setTimeout(() => {
            closeToast(toasts[0].id);
          }, autoCloseDuration);
        return () => clearTimeout(timer)
      }
    }, [toasts, closeToast]);


    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toasts.map((toast) => (
                <Snackbar
                    key={toast.id}
                    open={true}
                  TransitionComponent={TransitionUp}
                >
                    <Alert
                        severity={toast.type}
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => closeToast(toast.id)}
                            >
                                <Close fontSize="inherit" />
                            </IconButton>
                        }
                        >
                          {toast.title && <AlertTitle>{toast.title}</AlertTitle>}
                           {toast.message}
                       </Alert>
                </Snackbar>
            ))}
        </ToastContext.Provider>
    );
};

export const useToast = (): ToastContextType => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};