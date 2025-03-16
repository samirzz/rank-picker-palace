
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
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-lg md:text-xl lg:text-2xl font-bold text-white">
            <span className="text-mlbb-purple">ML</span>Booster
          </span>
        </div>

        {/* Desktop Navigation */}
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
          <Button
            variant="gradient"
            rounded="lg"
            className="ml-2"
          >
            Login
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white focus:outline-none p-2"
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
          <div className="container mx-auto py-4 px-4 flex flex-col space-y-2">
            <a
              href="#home"
              className="text-gray-300 hover:text-white py-3 px-4 rounded-md hover:bg-mlbb-purple/10 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </a>
            <a
              href="#ranks"
              className="text-gray-300 hover:text-white py-3 px-4 rounded-md hover:bg-mlbb-purple/10 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Rank Boost
            </a>
            <a
              href="#mmrboost"
              className="text-gray-300 hover:text-white py-3 px-4 rounded-md hover:bg-mlbb-purple/10 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              MMR Boost
            </a>
            <a
              href="#about"
              className="text-gray-300 hover:text-white py-3 px-4 rounded-md hover:bg-mlbb-purple/10 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </a>
            <a
              href="#contact"
              className="text-gray-300 hover:text-white py-3 px-4 rounded-md hover:bg-mlbb-purple/10 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </a>
            <Button
              variant="gradient"
              rounded="lg"
              size="full"
              className="mt-2"
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
