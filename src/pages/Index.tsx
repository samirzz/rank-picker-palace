
import React, { useEffect } from 'react';
import HeroSection from '@/components/HeroSection';
import WhyChooseUs from '@/components/WhyChooseUs';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import DiscordCommunity from '@/components/DiscordCommunity';
import { useInView } from 'react-intersection-observer';
import RankSelectionSection from '@/components/RankSelectionSection';
import MMRBoostingSection from '@/components/MMRBoostingSection';
import { Rank } from '@/data/ranks';
import { initializeRanksWithCorrectStars } from '@/data/rankInitializer';

export default function Index() {
  const [whyChooseUsRef, whyChooseUsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [rankSectionRef, rankSectionInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [mmrBoostingRef, mmrBoostingInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [discordRef, discordInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [contactRef, contactInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const [currentRank, setCurrentRank] = React.useState<Rank | null>(null);
  const [targetRank, setTargetRank] = React.useState<Rank | null>(null);

  // Initialize ranks when the page loads
  useEffect(() => {
    // Initialize ranks with correct star counts
    initializeRanksWithCorrectStars();
  }, []);

  const handleCurrentRankSelect = (rank: Rank, subdivisionIndex?: number) => {
    setCurrentRank(rank);
  };

  const handleTargetRankSelect = (rank: Rank, subdivisionIndex?: number) => {
    setTargetRank(rank);
  };

  return (
    <div className="bg-mlbb-dark min-h-screen text-white">
      <HeroSection />
      
      <div ref={whyChooseUsRef}>
        <WhyChooseUs isIntersecting={whyChooseUsInView} />
      </div>
      
      <div ref={rankSectionRef}>
        <RankSelectionSection 
          isIntersecting={rankSectionInView}
          currentRank={currentRank}
          setCurrentRank={handleCurrentRankSelect}
          targetRank={targetRank}
          setTargetRank={handleTargetRankSelect}
        />
      </div>
      
      <div ref={mmrBoostingRef}>
        <MMRBoostingSection isIntersecting={mmrBoostingInView} />
      </div>
      
      <div ref={discordRef}>
        <DiscordCommunity />
      </div>
      
      <div ref={contactRef}>
        <ContactSection />
      </div>

      <Footer />
    </div>
  );
}
