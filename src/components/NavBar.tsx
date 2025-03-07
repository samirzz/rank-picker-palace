
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const NavBar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/80 backdrop-blur-lg py-2 md:py-3 shadow-lg"
          : "bg-transparent py-3 md:py-5"
      }`}
    >
      <div className="container px-4 mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-lg md:text-xl lg:text-2xl font-bold text-white">
            <span className="text-mlbb-purple">ML</span>Booster
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
          <a
            href="#home"
            className="text-gray-300 hover:text-white transition-colors text-sm lg:text-base"
          >
            Home
          </a>
          <a
            href="#ranks"
            className="text-gray-300 hover:text-white transition-colors text-sm lg:text-base"
          >
            Rank Boost
          </a>
          <a
            href="#about"
            className="text-gray-300 hover:text-white transition-colors text-sm lg:text-base"
          >
            About
          </a>
          <a
            href="#contact"
            className="text-gray-300 hover:text-white transition-colors text-sm lg:text-base"
          >
            Contact
          </a>
          <Button
            className="bg-gradient-to-r from-mlbb-purple to-mlbb-darkpurple hover:opacity-90 text-white px-4 lg:px-6 text-sm lg:text-base transition-all"
          >
            Login
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-gray-800 animate-slide-down">
          <div className="container mx-auto py-4 px-4 flex flex-col space-y-4">
            <a
              href="#home"
              className="text-gray-300 hover:text-white py-2 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </a>
            <a
              href="#ranks"
              className="text-gray-300 hover:text-white py-2 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Rank Boost
            </a>
            <a
              href="#about"
              className="text-gray-300 hover:text-white py-2 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </a>
            <a
              href="#contact"
              className="text-gray-300 hover:text-white py-2 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </a>
            <Button
              className="bg-gradient-to-r from-mlbb-purple to-mlbb-darkpurple hover:opacity-90 text-white transition-all w-full"
            >
              Login
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
