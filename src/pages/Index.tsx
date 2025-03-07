
import React, { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import RankSelectionSection from "@/components/RankSelectionSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import ContactSection from "@/components/ContactSection";
import { Rank } from "@/data/ranks";

const Index = () => {
  const [currentRank, setCurrentRank] = useState<Rank | null>(null);
  const [targetRank, setTargetRank] = useState<Rank | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById("ranks");
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
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
      
      <WhyChooseUs isIntersecting={isIntersecting} />
      
      <ContactSection />
      
      <Footer />
    </div>
  );
};

export default Index;
