import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Cambiamos JSX.Element por React.ReactNode que es más seguro en TypeScript
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const auth = useContext(AuthContext);
  
  if (!auth?.usuario) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}