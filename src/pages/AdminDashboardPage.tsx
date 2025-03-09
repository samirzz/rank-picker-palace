
import React from "react";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminRoute from "@/components/admin/AdminRoute";

const AdminDashboardPage: React.FC = () => {
  return (
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  );
};

export default AdminDashboardPage;
