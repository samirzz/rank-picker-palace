
import React from "react";
import { Input } from "@/components/ui/input";

interface StarsInputProps {
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const StarsInput: React.FC<StarsInputProps> = ({ label, value, onChange }) => {
  return (
    <div className="mt-4 glass-panel p-4 animate-fade-in">
      <label className="block text-sm text-mlbb-lightpurple mb-2">
        {label}
      </label>
      <Input
        type="number"
        min="0"
        max="5"
        value={value}
        onChange={onChange}
        className="bg-black/20 border-mlbb-purple/30 text-white"
      />
      <div className="flex items-center mt-2 text-xs text-gray-400">
        <div className="flex items-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <span 
              key={i} 
              className={`w-4 h-4 mx-0.5 rounded-full ${i < value ? 'bg-mlbb-gold' : 'bg-gray-700'}`}
            />
          ))}
        </div>
        <span className="ml-2">{value}/5</span>
      </div>
    </div>
  );
};

export default StarsInput;
