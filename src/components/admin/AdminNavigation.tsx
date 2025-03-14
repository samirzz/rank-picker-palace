
import React from "react";
import { NavLink } from "react-router-dom";
import { Home, DollarSign } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const AdminNavigation: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <div className="glass-panel p-4">
      <nav className="flex flex-wrap gap-2">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `flex items-center px-4 py-2 rounded-md w-full sm:w-auto ${
              isActive
                ? "bg-mlbb-purple text-white"
                : "bg-black/40 text-gray-300 hover:bg-mlbb-purple/20"
            }`
          }
        >
          <Home className="h-4 w-4 mr-2" />
          Dashboard
        </NavLink>
        
        <NavLink
          to="/admin/prices"
          className={({ isActive }) =>
            `flex items-center px-4 py-2 rounded-md w-full sm:w-auto ${
              isActive
                ? "bg-mlbb-purple text-white"
                : "bg-black/40 text-gray-300 hover:bg-mlbb-purple/20"
            }`
          }
        >
          <DollarSign className="h-4 w-4 mr-2" />
          Pricing
        </NavLink>
      </nav>
    </div>
  );
};

export default AdminNavigation;
