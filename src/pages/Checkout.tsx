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
            // Retrieve current user ID from local storage or context if possible
            // For now, assuming we use the form data email to identify or create customer
            // But better to pass the logged in user ID if available. 
            // Since I don't see AuthContext usage, I'll check generic logic.
            // Let's assume we pass what we have.

            const user = JSON.parse(localStorage.getItem("user") || "{}");
            const userId = user._id || user.id;

            if (!userId) {
                // If not logged in, maybe redirect to login? 
                // For this task, I'll proceed assuming user is logged in or we pass null and backend handles it (backend required userId though)
                alert("Please login to subscribe");
                setIsProcessing(false);
                return;
            }

            const response = await createCheckoutSession({
                userId: userId,
                email: formData.email,
                fullName: formData.fullName,
            });

            if (response.data && response.data.url) {
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
        <div className="min-h-screen py-12 bg-gradient-to-br from-primary/5 via-white to-accent/10 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <NavLink
                        to="/subscription"
                        className="inline-flex items-center gap-2 text-secondary/70 hover:text-primary transition mb-4"
                    >
                        <ArrowLeft size={20} />
                        Back to Subscription
                    </NavLink>
                    <h1 className="text-4xl md:text-5xl font-bold text-secondary">
                        Complete Your <span className="text-primary">Purchase</span>
                    </h1>
                    <p className="text-secondary/70 mt-2">
                        Secure checkout powered by industry-leading encryption
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Personal Information */}
                            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/50">
                                <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-3">
                                    <User className="text-primary" size={24} />
                                    Personal Information
                                </h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-secondary mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-secondary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-secondary mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-secondary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Information */}
                            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/50">
                                <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-3">
                                    <CreditCard className="text-primary" size={24} />
                                    Payment Method
                                </h2>
                                <p className="text-secondary/70 mb-4">
                                    You will be redirected to Stripe's secure checkout page to complete your payment.
                                </p>
                                <div className="flex items-center gap-4 text-secondary/50">
                                    <div className="flex gap-2">
                                        <div className="h-8 w-12 bg-gray-200 rounded"></div>
                                        <div className="h-8 w-12 bg-gray-200 rounded"></div>
                                        <div className="h-8 w-12 bg-gray-200 rounded"></div>
                                    </div>
                                    <span className="text-sm">Secured by Stripe</span>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isProcessing}
                                className="w-full bg-primary text-white font-bold py-4 px-8 rounded-xl hover:bg-primary/90 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                            >
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
                        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/50 sticky top-8">
                            <h2 className="text-2xl font-bold text-secondary mb-6">
                                Order Summary
                            </h2>

                            {/* Plan Details */}
                            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-3 mb-3">
                                <h3 className="text-lg font-bold text-secondary mb-2">
                                    Premium Vendor Plan
                                </h3>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-bold text-primary">$5</span>
                                    <span className="text-secondary/60">/month</span>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="mb-6">
                                <h4 className="font-semibold text-secondary mb-3">
                                    What's Included:
                                </h4>
                                <ul className="space-y-2">
                                    {subscriptionFeatures.map((feature, index) => (
                                        <li
                                            key={index}
                                            className="flex items-start gap-2 text-sm text-secondary/70"
                                        >
                                            <Check
                                                size={16}
                                                className="text-primary flex-shrink-0 mt-0.5"
                                            />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Price Breakdown */}
                            <div className="border-t border-secondary/10 pt-4 mb-6 space-y-2">
                                <div className="flex justify-between text-secondary/70">
                                    <span>Subtotal</span>
                                    <span>$5.00</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-secondary pt-2 border-t border-secondary/10">
                                    <span>Total Due Today</span>
                                    <span className="text-primary">$5.00</span>
                                </div>
                            </div>

                            {/* Security Badge */}
                            <div className="bg-secondary/5 rounded-xl p-4 flex items-center gap-3">
                                <ShieldCheck className="text-primary flex-shrink-0" size={24} />
                                <div>
                                    <p className="text-sm font-semibold text-secondary">
                                        Secure Payment
                                    </p>
                                    <p className="text-xs text-secondary/60">
                                        Your payment information is encrypted and secure
                                    </p>
                                </div>
                            </div>

                            {/* Money Back Guarantee */}
                            <div className="mt-4 text-center">
                                <p className="text-xs text-secondary/60">
                                    30-day money-back guarantee
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
