
import React from "react";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminRoute from "@/components/admin/AdminRoute";
import AdminNavigation from "@/components/admin/AdminNavigation";

const AdminDashboardPage: React.FC = () => {
  return (
    <AdminRoute>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold text-white mb-4">Admin Dashboard</h1>
        <AdminNavigation />
        <AdminDashboard />
      </div>
    </AdminRoute>
  );
};

export default AdminDashboardPage;
