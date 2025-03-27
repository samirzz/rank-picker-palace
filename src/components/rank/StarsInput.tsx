
import React from "react";
import { Input } from "@/components/ui/input";
import { Star } from "lucide-react";

interface StarsInputProps {
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxStars?: number;
  className?: string;
}

const StarsInput: React.FC<StarsInputProps> = ({ 
  label, 
  value, 
  onChange,
  maxStars = 5,
  className = ""
}) => {
  return (
    <div className={`mt-4 glass-panel p-4 animate-fade-in ${className}`}>
      <label className="block text-sm text-mlbb-lightpurple mb-2">
        {label}
      </label>
      <Input
        type="number"
        min="0"
        max={maxStars}
        value={value}
        onChange={onChange}
        className="bg-black/20 border-mlbb-purple/30 text-white"
      />
      <div className="flex items-center mt-2 text-xs text-gray-400">
        <div className="flex items-center">
          {Array.from({ length: maxStars }).map((_, i) => (
            <Star 
              key={i} 
              className={`w-4 h-4 mx-0.5 ${i < value ? 'text-mlbb-gold fill-mlbb-gold' : 'text-gray-700'}`}
            />
          ))}
        </div>
        <span className="ml-2">{value}/{maxStars}</span>
      </div>
    </div>
  );
};

export default StarsInput;
