
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, Gamepad2 } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-mlbb-purple to-mlbb-gold bg-clip-text text-transparent">
          Professional Game Boosting Service
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Reach your desired rank with our elite team of professional boosters. Fast, reliable, and secure.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" className="bg-gradient-to-r from-mlbb-purple to-mlbb-gold text-white hover:opacity-90" asChild>
            <Link to="/game-selection">
              Choose Your Game
              <Gamepad2 className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="border-mlbb-purple text-mlbb-purple hover:bg-mlbb-purple/10" asChild>
            <Link to="/#ranks">
              Get Started
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-xl border border-mlbb-purple/20 hover:border-mlbb-purple/50 transition-all">
            <div className="w-12 h-12 bg-mlbb-purple/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-mlbb-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Fast Delivery</h3>
            <p className="text-gray-400 text-sm">Our professional boosters work 24/7 to ensure your order is completed quickly.</p>
          </div>
          
          <div className="glass-panel p-6 rounded-xl border border-mlbb-purple/20 hover:border-mlbb-purple/50 transition-all">
            <div className="w-12 h-12 bg-mlbb-purple/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-mlbb-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Secure Process</h3>
            <p className="text-gray-400 text-sm">Your account information is encrypted and handled with utmost security.</p>
          </div>
          
          <div className="glass-panel p-6 rounded-xl border border-mlbb-purple/20 hover:border-mlbb-purple/50 transition-all">
            <div className="w-12 h-12 bg-mlbb-purple/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-mlbb-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Guaranteed Results</h3>
            <p className="text-gray-400 text-sm">We guarantee the results you pay for or your money back.</p>
          </div>
        </div>
        
        <div className="mt-12">
          <img
            src="/mlbb-hero-banner.png"
            alt="Mobile Legends Hero Banner"
            className="rounded-2xl shadow-lg mx-auto"
          />
        </div>
      </div>
    </div>
  );
}
