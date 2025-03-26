
import React from "react";
import { Form } from "@/components/ui/form";
import MMRPricingCard from "./MMRPricingCard";
import HeroSelectCard from "./mmr-boosting/HeroSelectCard";
import MMRRangeCard from "./mmr-boosting/MMRRangeCard";
import { useMMRBoostingForm } from "@/hooks/useMMRBoostingForm";

interface MMRBoostingSectionProps {
  isIntersecting?: boolean;
}

const MMRBoostingSection: React.FC<MMRBoostingSectionProps> = ({ 
  isIntersecting = true  // Default to true to ensure visibility if not provided
}) => {
  const {
    form,
    watchedValues,
    heroes,
    selectedHero,
    price,
    searchOpen,
    setSearchOpen,
    loading
  } = useMMRBoostingForm();

  return (
    <section 
      id="mmrboost"
      className={`glass-container pt-16 pb-24 px-4 md:px-8 lg:px-12 transition-all duration-1000 ${
        isIntersecting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
      }`}
    >
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
            <span className="text-mlbb-gold">MMR</span> Boosting Service
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Select your hero, current MMR, and desired MMR to get started with your boosting journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Form {...form}>
              <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <HeroSelectCard 
                    form={form}
                    heroes={heroes}
                    selectedHero={selectedHero}
                    searchOpen={searchOpen}
                    setSearchOpen={setSearchOpen}
                  />
                  <MMRRangeCard 
                    form={form} 
                    watchedValues={watchedValues} 
                  />
                </div>
              </form>
            </Form>
          </div>

          <div>
            <MMRPricingCard
              hero={selectedHero}
              currentMMR={watchedValues.currentMMR ?? 0}
              targetMMR={watchedValues.targetMMR ?? 0}
              price={price}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MMRBoostingSection;
