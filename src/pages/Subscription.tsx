import React from "react";
import { NavLink } from "react-router-dom";
import {
  ShoppingCart,
  TrendingUp,
  CreditCard,
  Users,
  BarChart3,
  Headphones,
  Check,
  ArrowRight,
} from "lucide-react";

const Subscription = () => {
  const features = [
    {
      icon: ShoppingCart,
      title: "Product / Service Listings",
      description: "Unlimited product uploads and management",
    },
    {
      icon: Users,
      title: "Order & Customer Management",
      description: "Manage orders and customer relationships",
    },
    {
      icon: CreditCard,
      title: "Secure Payments & Payouts",
      description: "Safe transactions with instant payouts",
    },
    {
      icon: TrendingUp,
      title: "Sales Analytics & Reports",
      description: "Detailed insights into your sales performance",
    },
    {
      icon: BarChart3,
      title: "Vendor Dashboard",
      description: "Complete control over your store operations",
    },
    {
      icon: Headphones,
      title: "Platform Support",
      description: "24/7 dedicated support team assistance",
    },
  ];

  return (
    <div className="min-h-screen py-20 flex items-center justify-center bg-gradient-to-br from-primary/5 via-white to-accent/10 px-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-secondary mb-4">
            Become a <span className="text-primary">Seller</span>
          </h1>
          <p className="text-xl text-secondary/70 mb-3">
            Join thousands of successful sellers on our platform
          </p>
          <p className="text-3xl font-bold text-primary">$5<span className="text-lg text-secondary/70">/month</span></p>
        </div>

        {/* Subscription Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/50 mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-secondary">Premium Vendor Plan</h2>
              <p className="text-secondary/60 mt-2">Everything you need to grow your business</p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold text-primary">$5</div>
              <p className="text-secondary/60">per month</p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/20">
                      <Icon size={24} className="text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-secondary mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-secondary/60 text-sm">
                      {feature.description}
                    </p>
                  </div>
                  <Check size={20} className="text-primary flex-shrink-0 mt-1" />
                </div>
              );
            })}
          </div>



          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <NavLink
              to="/vendor-form"
              className="flex-1 inline-flex items-center justify-center gap-3 px-10 py-4 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 shadow-lg transition"
            >
              Continue to Setup <ArrowRight size={20} />
            </NavLink>
            <NavLink
              to="/home"
              className="flex-1 inline-flex items-center justify-center px-10 py-4 rounded-xl border-2 border-secondary/20 text-secondary font-semibold hover:bg-secondary/5 transition"
            >
              Back to Home
            </NavLink>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-12 border border-white/50 shadow-xl">
          <h2 className="text-3xl font-bold text-secondary mb-10 text-center">Frequently Asked Questions</h2>
          <div className="space-y-5 max-w-3xl mx-auto">
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white font-bold text-sm mt-1">1</div>
              <div>
                <h3 className="text-lg font-semibold text-secondary">Can I cancel anytime?</h3>
                <p className="text-secondary/70 mt-1">Yes, cancel anytime without penalties. No commitments.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white font-bold text-sm mt-1">2</div>
              <div>
                <h3 className="text-lg font-semibold text-secondary">What payment methods are accepted?</h3>
                <p className="text-secondary/70 mt-1">We accept all major credit cards and digital payment methods.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white font-bold text-sm mt-1">3</div>
              <div>
                <h3 className="text-lg font-semibold text-secondary">Is there a setup fee?</h3>
                <p className="text-secondary/70 mt-1">No setup fees. Start selling immediately after subscription.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
