
import React, { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import RankSelectionSection from "@/components/RankSelectionSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import ContactSection from "@/components/ContactSection";
import { Rank, getAdminRanks } from "@/data/ranks";
import MMRBoostingSection from "@/components/MMRBoostingSection";

const Index = () => {
  const [currentRank, setCurrentRank] = useState<Rank | null>(null);
  const [targetRank, setTargetRank] = useState<Rank | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isMMRSectionVisible, setIsMMRSectionVisible] = useState(false);

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

    const element = document.getElementById("ranks");
    if (element) {
      observer.observe(element);
    }

    const mmrElement = document.getElementById("mmrboost");
    if (mmrElement) {
      mmrObserver.observe(mmrElement);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
      if (mmrElement) {
        mmrObserver.unobserve(mmrElement);
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
      
      <MMRBoostingSection isIntersecting={isMMRSectionVisible} />
      
      <WhyChooseUs isIntersecting={isIntersecting} />
      
      <ContactSection />
      
      <Footer />
    </div>
  );
};

export default Index;
