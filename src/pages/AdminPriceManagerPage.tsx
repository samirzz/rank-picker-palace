
import React from "react";
import HeroEditor from "@/components/admin/HeroEditor";
import AdminRoute from "@/components/admin/AdminRoute";
import AdminNavigation from "@/components/admin/AdminNavigation";

const AdminPriceManagerPage: React.FC = () => {
  return (
    <AdminRoute>
      <div className="container mx-auto p-4 md:p-6">
        <h1 className="text-2xl font-bold text-white mb-4 md:mb-6">Pricing Management</h1>
        <AdminNavigation />
        <div className="space-y-6 mt-6">
          <HeroEditor />
        </div>
      </div>
    </AdminRoute>
  );
};

export default AdminPriceManagerPage;
