
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
import { Rank, ranks } from "@/data/ranks";

const Index: React.FC = () => {
  const { ref: discordRef, inView: discordInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const { ref: rankRef, inView: rankInView } = useInView({
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
        <section id="home">
          <HeroSection />
        </section>
        
        <section id="ranks" className="py-16 md:py-24" ref={rankRef}>
          <RankSelectionSection 
            isIntersecting={rankInView}
            currentRank={currentRank}
            setCurrentRank={handleCurrentRankSelect}
            targetRank={targetRank}
            setTargetRank={handleTargetRankSelect}
          />
        </section>
        
        <section id="mmrboost" className="py-16 md:py-24 bg-gradient-to-b from-black to-gray-900">
          <MMRBoostingSection />
        </section>
        
        <section id="about" className="py-16 md:py-24">
          <WhyChooseUs />
        </section>
        
        <section 
          id="community" 
          className="py-16 md:py-24 bg-gradient-to-b from-gray-900 to-black"
          ref={discordRef}
        >
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-12">
              Join Our Community
            </h2>
            <DiscordCommunity isIntersecting={discordInView} />
          </div>
        </section>
        
        <section id="contact" className="py-16 md:py-24">
          <ContactSection />
        </section>
      </main>
      
      <LiveChat />
      <Footer />
    </div>
  );
};

export default Index;
