
import React from "react";
import { Menu, X } from "lucide-react";

interface MobileMenuToggleProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

const MobileMenuToggle: React.FC<MobileMenuToggleProps> = ({ isOpen, toggleMenu }) => {
  return (
    <button
      onClick={toggleMenu}
      className="text-white focus:outline-none p-2 md:hidden"
      aria-label="Toggle mobile menu"
    >
      {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </button>
  );
};

export default MobileMenuToggle;
