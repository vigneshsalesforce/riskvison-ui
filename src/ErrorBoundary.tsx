// src/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from './utils/logger';
import { useDispatch } from 'react-redux';
import {addToast} from './redux/toastSlice';

interface Props {
    children: ReactNode;
    dispatch?: any; // Using any for simplicity, but you could use Dispatch<AnyAction> from redux
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }


  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to your logging service
    logger.error("Error catched by error boundry:",error, errorInfo)
    this.props.dispatch(addToast({ type:"error", message:"Something went wrong" }))
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}


const ErrorBoundaryWrapper = ({ children }:Props) => {
    const dispatch = useDispatch()
    return <ErrorBoundary dispatch={dispatch}>
        {children}
    </ErrorBoundary>
}

export default ErrorBoundaryWrapper