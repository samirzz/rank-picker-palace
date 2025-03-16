
import React from "react";
import HeroEditor from "@/components/admin/HeroEditor";
import AdminRoute from "@/components/admin/AdminRoute";
import AdminNavigation from "@/components/admin/AdminNavigation";
import DiscordLinkEditor from "@/components/admin/DiscordLinkEditor";

const AdminPriceManagerPage: React.FC = () => {
  return (
    <AdminRoute>
      <div className="container mx-auto px-4 py-6 md:py-8">
        <h1 className="text-2xl font-bold text-white mb-4 md:mb-6">Pricing & Community Management</h1>
        <AdminNavigation />
        <div className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Hero Settings</h2>
              <HeroEditor />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Discord Community</h2>
              <DiscordLinkEditor />
            </div>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
};

export default AdminPriceManagerPage;
