import { useState } from "react";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";

import api from "../utils/api";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentForm = ({ deliveryData, onClose, onPaymentSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const amount = deliveryData?.amount ?? deliveryData?.baseFare ?? 0;

  const handlePayment = async () => {
    if (!stripe || !elements) return;

    setIsProcessing(true);
    try {
      const res = await api.post("/payments/create-delivery-payment-intent", {
        deliveryId: deliveryData.deliveryId
      });

      const { clientSecret } = res.data;

      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: deliveryData.customerName,
          },
        }
      });

      if (error) {
        toast.error(error.message);
      } else {
        await api.post("/payments/confirm-delivery-payment", {
          paymentIntentId: clientSecret.split('_secret_')[0],
          deliveryId: deliveryData.deliveryId
        });

        toast.success("Payment successful!");
        onPaymentSuccess({ deliveryId: deliveryData.deliveryId });
        onClose();
      }
    } catch (err) {
      console.error(err);
      toast.error("Payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Complete Payment</h3>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Delivery Summary</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p><span className="font-medium">Order ID:</span> #{deliveryData.deliveryId?.slice(-6)}</p>
                <p><span className="font-medium">Amount:</span> ₹{amount}</p>
                <p><span className="font-medium">Customer:</span> {deliveryData.customerName}</p>
              </div>
            </div>

            <div className="border border-gray-300 rounded-lg p-4">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }}
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="flex-1 px-4 py-2 bg-brand hover:bg-brand-dark text-white rounded-lg disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : `Pay ₹${amount}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentPopup = ({ isOpen, onClose, deliveryData, onPaymentSuccess }) => {
  if (!isOpen || !deliveryData) return null;

  return (
    <Elements stripe={stripePromise}>
      <PaymentForm
        deliveryData={deliveryData}
        onClose={onClose}
        onPaymentSuccess={onPaymentSuccess}
      />
    </Elements>
  );
};

export default PaymentPopup;
