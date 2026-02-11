import React from "react";
import { NavLink } from "react-router-dom";
import {
  ArrowRight,
  Laptop,
  Shirt,
  Sparkles,
  HomeIcon,
  Package,
  Zap,
} from "lucide-react";

// ========================
// Color Palette
// ========================
const COLORS = {
  electronics: "from-blue-500/20 to-cyan-500/20",
  fashion: "from-purple-500/20 to-pink-500/20",
  beauty: "from-rose-500/20 to-red-500/20",
  home: "from-amber-500/20 to-orange-500/20",
  accent: "text-yellow-400",
  accentBg: "bg-accent",
  text: "text-white",
  secondary: "text-secondary",
};

// ========================
// Component
// ========================
const Home = () => {
  const categories = [
    { name: "Electronics", icon: Laptop, color: COLORS.electronics },
    { name: "Fashion", icon: Shirt, color: COLORS.fashion },
    { name: "Beauty", icon: Sparkles, color: COLORS.beauty },
    { name: "Home & Living", icon: HomeIcon, color: COLORS.home },
  ];

  const brands = ["ROLEX", "GUCCI", "APPLE", "SONY", "PRADA", "DYSON", "TESLA"];

  const topSellingProducts = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    name: `Premium Product ${i + 1}`,
    price: "$" + (99 + i * 50),
    oldPrice: i % 2 === 0 ? "$" + (149 + i * 50) : null,
  }));

  const deals = [
    { id: 1, name: "Summer Sale", discount: "30%", description: "On all Electronics", icon: Zap },
    { id: 2, name: "Fashion Week", discount: "50%", description: "Exclusive Fashion Items", icon: Shirt },
    { id: 3, name: "Luxury Deals", discount: "25%", description: "Premium Home & Living", icon: HomeIcon },
  ];

  const latestProducts = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    name: `Latest Product ${i + 1}`,
    price: "$" + (120 + i * 40),
  }));

  return (
    <div className="min-h-screen bg-secondary overflow-x-hidden">

      {/* Hero Section */}
      <section className="relative h-screen min-h-[900px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-bg..jpeg"
            alt="Hero Background"
            className="w-full h-full object-cover scale-110 animate-pulse-slow brightness-80 contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 via-secondary/60 to-secondary" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-[1400px] mx-auto">
          <h1 className="text-6xl md:text-[100px] font-black text-white mb-8 leading-[0.85] tracking-tighter">
            Elevate Your <br />
            <span className="text-accent underline decoration-8 underline-offset-16">Lifestyle</span>
          </h1>
          <p className="text-lg md:text-2xl text-white/50 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            Curated products blending design and utility for a premium living experience.
          </p>

          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <NavLink
              to="/shop"
              className={`inline-flex items-center justify-center px-14 py-5 ${COLORS.accentBg} text-secondary font-black uppercase tracking-[0.4em] text-[12px] rounded-full hover:scale-105 transition-all duration-700`}
            >
              Explore Collection <ArrowRight size={20} className="ml-4" />
            </NavLink>

            <NavLink
              to="/deals"
              className={`inline-flex items-center justify-center px-14 py-5 bg-white/5 text-white font-black uppercase tracking-[0.4em] text-[12px] rounded-full border border-white/20 hover:bg-white/10 transition-all duration-500`}
            >
              View Deals <Zap size={20} className="ml-4" />
            </NavLink>
          </div>
        </div>

        {/* Brand Marquee */}
        <div className="absolute bottom-0 left-0 w-full py-12 bg-white/5 backdrop-blur-md border-t border-white/5">
          <div className="flex items-center gap-24 animate-marquee whitespace-nowrap px-10">
            {[...brands, ...brands].map((brand, i) => (
              <span
                key={i}
                className="text-3xl md:text-5xl font-black text-white/10 hover:text-accent/30 transition-colors cursor-default tracking-widest"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="relative -mt-24 px-6 mb-32 z-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-10">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <NavLink
                  key={cat.name}
                  to={`/categories/${cat.name.toLowerCase().replace(/ & /g, "-")}`}
                  className="group relative h-64 flex flex-col items-center justify-center rounded-[40px] overflow-hidden transition-all duration-700 hover:-translate-y-4 shadow-2xl"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl border border-white/10 group-hover:border-accent/30 transition-colors" />
                  <div
                    className={`absolute -inset-20 bg-gradient-to-br ${cat.color} blur-[80px] opacity-10 group-hover:opacity-40 transition-opacity`}
                  />
                  <div className="relative z-10 mb-6 p-6 rounded-full bg-white/5 border border-white/5 group-hover:bg-accent/10 group-hover:border-accent/20 transition-all duration-500 group-hover:scale-110">
                    <Icon size={48} className="text-white group-hover:text-accent transition-colors" />
                  </div>
                  <span className="relative z-10 text-[12px] font-black uppercase tracking-[0.3em] text-white/50 group-hover:text-white transition-colors">
                    {cat.name}
                  </span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Products */}
      <section className="py-32 px-6 bg-secondary/10">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-12 tracking-tight text-center">
            Latest Products
          </h2>
          <div className="flex gap-6 overflow-x-auto px-2 snap-x snap-mandatory scrollbar-hide">
            {latestProducts.map((product) => (
              <div
                key={product.id}
                className="snap-start min-w-[320px] flex-shrink-0 bg-white/5 p-6 rounded-3xl border border-white/10 shadow-lg hover:shadow-accent/10 transition-all duration-500"
              >
                <div className="relative h-56 flex items-center justify-center bg-gradient-to-br from-white/5 to-white/10 rounded-2xl mb-4">
                  <Package size={80} className="text-white/20 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                <span className="text-2xl font-black text-accent">{product.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deals */}
      <section className="py-32 px-6 bg-secondary/5">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-12 tracking-tight text-center">
            Hot Deals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {deals.map((deal) => {
              const Icon = deal.icon;
              return (
                <div
                  key={deal.id}
                  className="group relative bg-white/5 p-10 rounded-3xl border border-white/10 shadow-lg hover:shadow-accent/20 transition-all duration-500 text-center"
                >
                  <Icon size={48} className="text-accent mb-4 mx-auto" />
                  <h3 className="text-2xl font-black text-white mb-2">{deal.name}</h3>
                  <p className="text-white/50 mb-4">{deal.description}</p>
                  <span className="text-4xl font-black text-accent">{deal.discount}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Hot Selling Slider (Auto Scroll, Curve Slider) */}
      <section className="py-32 px-6 bg-secondary/10">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-12 tracking-tight text-center">
            Hot Selling
          </h2>
          <div className="relative overflow-hidden">
            <div className="flex gap-6 animate-scroll-hot">
              {topSellingProducts.concat(topSellingProducts).map((product, i) => (
                <div
                  key={i}
                  className="min-w-[370px] flex-shrink-0 bg-white/5 p-6 rounded-3xl border border-white/10 shadow-lg hover:shadow-accent/10 transition-all duration-500"
                >
                  <div className="relative h-56 flex items-center justify-center bg-gradient-to-br from-white/5 to-white/10 rounded-2xl mb-4">
                    <Package size={80} className="text-white/20 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                  <div className="flex gap-2 items-center">
                    <span className="text-2xl font-black text-accent">{product.price}</span>
                    {product.oldPrice && (
                      <span className="text-sm text-white/30 line-through font-bold">{product.oldPrice}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tailwind Animations */}
      <style>
        {`
          @keyframes scroll-hot {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-scroll-hot {
            display: flex;
            animation: scroll-hot 30s linear infinite;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
    </div>
  );
};

export default Home;
