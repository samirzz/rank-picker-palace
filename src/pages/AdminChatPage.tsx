
import React from "react";
import AdminRoute from "@/components/admin/AdminRoute";
import AdminNavigation from "@/components/admin/AdminNavigation";
import AdminChatManager from "@/components/admin/AdminChatManager";

const AdminChatPage: React.FC = () => {
  return (
    <AdminRoute>
      <div className="container mx-auto p-4 md:p-6">
        <h1 className="text-2xl font-bold text-white mb-4 md:mb-6">Live Chat Management</h1>
        <AdminNavigation />
        <div className="mt-6">
          <AdminChatManager />
        </div>
      </div>
    </AdminRoute>
  );
};

export default AdminChatPage;
