
import React from "react";
import { Link } from "react-router-dom";

interface NavLogoProps {
  className?: string;
}

const NavLogo: React.FC<NavLogoProps> = ({ className }) => {
  return (
    <Link to="/" className={`text-lg md:text-xl lg:text-2xl font-bold text-white ${className || ""}`}>
      <span className="text-mlbb-purple">ML</span>Booster
    </Link>
  );
};

export default NavLogo;
