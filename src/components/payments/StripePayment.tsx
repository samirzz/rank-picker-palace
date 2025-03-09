
import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

// Replace with your actual publishable key
// In production, you should use an environment variable
const stripePromise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx");

interface StripeCheckoutFormProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const StripeCheckoutForm: React.FC<StripeCheckoutFormProps> = ({
  amount,
  onSuccess,
  onCancel,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    // In a real implementation, you would create a payment intent on your server
    // and confirm the payment here. This is just a simulation.
    setTimeout(() => {
      setProcessing(false);
      onSuccess();
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mb-4">
        <h3 className="text-sm md:text-base font-medium text-white">Card Details</h3>
        <p className="text-2xs md:text-xs text-gray-400 mt-1">
          Enter your credit or debit card information
        </p>
      </div>

      <div className="p-3 rounded-md border border-gray-700 bg-gray-800">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#fff",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#fa755a",
                iconColor: "#fa755a",
              },
            },
          }}
        />
      </div>

      {error && (
        <div className="text-red-500 text-xs md:text-sm mt-2">{error}</div>
      )}

      <div className="flex justify-between mt-4">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="text-gray-400 hover:text-white"
        >
          <ArrowLeft className="mr-1 h-3 w-3 md:h-4 md:w-4" />
          Back
        </Button>
        <Button
          type="submit"
          disabled={!stripe || processing}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90"
        >
          {processing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay $${amount.toFixed(2)}`
          )}
        </Button>
      </div>
    </form>
  );
};

interface StripePaymentProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const StripePayment: React.FC<StripePaymentProps> = ({
  amount,
  onSuccess,
  onCancel,
}) => {
  return (
    <Elements stripe={stripePromise}>
      <StripeCheckoutForm amount={amount} onSuccess={onSuccess} onCancel={onCancel} />
    </Elements>
  );
};

export default StripePayment;
