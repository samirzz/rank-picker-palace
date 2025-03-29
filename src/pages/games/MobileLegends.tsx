
import React, { useState } from "react";
import { useInView } from "react-intersection-observer";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import RankSelectionSection from "@/components/RankSelectionSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import ContactSection from "@/components/ContactSection";
import MMRBoostingSection from "@/components/MMRBoostingSection";
import DiscordCommunity from "@/components/DiscordCommunity";
import LiveChat from "@/components/LiveChat";
import { Rank } from "@/data/ranks";

const MobileLegends: React.FC = () => {
  const { ref: discordRef, inView: discordInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const { ref: rankRef, inView: rankInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const { ref: mmrRef, inView: mmrInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const [currentRank, setCurrentRank] = useState<Rank | null>(null);
  const [targetRank, setTargetRank] = useState<Rank | null>(null);
  
  const handleCurrentRankSelect = (rank: Rank, subdivisionIndex?: number) => {
    setCurrentRank(rank);
  };
  
  const handleTargetRankSelect = (rank: Rank, subdivisionIndex?: number) => {
    setTargetRank(rank);
  };
  
  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      
      <main>
        <section id="home" className="relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-mlbb-purple/20 via-transparent to-transparent opacity-30"></div>
          <HeroSection />
        </section>
        
        <section id="ranks" className="py-16 md:py-24 relative" ref={rankRef}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(139,92,246,0.08)_0%,_transparent_70%)]"></div>
          <RankSelectionSection 
            isIntersecting={rankInView}
            currentRank={currentRank}
            setCurrentRank={handleCurrentRankSelect}
            targetRank={targetRank}
            setTargetRank={handleTargetRankSelect}
          />
        </section>
        
        <section id="mmrboost" className="py-16 md:py-24 bg-gradient-to-b from-black to-gray-900 relative" ref={mmrRef}>
          <div className="absolute inset-0 bg-grid-mlbb-pattern opacity-5"></div>
          <MMRBoostingSection isIntersecting={mmrInView} />
        </section>
        
        <section id="about" className="py-16 md:py-24 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-mlbb-purple/10 via-transparent to-transparent opacity-40"></div>
          <WhyChooseUs />
        </section>
        
        <section 
          id="community" 
          className="py-16 md:py-24 bg-gradient-to-b from-gray-900 to-black relative"
          ref={discordRef}
        >
          <div className="absolute inset-0 bg-grid-mlbb-pattern opacity-5"></div>
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-12">
              Join Our Community
            </h2>
            <DiscordCommunity isIntersecting={discordInView} />
          </div>
        </section>
        
        <section id="contact" className="py-16 md:py-24 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(139,92,246,0.08)_0%,_transparent_70%)]"></div>
          <ContactSection />
        </section>
      </main>
      
      <LiveChat />
      <Footer />
    </div>
  );
};

export default MobileLegends;
