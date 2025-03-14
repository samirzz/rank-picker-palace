
import React, { useState, useEffect } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Hero, getHeroes, calculateMMRBoostPrice, getHeroPlaceholderImage } from "@/data/heroes";
import { Badge } from "@/components/ui/badge";
import { Star, Trophy, User, DollarSign } from "lucide-react";
import HeroCard from "./HeroCard";
import MMRPricingCard from "./MMRPricingCard";

interface MMRBoostingSectionProps {
  isIntersecting?: boolean;
}

const formSchema = z.object({
  hero: z.string().min(1, "Please select a hero"),
  currentMMR: z
    .number()
    .min(0, "MMR cannot be negative")
    .max(4000, "Maximum MMR is 4000"),
  targetMMR: z
    .number()
    .min(0, "MMR cannot be negative")
    .max(4000, "Maximum MMR is 4000"),
});

const MMRBoostingSection: React.FC<MMRBoostingSectionProps> = ({ 
  isIntersecting = false 
}) => {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
  const [price, setPrice] = useState<number>(0);
  const [showDetails, setShowDetails] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hero: "",
      currentMMR: 1000,
      targetMMR: 1500,
    },
  });

  const { watch, setValue, formState, reset } = form;
  const watchedValues = watch();
  
  // Load heroes on initial render and when they change
  useEffect(() => {
    const loadHeroes = () => {
      const latestHeroes = getHeroes();
      setHeroes(latestHeroes);
      
      // If the selected hero was deleted, reset selection
      if (selectedHero && !latestHeroes.some(h => h.id === selectedHero.id)) {
        setSelectedHero(null);
        setValue("hero", "");
      }
    };
    
    loadHeroes();
    
    // Listen for hero list changes from admin panel
    window.addEventListener('adminHeroesChange', loadHeroes);
    window.addEventListener('adminBasePriceChange', () => {
      // Recalculate price when base price changes
      if (selectedHero) {
        const newPrice = calculateMMRBoostPrice(
          watchedValues.currentMMR,
          watchedValues.targetMMR,
          selectedHero
        );
        setPrice(newPrice);
      }
    });
    
    return () => {
      window.removeEventListener('adminHeroesChange', loadHeroes);
      window.removeEventListener('adminBasePriceChange', () => {});
    };
  }, [selectedHero, setValue, watchedValues.currentMMR, watchedValues.targetMMR]);
  
  useEffect(() => {
    if (watchedValues.hero) {
      const hero = heroes.find(h => h.id === watchedValues.hero) || null;
      setSelectedHero(hero);
    } else {
      setSelectedHero(null);
    }
    
    // Ensure target MMR is always >= current MMR
    if (watchedValues.currentMMR > watchedValues.targetMMR) {
      setValue("targetMMR", watchedValues.currentMMR);
    }
    
    // Calculate price
    if (selectedHero) {
      const newPrice = calculateMMRBoostPrice(
        watchedValues.currentMMR,
        watchedValues.targetMMR,
        selectedHero
      );
      setPrice(newPrice);
    } else {
      setPrice(0);
    }
  }, [watchedValues, heroes, selectedHero, setValue]);

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
                  <Card className="bg-mlbb-darkpurple/40 border-mlbb-purple/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <User className="mr-2 h-5 w-5 text-mlbb-gold" />
                        Select Your Hero
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Choose the hero you want to boost
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="hero"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Hero</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="bg-black/30 border-mlbb-purple/30 text-white">
                                  <SelectValue placeholder="Select a hero" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-black/90 border-mlbb-purple/30">
                                {heroes.map((hero) => (
                                  <SelectItem 
                                    key={hero.id} 
                                    value={hero.id}
                                    className="text-white hover:bg-mlbb-purple/20"
                                  >
                                    <div className="flex items-center">
                                      <span className="mr-2">{hero.name}</span>
                                      <Badge 
                                        variant="outline" 
                                        className="ml-2 text-mlbb-gold border-mlbb-gold/40"
                                      >
                                        {Array(hero.difficulty).fill("★").join("")}
                                      </Badge>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {selectedHero && (
                        <div className="mt-4">
                          <HeroCard hero={selectedHero} />
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-mlbb-darkpurple/40 border-mlbb-purple/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Trophy className="mr-2 h-5 w-5 text-mlbb-gold" />
                        MMR Range
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Set your current and target MMR
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <FormField
                          control={form.control}
                          name="currentMMR"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Current MMR</FormLabel>
                              <div className="flex flex-col space-y-2">
                                <div className="flex items-center space-x-4">
                                  <FormControl>
                                    <Slider
                                      min={0}
                                      max={4000}
                                      step={50}
                                      value={[field.value]}
                                      onValueChange={(value) => field.onChange(value[0])}
                                      className="flex-1"
                                    />
                                  </FormControl>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      value={field.value}
                                      onChange={(e) => field.onChange(Number(e.target.value))}
                                      className="w-20 bg-black/30 border-mlbb-purple/30 text-white"
                                    />
                                  </FormControl>
                                </div>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="targetMMR"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Target MMR</FormLabel>
                              <div className="flex flex-col space-y-2">
                                <div className="flex items-center space-x-4">
                                  <FormControl>
                                    <Slider
                                      min={watchedValues.currentMMR}
                                      max={4000}
                                      step={50}
                                      value={[field.value]}
                                      onValueChange={(value) => field.onChange(value[0])}
                                      className="flex-1"
                                    />
                                  </FormControl>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      value={field.value}
                                      onChange={(e) => field.onChange(Number(e.target.value))}
                                      min={watchedValues.currentMMR}
                                      className="w-20 bg-black/30 border-mlbb-purple/30 text-white"
                                    />
                                  </FormControl>
                                </div>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="pt-2">
                          <div className="flex justify-between text-xs text-gray-400">
                            <span>MMR Difference:</span>
                            <span className="text-mlbb-gold font-medium">
                              {Math.max(0, watchedValues.targetMMR - watchedValues.currentMMR)} pts
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </form>
            </Form>
          </div>

          <div>
            <MMRPricingCard
              hero={selectedHero}
              currentMMR={watchedValues.currentMMR}
              targetMMR={watchedValues.targetMMR}
              price={price}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MMRBoostingSection;
