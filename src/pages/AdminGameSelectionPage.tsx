
import React from "react";
import AdminRoute from "@/components/admin/AdminRoute";
import AdminGameSelection from "@/components/admin/AdminGameSelection";

const AdminGameSelectionPage: React.FC = () => {
  return (
    <AdminRoute>
      <div className="min-h-screen bg-gradient-to-b from-black to-mlbb-purple/20">
        <header className="bg-black/60 border-b border-mlbb-purple/20">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-xl md:text-2xl font-bold text-mlbb-purple">Admin Game Selection</h1>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-6 md:py-8">
          <AdminGameSelection />
        </main>
      </div>
    </AdminRoute>
  );
};

export default AdminGameSelectionPage;
