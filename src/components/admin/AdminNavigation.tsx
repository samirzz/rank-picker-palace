
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BarChart, DollarSign, MessageSquare, Gamepad } from "lucide-react";

const AdminNavigation: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="glass-panel p-2 rounded-lg">
      <nav className="flex flex-wrap gap-2">
        <Link
          to="/admin/game-selection"
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            isActive("/admin/game-selection")
              ? "bg-mlbb-purple/20 text-white"
              : "hover:bg-gray-800/50 text-gray-300 hover:text-white"
          }`}
        >
          <Gamepad className="h-4 w-4" />
          <span>Games</span>
        </Link>
        
        <Link
          to="/admin/dashboard"
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            isActive("/admin/dashboard")
              ? "bg-mlbb-purple/20 text-white"
              : "hover:bg-gray-800/50 text-gray-300 hover:text-white"
          }`}
        >
          <BarChart className="h-4 w-4" />
          <span>Dashboard</span>
        </Link>
        
        <Link
          to="/admin/prices"
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            isActive("/admin/prices")
              ? "bg-mlbb-purple/20 text-white"
              : "hover:bg-gray-800/50 text-gray-300 hover:text-white"
          }`}
        >
          <DollarSign className="h-4 w-4" />
          <span>Pricing</span>
        </Link>
        
        <Link
          to="/admin/chat"
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            isActive("/admin/chat")
              ? "bg-mlbb-purple/20 text-white"
              : "hover:bg-gray-800/50 text-gray-300 hover:text-white"
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          <span>Live Chat</span>
        </Link>
      </nav>
    </div>
  );
};

export default AdminNavigation;
