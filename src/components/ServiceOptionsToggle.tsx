
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ServiceOption } from "@/types/service.types";
import { Info } from "lucide-react";

interface ServiceOptionsToggleProps {
  serviceOptions: ServiceOption[];
  onToggle: (optionId: string, isActive: boolean) => void;
}

const ServiceOptionsToggle: React.FC<ServiceOptionsToggleProps> = ({ 
  serviceOptions = [], // Provide default empty array to prevent undefined errors
  onToggle 
}) => {
  return (
    <div className="glass-panel p-5 md:p-6 space-y-4">
      <h3 className="text-base md:text-lg font-semibold text-white mb-3">Additional Services</h3>
      
      <div className="space-y-3">
        {serviceOptions && serviceOptions.map((option) => (
          <div key={option.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm md:text-base text-white">{option.name}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>{option.description}</p>
                    <p className="text-mlbb-gold mt-1">+{option.percentageIncrease}% to total price</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-mlbb-gold">+{option.percentageIncrease}%</span>
              <Switch
                checked={option.isActive || false}
                onCheckedChange={(checked) => onToggle(option.id, checked)}
                className={`${
                  option.isActive ? "bg-mlbb-purple" : "bg-gray-600"
                }`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceOptionsToggle;
