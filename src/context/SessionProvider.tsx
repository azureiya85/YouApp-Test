'use client';

import { createContext, useContext, ReactNode } from 'react';

type Session = {
  user: {
    id: string;
    username: string;
    email: string;
  } | null;
};

// Create the context with a default undefined value
const SessionContext = createContext<Session | undefined>(undefined);

// Define the props for the provider component
type SessionProviderProps = {
  children: ReactNode;
  value: Session;
};

// The provider component that will wrap the application
export function SessionProvider({ children, value }: SessionProviderProps) {
  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

// Custom hook for easy access to the session data
export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}