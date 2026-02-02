import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  CreditCard,
  Lock,
  Check,
  ArrowLeft,
  ShieldCheck,
  User,
} from "lucide-react";

import { createCheckoutSession } from "../services/stripe.service";

/* ===============================
   Design Constants
================================ */
const cardStyle =
  "bg-white rounded-2xl p-8 shadow-xl border border-gray-200";
const innerInfoStyle =
  "flex flex-col md:flex-row items-start md:items-center gap-4 p-4 rounded-xl border border-gray-100 shadow-inner bg-gray-50";
const submitButtonStyle =
  "w-full bg-primary text-white font-bold py-4 px-8 rounded-xl hover:bg-primary/90 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3";
const orderSummaryCardStyle =
  "bg-white rounded-2xl p-8 shadow-xl border border-gray-200 sticky top-8";
const planCardStyle =
  "bg-gray-50 rounded-xl p-3 mb-3 border border-gray-100";

const Checkout = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user._id || user.id;

      if (!userId) {
        alert("Please login to subscribe");
        setIsProcessing(false);
        return;
      }

      const response = await createCheckoutSession({
        userId,
        email: formData.email,
        fullName: formData.fullName,
      });

      if (response.data?.url) {
        window.location.href = response.data.url;
      } else {
        console.error("No checkout URL returned");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setIsProcessing(false);
    }
  };

  const subscriptionFeatures = [
    "Unlimited product listings",
    "Advanced analytics dashboard",
    "Priority customer support",
    "Secure payment processing",
  ];

  return (
    <div className="min-h-screen py-12 bg-gray-50 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <NavLink
            to="/subscription"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition mb-4"
          >
            <ArrowLeft size={20} />
            Back to Subscription
          </NavLink>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            Complete Your <span className="text-primary">Purchase</span>
          </h1>
          <p className="text-gray-500 mt-2">
            Secure checkout powered by industry-leading encryption
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className={cardStyle}>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <User className="text-primary" size={24} />
                  Personal Information
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className={cardStyle}>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <CreditCard className="text-primary" size={24} />
                  Payment Method
                </h2>

                <p className="text-gray-500 mb-4">
                  You will be redirected to Stripe's secure checkout page to complete your payment.
                </p>

                <div className={innerInfoStyle}>
                  <CreditCard size={36} className="text-primary flex-shrink-0" />
                  <div className="text-gray-700 text-sm md:text-base">
                    <p className="font-semibold">Bank-Level Security</p>
                    <p>
                      We use 256-bit SSL encryption to ensure your data is safe.
                      Your transaction is processed securely by Stripe.
                    </p>
                    <span className="text-xs text-gray-400">Secured by Stripe</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button type="submit" disabled={isProcessing} className={submitButtonStyle}>
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Lock size={20} />
                    Complete Payment on Stripe
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className={orderSummaryCardStyle}>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>

              {/* Plan Details */}
              <div className={planCardStyle}>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Premium Vendor Plan</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-primary">$5</span>
                  <span className="text-gray-500">/month</span>
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">What's Included:</h4>
                <ul className="space-y-2">
                  {subscriptionFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-500">
                      <Check size={16} className="text-primary flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-200 pt-4 mb-6 space-y-2">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>$5.00</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-800 pt-2 border-t border-gray-200">
                  <span>Total Due Today</span>
                  <span className="text-primary">$5.00</span>
                </div>
              </div>

              {/* Security Badge */}
              <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                <ShieldCheck className="text-primary flex-shrink-0" size={24} />
                <div>
                  <p className="text-sm font-semibold text-gray-800">Secure Payment</p>
                  <p className="text-xs text-gray-400">
                    Your payment information is encrypted and secure
                  </p>
                </div>
              </div>

              {/* Money Back Guarantee */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-400">30-day money-back guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
