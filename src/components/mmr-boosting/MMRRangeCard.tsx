
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { MMRFormValues } from "@/hooks/useMMRBoostingForm";

interface MMRRangeCardProps {
  form: UseFormReturn<MMRFormValues>;
  watchedValues: {
    currentMMR?: number;
    targetMMR?: number;
    hero?: string;
  };
}

const MMRRangeCard: React.FC<MMRRangeCardProps> = ({ form, watchedValues = {} }) => {
  const { currentMMR = 1000, targetMMR = 1500 } = watchedValues;
  
  const handleCurrentMMRChange = (value: number[]) => {
    // Ensure current MMR is never greater than target MMR
    const newCurrentMMR = value[0];
    form.setValue("currentMMR", newCurrentMMR);
    
    if (newCurrentMMR > (form.getValues().targetMMR || 0)) {
      form.setValue("targetMMR", newCurrentMMR);
    }
  };
  
  const handleTargetMMRChange = (value: number[]) => {
    // Ensure target MMR is never less than current MMR
    const newTargetMMR = value[0];
    form.setValue("targetMMR", newTargetMMR);
    
    if (newTargetMMR < (form.getValues().currentMMR || 0)) {
      form.setValue("currentMMR", newTargetMMR);
    }
  };

  const handleCurrentMMRInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 6000) {
      handleCurrentMMRChange([value]);
    }
  };

  const handleTargetMMRInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 6000) {
      handleTargetMMRChange([value]);
    }
  };

  return (
    <Card className="bg-mlbb-darkpurple/40 border-mlbb-purple/20 h-full">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">MMR Settings</h3>
        
        <div className="space-y-8">
          <FormField
            control={form.control}
            name="currentMMR"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormLabel className="text-white">Current MMR</FormLabel>
                <div className="flex items-center gap-4">
                  <FormControl>
                    <Slider
                      value={[currentMMR]}
                      min={0}
                      max={6000}
                      step={50}
                      onValueChange={handleCurrentMMRChange}
                      className="flex-1"
                    />
                  </FormControl>
                  <Input
                    type="number"
                    value={currentMMR}
                    onChange={handleCurrentMMRInputChange}
                    className="w-24 bg-black/30 border-mlbb-purple/30 text-white"
                    min={0}
                    max={6000}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="targetMMR"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormLabel className="text-white">Target MMR</FormLabel>
                <div className="flex items-center gap-4">
                  <FormControl>
                    <Slider
                      value={[targetMMR]}
                      min={0}
                      max={6000}
                      step={50}
                      onValueChange={handleTargetMMRChange}
                      className="flex-1"
                    />
                  </FormControl>
                  <Input
                    type="number"
                    value={targetMMR}
                    onChange={handleTargetMMRInputChange}
                    className="w-24 bg-black/30 border-mlbb-purple/30 text-white"
                    min={0}
                    max={6000}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="space-y-2">
            <p className="text-sm text-gray-400">MMR Boost Range</p>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>0</span>
              <span>1500</span>
              <span>3000</span>
              <span>4500</span>
              <span>6000</span>
            </div>
            <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-mlbb-purple to-mlbb-gold" 
                style={{ 
                  width: `${((targetMMR - currentMMR) / 6000) * 100}%`,
                  marginLeft: `${(currentMMR / 6000) * 100}%`
                }}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MMRRangeCard;
