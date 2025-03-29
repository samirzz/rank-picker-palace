
import React from "react";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DesktopMenuProps {
  user: SupabaseUser | null;
  onLogout: () => Promise<void>;
  onLogin: () => void;
}

const DesktopMenu: React.FC<DesktopMenuProps> = ({ user, onLogout, onLogin }) => {
  return (
    <div className="hidden md:flex items-center space-x-2 lg:space-x-6">
      <a
        href="#home"
        className="px-3 py-2 text-gray-300 hover:text-white transition-colors text-sm lg:text-base"
      >
        Home
      </a>
      <a
        href="#ranks"
        className="px-3 py-2 text-gray-300 hover:text-white transition-colors text-sm lg:text-base"
      >
        Rank Boost
      </a>
      <a
        href="#mmrboost"
        className="px-3 py-2 text-gray-300 hover:text-white transition-colors text-sm lg:text-base"
      >
        MMR Boost
      </a>
      <a
        href="#about"
        className="px-3 py-2 text-gray-300 hover:text-white transition-colors text-sm lg:text-base"
      >
        About
      </a>
      <a
        href="#contact"
        className="px-3 py-2 text-gray-300 hover:text-white transition-colors text-sm lg:text-base"
      >
        Contact
      </a>
      
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="gradient"
              rounded="lg"
              className="ml-2"
            >
              <User className="h-4 w-4 mr-2" />
              Account
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-gray-900 border-gray-800 text-gray-200">
            <DropdownMenuItem className="hover:bg-gray-800" onClick={onLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          variant="gradient"
          rounded="lg"
          className="ml-2"
          onClick={onLogin}
        >
          Login
        </Button>
      )}
    </div>
  );
};

export default DesktopMenu;
