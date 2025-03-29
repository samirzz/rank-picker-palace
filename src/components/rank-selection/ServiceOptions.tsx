
import React from "react";
import ServiceOptionsToggle from "@/components/ServiceOptionsToggle";
import { ServiceOption } from "@/hooks/useServiceOptions";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ServiceOptionsProps {
  serviceOptions: ServiceOption[];
  onToggle: (id: string) => void;
}

const ServiceOptions: React.FC<ServiceOptionsProps> = ({ serviceOptions, onToggle }) => {
  const navigate = useNavigate();
  
  const handleCustomOrderClick = () => {
    navigate('/custom-order');
  };

  return (
    <>
      <ServiceOptionsToggle 
        serviceOptions={serviceOptions}
        onToggle={onToggle}
      />
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-400 mb-3">Need a special boosting service not listed here?</p>
        <Button 
          onClick={handleCustomOrderClick}
          variant="outline" 
          className="bg-transparent border border-mlbb-purple text-mlbb-purple hover:bg-mlbb-purple/10"
        >
          Request Custom Order
        </Button>
      </div>
    </>
  );
};

export default ServiceOptions;
