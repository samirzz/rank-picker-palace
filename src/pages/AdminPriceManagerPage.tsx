
import React from "react";
import { HeroEditor } from "@/components/admin/HeroEditor";
import AdminRoute from "@/components/admin/AdminRoute";

const AdminPriceManagerPage: React.FC = () => {
  return (
    <AdminRoute>
      <div className="container mx-auto p-4 md:p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Pricing Management</h1>
        <div className="space-y-6">
          <HeroEditor />
        </div>
      </div>
    </AdminRoute>
  );
};

export default AdminPriceManagerPage;
