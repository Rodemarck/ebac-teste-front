import React, { type JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store';

interface PrivateRouteProps {
  children: JSX.Element;
}

const Authenticated = ({ children }: PrivateRouteProps) => {
  const token = useSelector((state: RootState) => state.auth.token);
  console.log((token == undefined || token == null ? 'deslogado' : 'logado'));

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default Authenticated;