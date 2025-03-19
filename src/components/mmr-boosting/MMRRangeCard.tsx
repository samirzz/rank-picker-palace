
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";

interface MMRRangeCardProps {
  form: UseFormReturn<z.infer<any>>;
  watchedValues: {
    currentMMR: number;
    targetMMR: number;
  };
}

const MMRRangeCard: React.FC<MMRRangeCardProps> = ({ form, watchedValues }) => {
  return (
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
  );
};

export default MMRRangeCard;
