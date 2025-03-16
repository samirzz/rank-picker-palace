
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
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isMMRSectionVisible, setIsMMRSectionVisible] = useState(false);
  const [isDiscordVisible, setIsDiscordVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const mmrObserver = new IntersectionObserver(
      ([entry]) => {
        setIsMMRSectionVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    
    const discordObserver = new IntersectionObserver(
      ([entry]) => {
        setIsDiscordVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById("ranks");
    if (element) {
      observer.observe(element);
    }

    const mmrElement = document.getElementById("mmrboost");
    if (mmrElement) {
      mmrObserver.observe(mmrElement);
    }
    
    const discordElement = document.getElementById("discord-community");
    if (discordElement) {
      discordObserver.observe(discordElement);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
      if (mmrElement) {
        mmrObserver.unobserve(mmrElement);
      }
      if (discordElement) {
        discordObserver.unobserve(discordElement);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-mlbb-blue to-black text-white">
      <NavBar />
      
      <HeroSection />
      
      <RankSelectionSection 
        isIntersecting={isIntersecting}
        currentRank={currentRank}
        setCurrentRank={setCurrentRank}
        targetRank={targetRank}
        setTargetRank={setTargetRank}
      />
      
      <section id="discord-community" className="py-12 md:py-16">
        <div className="container mx-auto px-4">
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
      
      <WhyChooseUs isIntersecting={isIntersecting} />
      
      <ContactSection />
      
      <Footer />
    </div>
  );
};

export default Index;
