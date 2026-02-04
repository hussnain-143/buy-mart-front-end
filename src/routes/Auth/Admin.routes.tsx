import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import GlobalSkeleton from '../../components/common/GlobalSkeleton';

const AdminRoutes = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (token) {
        setIsAuthenticated(true);
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (user.role !== "admin") {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return  <GlobalSkeleton/> 
  }

  // Check if user is authenticated
  if (isAuthenticated) {
    return <Outlet />;
  }

  // Redirect if not authenticated
  return <Navigate to="/login" replace />;
};

export default AdminRoutes;