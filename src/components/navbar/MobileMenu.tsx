
import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: SupabaseUser | null;
  onLogout: () => Promise<void>;
  onLogin: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  user,
  onLogout,
  onLogin,
}) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-gray-800 animate-slide-down">
      <div className="container mx-auto py-4 px-4 flex flex-col space-y-2">
        <a
          href="#home"
          className="text-gray-300 hover:text-white py-3 px-4 rounded-md hover:bg-mlbb-purple/10 transition-colors"
          onClick={onClose}
        >
          Home
        </a>
        <a
          href="#ranks"
          className="text-gray-300 hover:text-white py-3 px-4 rounded-md hover:bg-mlbb-purple/10 transition-colors"
          onClick={onClose}
        >
          Rank Boost
        </a>
        <a
          href="#mmrboost"
          className="text-gray-300 hover:text-white py-3 px-4 rounded-md hover:bg-mlbb-purple/10 transition-colors"
          onClick={onClose}
        >
          MMR Boost
        </a>
        <a
          href="#about"
          className="text-gray-300 hover:text-white py-3 px-4 rounded-md hover:bg-mlbb-purple/10 transition-colors"
          onClick={onClose}
        >
          About
        </a>
        <a
          href="#contact"
          className="text-gray-300 hover:text-white py-3 px-4 rounded-md hover:bg-mlbb-purple/10 transition-colors"
          onClick={onClose}
        >
          Contact
        </a>
        
        {user ? (
          <Button
            variant="gradient"
            rounded="lg"
            size="full"
            className="mt-2"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Log out
          </Button>
        ) : (
          <Button
            variant="gradient"
            rounded="lg"
            size="full"
            className="mt-2"
            onClick={onLogin}
          >
            Login
          </Button>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
