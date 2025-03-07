
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

const HeroSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToRanks = () => {
    const ranksSection = document.getElementById("ranks");
    if (ranksSection) {
      ranksSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-20 px-4"
    >
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(139,92,246,0.15)_0%,_transparent_70%)]"></div>
      </div>

      {/* Animated background lines (subtle) */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute h-[1px] w-full top-1/4 left-0 bg-gradient-to-r from-transparent via-mlbb-purple/20 to-transparent animate-pulse-subtle"></div>
        <div className="absolute h-[1px] w-full top-2/4 left-0 bg-gradient-to-r from-transparent via-mlbb-purple/10 to-transparent animate-pulse-subtle" style={{ animationDelay: '1s' }}></div>
        <div className="absolute h-[1px] w-full top-3/4 left-0 bg-gradient-to-r from-transparent via-mlbb-purple/20 to-transparent animate-pulse-subtle" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto z-10 text-center">
        <div 
          className={`transition-all duration-1000 delay-100 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <span className="inline-block text-sm md:text-base px-4 py-2 rounded-full bg-mlbb-purple/10 border border-mlbb-purple/30 text-mlbb-lightpurple mb-4 animate-pulse-subtle">
            #1 Mobile Legends Boosting Service
          </span>
        </div>

        <h1 
          className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight transition-all duration-1000 delay-300 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          Boost Your <span className="text-glow text-mlbb-purple">Rank</span>
          <br />
          Enhance Your <span className="text-mlbb-gold">Legacy</span>
        </h1>

        <p 
          className={`text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10 transition-all duration-1000 delay-500 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          Professional Mobile Legends boosting service with guaranteed results.
          Our elite boosters will help you achieve your desired rank quickly and securely.
        </p>

        <div 
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 delay-700 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <Button 
            onClick={scrollToRanks}
            className="bg-gradient-to-r from-mlbb-purple to-mlbb-darkpurple text-white px-8 py-6 text-lg rounded-lg hover:shadow-lg hover:shadow-mlbb-purple/50 transition-all duration-300 button-glow"
          >
            Boost Now
          </Button>
          <Button 
            variant="outline" 
            className="border-mlbb-purple/50 text-mlbb-lightpurple hover:bg-mlbb-purple/10 px-8 py-6 text-lg rounded-lg transition-all duration-300"
          >
            View Pricing
          </Button>
        </div>
      </div>

      {/* Scroll down indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={scrollToRanks}
          className="text-mlbb-purple hover:text-mlbb-lightpurple hover:bg-transparent rounded-full h-12 w-12 flex items-center justify-center border border-mlbb-purple/30"
        >
          <ArrowDown className="h-6 w-6" />
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
