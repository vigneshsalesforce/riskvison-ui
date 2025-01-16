// src/context/SpinnerContext.tsx
import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import Spinner from "../components/Spinner";

interface SpinnerContextType {
  showSpinner: () => void;
  hideSpinner: () => void;
}

const SpinnerContext = createContext<SpinnerContextType | undefined>(undefined);

interface SpinnerProviderProps {
    children: ReactNode;
}

export const SpinnerProvider: React.FC<SpinnerProviderProps> = ({
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const showSpinner = useCallback(() => setIsVisible(true), []);
  const hideSpinner = useCallback(() => setIsVisible(false), []);

  return (
    <SpinnerContext.Provider value={{ showSpinner, hideSpinner }}>
      {children}
      {isVisible && <Spinner />}
    </SpinnerContext.Provider>
  );
};

export const useSpinner = (): SpinnerContextType => {
  const context = useContext(SpinnerContext);
  if (!context) {
    throw new Error("useSpinner must be used within a SpinnerProvider");
  }
  return context;
};