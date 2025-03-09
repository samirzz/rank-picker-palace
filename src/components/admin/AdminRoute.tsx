
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const isAdmin = localStorage.getItem("adminAuth") === "true";
    if (!isAdmin) {
      navigate("/admin/login");
    }
  }, [navigate]);

  return <>{children}</>;
};

export default AdminRoute;
