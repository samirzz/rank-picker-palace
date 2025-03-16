
import React, { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import RankSelectionSection from "@/components/RankSelectionSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import ContactSection from "@/components/ContactSection";
import { Rank, getAdminRanks } from "@/data/ranks";
import MMRBoostingSection from "@/components/MMRBoostingSection";
import DiscordCommunity from "@/components/DiscordCommunity";

const Index = () => {
  const [currentRank, setCurrentRank] = useState<Rank | null>(null);
  const [targetRank, setTargetRank] = useState<Rank | null>(null);
  
  // State for section visibility
  const [isRankSectionVisible, setIsRankSectionVisible] = useState(false);
  const [isMMRSectionVisible, setIsMMRSectionVisible] = useState(false);
  const [isDiscordVisible, setIsDiscordVisible] = useState(false);
  const [isAboutSectionVisible, setIsAboutSectionVisible] = useState(false);

  useEffect(() => {
    // Create observers for each section
    const observers = [
      { id: "ranks", setter: setIsRankSectionVisible },
      { id: "mmrboost", setter: setIsMMRSectionVisible },
      { id: "discord-community", setter: setIsDiscordVisible },
      { id: "about", setter: setIsAboutSectionVisible }
    ];
    
    // Set up each observer
    const setupObservers = observers.map(({ id, setter }) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setter(entry.isIntersecting);
        },
        { threshold: 0.1 }
      );
      
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
      
      return { observer, element };
    });
    
    // Cleanup function
    return () => {
      setupObservers.forEach(({ observer, element }) => {
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-mlbb-blue to-black text-white">
      <NavBar />
      
      <main className="flex-1">
        <HeroSection />
        
        <RankSelectionSection 
          isIntersecting={isRankSectionVisible}
          currentRank={currentRank}
          setCurrentRank={setCurrentRank}
          targetRank={targetRank}
          setTargetRank={setTargetRank}
        />
        
        <section id="discord-community" className="py-12 md:py-16 bg-gradient-to-r from-mlbb-blue/30 to-black/30">
          <div className="container-sm mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              <span className="text-glow">Join Our Community</span>
            </h2>
            <div className={`transition-all duration-1000 transform ${isDiscordVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
              <div className="max-w-md mx-auto">
                <DiscordCommunity />
              </div>
            </div>
          </div>
        </section>
        
        <MMRBoostingSection isIntersecting={isMMRSectionVisible} />
        
        <WhyChooseUs isIntersecting={isAboutSectionVisible} />
        
        <ContactSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
