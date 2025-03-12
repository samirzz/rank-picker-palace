
import React from "react";
import AdminGameDashboard from "@/components/admin/AdminGameDashboard";
import AdminRoute from "@/components/admin/AdminRoute";

const AdminGameDashboardPage: React.FC = () => {
  return (
    <AdminRoute>
      <AdminGameDashboard />
    </AdminRoute>
  );
};

export default AdminGameDashboardPage;
