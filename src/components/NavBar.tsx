
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import NavLogo from "@/components/navbar/NavLogo";
import DesktopMenu from "@/components/navbar/DesktopMenu";
import MobileMenu from "@/components/navbar/MobileMenu";
import MobileMenuToggle from "@/components/navbar/MobileMenuToggle";

const NavBar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogin = () => {
    navigate('/auth');
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/80 backdrop-blur-lg py-2 md:py-3 shadow-lg"
          : "bg-transparent py-3 md:py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <NavLogo />
        </div>

        {/* Desktop Navigation */}
        <DesktopMenu 
          user={user} 
          onLogout={handleLogout} 
          onLogin={handleLogin} 
        />

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <MobileMenuToggle 
            isOpen={isMobileMenuOpen} 
            toggleMenu={toggleMobileMenu} 
          />
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        user={user}
        onLogout={handleLogout}
        onLogin={handleLogin}
      />
    </nav>
  );
};

export default NavBar;
