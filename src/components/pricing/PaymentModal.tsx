
import React from "react";
import PaymentMethods from "@/components/payments/PaymentMethods";

interface PaymentModalProps {
  price: number;
  onSuccess: () => Promise<void>;
  onCancel: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ price, onSuccess, onCancel }) => {
  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md">
        <PaymentMethods 
          amount={price} 
          onSuccess={onSuccess}
          onCancel={onCancel}
        />
      </div>
    </div>
  );
};

export default PaymentModal;
