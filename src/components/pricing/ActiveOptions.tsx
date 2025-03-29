
import React from "react";
import { ServiceOption } from "@/types/service.types";

interface ActiveOptionsProps {
  options: ServiceOption[];
}

const ActiveOptions: React.FC<ActiveOptionsProps> = ({ options }) => {
  if (options.length === 0) return null;
  
  return (
    <div className="mt-4 pt-4 border-t border-gray-700/30">
      <h4 className="text-sm font-medium text-white mb-2">Additional Services:</h4>
      <ul className="space-y-2">
        {options.map(option => (
          <li key={option.id} className="flex justify-between text-sm">
            <span className="text-gray-300">{option.name}</span>
            <span className="text-mlbb-gold">+{option.percentageIncrease}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActiveOptions;
