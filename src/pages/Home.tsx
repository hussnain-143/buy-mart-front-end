import React from "react";
import { NavLink } from "react-router-dom";
import {
  ArrowRight,
  Zap,
  Shirt,
  Laptop,
  Sparkles,
  HomeIcon,
  Package,
  Truck,
  Shield,
} from "lucide-react";

const Home = () => {
  const categories = [
    { name: "Electronics", icon: Laptop, color: "from-blue-500/20 to-cyan-500/20" },
    { name: "Fashion", icon: Shirt, color: "from-purple-500/20 to-pink-500/20" },
    { name: "Beauty", icon: Sparkles, color: "from-rose-500/20 to-red-500/20" },
    { name: "Home & Living", icon: HomeIcon, color: "from-amber-500/20 to-orange-500/20" },
  ];

  const featuredProducts = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    name: `Premium Product ${i + 1}`,
    price: "$" + (99 + i * 50),
    oldPrice: i % 2 === 0 ? "$" + (149 + i * 50) : null,
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Full Screen */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Gradient + Placeholder Image */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary to-accent/10" />
        <div className="absolute inset-0 bg-black/50" />
        {/* Replace with real hero image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Package size={400} className="text-white/5" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
            Premium Shopping <br />
            <span className="text-accent">Redefined</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-3xl mx-auto">
            Discover exclusive deals, fast delivery, and unmatched quality.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <NavLink
              to="/shop"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full bg-accent text-secondary text-lg font-semibold hover:scale-105 transition-transform"
            >
              Shop Now <ArrowRight size={24} />
            </NavLink>
            <NavLink
              to="/deals"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full border-2 border-white/30 text-white text-lg font-medium backdrop-blur-sm hover:bg-white/10 transition"
            >
              <Zap size={24} /> View Deals
            </NavLink>
            <NavLink
              to="/subscription"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full border-2 border-accent text-accent text-lg font-semibold backdrop-blur-sm hover:bg-accent/10 transition"
            >
              Become a Seller <ArrowRight size={24} />
            </NavLink>
          </div>
        </div>
      </section>

      {/* Glassmorphism Categories - Floating Above */}
      <section className="relative -mt-32 px-6 mb-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <NavLink
                  key={cat.name}
                  to={`/categories/${cat.name.toLowerCase().replace(/ & /g, "-")}`}
                  className="group relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10 text-center hover:bg-white/10 hover:border-accent/50 hover:-translate-y-4 transition-all duration-500 shadow-2xl"
                >
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${cat.color} opacity-30 group-hover:opacity-50 transition`} />
                  <Icon size={64} className="relative z-10 mx-auto mb-6 text-white group-hover:text-accent transition" />
                  <p className="relative z-10 text-xl font-semibold text-white group-hover:text-accent transition">
                    {cat.name}
                  </p>
                </NavLink>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-white/70">Handpicked just for you</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-secondary/50 backdrop-blur-sm rounded-2xl overflow-hidden hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 border border-white/10"
              >
                <div className="h-72 bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center">
                  <Package size={100} className="text-white/20 group-hover:scale-110 transition" />
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-medium text-white mb-3 group-hover:text-accent transition">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-2xl font-bold text-accent">{product.price}</span>
                    {product.oldPrice && (
                      <span className="text-lg text-white/50 line-through">
                        {product.oldPrice}
                      </span>
                    )}
                  </div>
                  <button className="w-full py-4 rounded-xl bg-accent text-secondary font-semibold hover:opacity-90 transition">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deals Banner */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-accent via-accent/80 to-accent/60 p-16 text-center text-secondary">
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10">
              <h2 className="text-5xl md:text-7xl font-bold mb-6">
                Flash Sale – Up to 70% Off
              </h2>
              <p className="text-2xl mb-10">Limited time • Top brands • Don't miss out</p>
              <NavLink
                to="/deals"
                className="inline-flex items-center gap-4 px-12 py-6 rounded-full bg-secondary text-white text-xl font-bold hover:bg-white transition"
              >
                Grab Deals <ArrowRight size={28} />
              </NavLink>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 px-6 bg-secondary/30">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Stay Updated
          </h2>
          <p className="text-xl text-white/70 mb-10">
            Get exclusive deals and new arrivals straight to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-8 py-5 rounded-full bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-4 focus:ring-accent/50 transition"
              required
            />
            <button
              type="submit"
              className="px-10 py-5 rounded-full bg-accent text-secondary font-bold hover:opacity-90 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;