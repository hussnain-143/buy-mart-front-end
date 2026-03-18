import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  Lock,
  Check,
  ArrowLeft,
  ShieldCheck,
  User,
  Mail,
  Zap,
  Loader
} from "lucide-react";

import { createCheckoutSession } from "../services/stripe.service";

const Checkout = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.firstName) {
      setFormData({
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email || ""
      });
    }
  }, []);

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
        navigate("/login");
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
    <div className="min-h-screen bg-[#0f172a] text-white selection:bg-primary/30 py-24 px-6 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-20 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-1 bg-primary rounded-full"></div>
                <span className="text-white/20 font-black text-[10px] uppercase tracking-[0.4em]">Subscription Authority</span>
            </div>
            <button
                onClick={() => navigate("/subscription")}
                className="group inline-flex items-center gap-3 text-white/30 hover:text-white transition-all font-black uppercase tracking-[0.3em] text-[10px] mb-12 bg-white/5 px-6 py-3 rounded-full border border-white/5"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform text-primary" /> Return to Selection
            </button>
            <h1 className="text-8xl font-black italic tracking-tighter uppercase leading-none">
                Upgrade <span className="text-primary">Status</span>
            </h1>
            <p className="text-white/40 text-xl font-medium mt-6 max-w-lg leading-relaxed">
                Elevate your account to high-velocity vendor protocols.
            </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-16 items-start animate-fade-in-up delay-100">
          {/* Checkout Form */}
          <div className="lg:col-span-7 space-y-12">
            <form onSubmit={handleSubmit} className="space-y-12">
              {/* Personal Information */}
              <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[48px] p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                
                <h2 className="text-3xl font-black italic mb-10 flex items-center gap-6 uppercase tracking-tight">
                  <User className="text-primary" size={32} /> Identity Verification
                </h2>
                
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-4">Full Identifier</label>
                    <div className="relative group">
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            required
                            placeholder="John Doe"
                            className="w-full bg-white/[0.03] text-white border border-white/10 rounded-[28px] px-8 py-5 focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all text-lg font-medium placeholder:text-white/5"
                        />
                        <User className="absolute right-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-primary transition-colors" size={20} />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-4">Neural Comms (Email)</label>
                    <div className="relative group">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            placeholder="john@example.com"
                            className="w-full bg-white/[0.03] text-white border border-white/10 rounded-[28px] px-8 py-5 focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all text-lg font-medium placeholder:text-white/5"
                        />
                        <Mail className="absolute right-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-primary transition-colors" size={20} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information Banner */}
              <div className="bg-primary/5 border border-primary/10 rounded-[48px] p-12 flex items-center gap-10 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/[0.02] animate-pulse"></div>
                <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-2xl shadow-primary/40 relative z-10">
                  <CreditCard size={40} className="text-white" />
                </div>
                <div className="relative z-10">
                  <h4 className="text-2xl font-black italic tracking-tight uppercase">Stripe Protocol Active</h4>
                  <p className="text-white/30 text-base font-medium mt-2 leading-relaxed">
                    You will be redirected to the secure Stripe terminal. No sensitive financial data is stored on our nodes.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={isProcessing} 
                className="group relative w-full py-10 bg-primary text-white font-black uppercase tracking-[0.6em] text-[11px] rounded-[40px] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-primary/50 flex items-center justify-center gap-6 overflow-hidden disabled:opacity-50"
              >
                <div className="absolute inset-x-0 bottom-0 h-2 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                {isProcessing ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    Authenticating Node...
                  </>
                ) : (
                  <>
                    <Lock size={20} className="group-hover:rotate-12 transition-transform" />
                    Initialize Settlement
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 mt-12 lg:mt-0">
            <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[56px] p-12 shadow-2xl overflow-hidden relative border-t-primary/20">
              {/* Decorative Edge */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-[80px] -mr-24 -mt-24"></div>

              <h2 className="text-4xl font-black mb-12 border-b border-white/5 pb-8 italic tracking-tighter uppercase">Plan Manifesto</h2>

              {/* Plan Details Card */}
              <div className="bg-white/[0.03] rounded-[40px] p-10 border border-white/5 mb-10 relative group">
                <div className="absolute top-6 right-6 p-3 bg-primary/20 text-primary rounded-2xl">
                    <Zap size={20} className="animate-pulse" />
                </div>
                <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.5em] mb-4">Core Selection</h3>
                <h4 className="text-3xl font-black italic tracking-tight uppercase mb-6">Premium Vendor</h4>
                <div className="flex items-baseline gap-3">
                  <span className="text-6xl font-black text-white tracking-tighter tabular-nums italic">$5.00</span>
                  <span className="text-white/20 font-black uppercase text-xs tracking-widest">/ Month</span>
                </div>
              </div>

              {/* Features List */}
              <div className="mb-12 space-y-6">
                <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] ml-2">Protocol Perks:</h4>
                <ul className="grid gap-4">
                  {subscriptionFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-4 bg-white/[0.02] p-5 rounded-3xl border border-white/5 hover:bg-white/[0.04] transition-all group">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        <Check size={16} strokeWidth={3} />
                      </div>
                      <span className="text-sm font-bold text-white/60 group-hover:text-white transition-colors">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Breakdown */}
              <div className="pt-10 border-t border-white/5 space-y-6">
                <div className="flex justify-between items-center text-white/20 font-black uppercase tracking-[0.3em] text-[10px]">
                  <span>Session Subtotal</span>
                  <span className="text-white/60 tracking-tighter text-base">$5.00</span>
                </div>
                <div className="flex justify-between items-end pt-4">
                  <div className="space-y-1">
                    <span className="text-white/20 font-black uppercase tracking-[0.5em] text-[9px] block">Settlement total</span>
                    <span className="text-3xl font-black italic tracking-tighter uppercase">Grand Total</span>
                  </div>
                  <span className="text-7xl font-black text-primary tracking-tighter tabular-nums shadow-primary/20 drop-shadow-2xl italic leading-none">$5.00</span>
                </div>
              </div>

              {/* Security Footer */}
              <div className="mt-12 flex flex-col items-center gap-6">
                <div className="flex items-center gap-4 text-white/10 text-[9px] font-black uppercase tracking-[0.4em]">
                    <ShieldCheck size={16} className="text-primary/40" /> SSL-256 Quantum Secure
                </div>
                <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest italic">30-day resolution guarantee active</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
