
import { useState, useEffect } from "react";
import { ServiceOption, ServiceOptions } from "@/types/service.types";

export const defaultServiceOptions: ServiceOption[] = [
  {
    id: "duoBoosting",
    name: "Duo Boosting",
    description: "A professional player will duo with you to achieve your desired rank faster.",
    percentageIncrease: 100,
    isActive: false
  },
  {
    id: "expressBoosting",
    name: "Express Boosting",
    description: "Priority boosting - we'll assign multiple boosters to complete your order faster.",
    percentageIncrease: 20,
    isActive: false
  },
  {
    id: "watchStream",
    name: "Watch Stream",
    description: "Watch your account being boosted through a private stream.",
    percentageIncrease: 15,
    isActive: false
  }
];

export function useServiceOptions(basePrice: number | null = 0) {
  const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>(defaultServiceOptions);
  const [totalPrice, setTotalPrice] = useState<number | null>(basePrice);
  
  useEffect(() => {
    if (basePrice === null || basePrice === undefined) {
      setTotalPrice(null);
      return;
    }
    
    // Calculate total percentage increase from all active options
    const percentageIncrease = serviceOptions.reduce((total, option) => {
      return total + (option.isActive ? option.percentageIncrease : 0);
    }, 0);
    
    // Apply percentage increase to base price
    const calculatedPrice = basePrice * (1 + percentageIncrease / 100);
    setTotalPrice(Math.round(calculatedPrice * 100) / 100); // Round to 2 decimal places
  }, [basePrice, serviceOptions]);
  
  const toggleOption = (optionId: string, isActive: boolean) => {
    setServiceOptions(prevOptions => 
      prevOptions.map(option => 
        option.id === optionId ? { ...option, isActive } : option
      )
    );
  };
  
  return {
    serviceOptions,
    toggleOption,
    totalPrice,
    activeOptions: serviceOptions.filter(option => option.isActive)
  };
}
