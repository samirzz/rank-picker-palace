
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { User, Search } from "lucide-react";
import { Hero } from "@/types/hero.types";
import HeroCard from "../HeroCard";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";

interface HeroSelectCardProps {
  form: UseFormReturn<z.infer<any>>;
  heroes: Hero[];
  selectedHero: Hero | null;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
}

const HeroSelectCard: React.FC<HeroSelectCardProps> = ({
  form,
  heroes,
  selectedHero,
  searchOpen,
  setSearchOpen,
}) => {
  const { setValue } = form;

  return (
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
            <FormItem className="flex flex-col">
              <FormLabel className="text-white">Hero</FormLabel>
              <Popover open={searchOpen} onOpenChange={setSearchOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <div
                      className="flex h-10 w-full items-center justify-between rounded-md border border-mlbb-purple/30 bg-black/30 px-3 py-2 text-white"
                      role="combobox"
                      aria-expanded={searchOpen}
                    >
                      {field.value ? (
                        heroes.find((hero) => hero.id === field.value)?.name
                      ) : (
                        <span className="text-gray-400">Search for a hero...</span>
                      )}
                      <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </div>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 bg-black/90 border-mlbb-purple/30">
                  <Command>
                    <CommandInput 
                      placeholder="Search hero..." 
                      className="h-9 text-white" 
                    />
                    <CommandList>
                      <CommandEmpty>No hero found.</CommandEmpty>
                      <CommandGroup>
                        {heroes.map((hero) => (
                          <CommandItem
                            key={hero.id}
                            value={hero.id}
                            onSelect={(value) => {
                              setValue("hero", value);
                              setSearchOpen(false);
                            }}
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
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
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
  );
};

export default HeroSelectCard;
