
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const adminAuth = localStorage.getItem("adminAuth");
      
      if (!adminAuth) {
        setIsAdmin(false);
        return;
      }
      
      try {
        const authData = JSON.parse(adminAuth);
        const tokenExpiry = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        
        if (Date.now() - authData.timestamp > tokenExpiry) {
          // Token expired
          localStorage.removeItem("adminAuth");
          setIsAdmin(false);
        } else {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Error parsing admin auth data:", error);
        localStorage.removeItem("adminAuth");
        setIsAdmin(false);
      }
    };
    
    checkAuth();
  }, []);

  if (isAdmin === null) {
    // Still checking authentication
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <div className="glass-panel p-8 rounded-lg animate-pulse">
          <p className="text-mlbb-purple">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (isAdmin === false) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
