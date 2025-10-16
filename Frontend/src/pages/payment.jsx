import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';

import Navbar from '../components/layout/navbar';
import api from '../utils/api';

// Load Stripe with publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

const PaymentForm = ({ planType, amount, clientSecret, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setLoading(true);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        }
      });

      if (error) {
        toast.error(error.message);
      } else if (paymentIntent?.status === 'succeeded') {
        // Confirm payment on backend
        await api.post('/payments/confirm-payment', {
          paymentIntentId: paymentIntent.id,
          planType
        });

        toast.success('Payment successful! Your plan is now active.');
        onSuccess();
      }
    } catch {
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cardElementOptions = {
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
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-md mx-auto py-12 px-4">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center mb-6">
            Complete Your Payment
          </h2>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-lg capitalize">{planType} Plan</h3>
            <p className="text-2xl font-bold text-indigo-600">${amount}/month</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Information
              </label>
              <div className="border border-gray-300 rounded-md p-3">
                <CardElement options={cardElementOptions} />
              </div>
            </div>

            <button
              type="submit"
              disabled={!stripe || loading}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : `Pay $${amount}`}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/services')}
              className="text-indigo-600 hover:text-indigo-800"
            >
              ← Back to Services
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [planType, setPlanType] = useState('');
  const [amount, setAmount] = useState(0);
  const [clientSecret, setClientSecret] = useState('');
  const [stripeReady, setStripeReady] = useState(false);

  useEffect(() => {
    const state = location.state;
    if (!state?.planType) {
      navigate('/services');
      return;
    }

    const planPrices = {
      starter: 99,
      professional: 299
    };

    const selectedPlanType = state.planType;
    setPlanType(selectedPlanType);
    setAmount(planPrices[selectedPlanType] ?? 0);

    const fetchClientSecret = async () => {
      try {
        const response = await api.post('/payments/create-payment-intent', {
          planType: selectedPlanType
        });
        setClientSecret(response.data.clientSecret);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to create payment intent');
        navigate('/services');
      }
    };

    fetchClientSecret();
  }, [location.state, navigate]);

  useEffect(() => {
    stripePromise.then(() => setStripeReady(true));
  }, []);

  if (!stripeReady || !clientSecret) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment system...</p>
        </div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PaymentForm
        planType={planType}
        amount={amount}
        clientSecret={clientSecret}
        onSuccess={() => navigate('/customer/dashboard')}
      />
    </Elements>
  );
};

export default Payment;
