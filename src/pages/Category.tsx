import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Laptop,
  Shirt,
  Sparkles,
  HomeIcon,
  Watch,
  Gamepad2,
  ShoppingBag,
  ArrowRight,
  Search,
} from "lucide-react";

const Categories = () => {
  const categories = [
    {
      name: "Electronics",
      icon: Laptop,
      desc: "Smart gadgets, devices & innovation.",
      color: "from-blue-500/20 to-cyan-500/20",
    },
    {
      name: "Fashion",
      icon: Shirt,
      desc: "Luxury wear, streetwear & trends.",
      color: "from-purple-500/20 to-pink-500/20",
    },
    {
      name: "Beauty",
      icon: Sparkles,
      desc: "Skincare, fragrance & elegance.",
      color: "from-rose-500/20 to-red-500/20",
    },
    {
      name: "Home & Living",
      icon: HomeIcon,
      desc: "Modern decor & lifestyle essentials.",
      color: "from-amber-500/20 to-orange-500/20",
    },
    {
      name: "Watches",
      icon: Watch,
      desc: "Timeless luxury & premium designs.",
      color: "from-emerald-500/20 to-teal-500/20",
    },
    {
      name: "Gaming",
      icon: Gamepad2,
      desc: "Consoles, accessories & gear.",
      color: "from-indigo-500/20 to-violet-500/20",
    },
    {
      name: "Accessories",
      icon: ShoppingBag,
      desc: "Minimal premium add-ons for style.",
      color: "from-yellow-500/20 to-lime-500/20",
    },
  ];

  const trendingCategories = ["Electronics", "Fashion", "Watches", "Beauty"];

  const [search, setSearch] = useState("");

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-secondary px-6 py-14">
      <div className="max-w-7xl mx-auto">
        {/* ========================= */}
        {/* Page Header */}
        {/* ========================= */}
        <div className="mb-14 text-center">
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tight">
            Categories
          </h1>
          <p className="text-white/50 mt-4 max-w-2xl mx-auto font-medium">
            Explore curated premium categories built for modern lifestyle and
            luxury intelligence.
          </p>
        </div>

        {/* ========================= */}
        {/* Search Bar */}
        {/* ========================= */}
        <div className="sticky top-6 z-20 mb-16 bg-secondary/80 backdrop-blur-2xl border border-white/10 rounded-[40px] p-5 shadow-xl max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
              <Search size={22} className="text-primary" />
            </div>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories..."
              className="flex-1 px-6 py-4 rounded-full bg-white/5 text-white placeholder-white/30 focus:outline-none border border-white/10 focus:border-primary transition-all duration-300"
            />
          </div>
        </div>

        {/* ========================= */}
        {/* Trending Categories */}
        {/* ========================= */}
        <div className="mb-14">
          <h2 className="text-xl font-black text-white uppercase tracking-[0.3em] mb-6">
            Trending
          </h2>

          <div className="flex flex-wrap gap-4">
            {trendingCategories.map((cat, idx) => (
              <NavLink
                key={idx}
                to={`/categories/${cat.toLowerCase().replace(/ & /g, "-")}`}
                className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-black uppercase tracking-[0.25em] text-[11px] hover:bg-primary hover:text-white hover:border-primary transition-all duration-500"
              >
                {cat}
              </NavLink>
            ))}
          </div>
        </div>

        {/* ========================= */}
        {/* Categories Grid */}
        {/* ========================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredCategories.map((cat, idx) => {
            const Icon = cat.icon;

            return (
              <NavLink
                key={idx}
                to={`/categories/${cat.name.toLowerCase().replace(/ & /g, "-")}`}
                className="group relative bg-white/5 border border-white/10 rounded-[45px] p-10 overflow-hidden backdrop-blur-2xl shadow-xl hover:shadow-primary/10 transition-all duration-700 hover:-translate-y-2"
              >
                {/* Glow Background */}
                <div
                  className={`absolute -inset-32 bg-gradient-to-br ${cat.color} blur-[100px] opacity-20 group-hover:opacity-50 transition-opacity duration-700`}
                />

                {/* Icon */}
                <div className="relative z-10 mb-8 w-20 h-20 flex items-center justify-center rounded-[28px] bg-white/5 border border-white/10 group-hover:border-primary/30 group-hover:bg-primary/10 transition-all duration-700">
                  <Icon
                    size={40}
                    className="text-white/70 group-hover:text-primary transition-colors duration-700"
                  />
                </div>

                {/* Text */}
                <h3 className="relative z-10 text-2xl font-black text-white mb-4 group-hover:text-primary transition-colors duration-700">
                  {cat.name}
                </h3>

                <p className="relative z-10 text-white/50 font-medium leading-relaxed mb-8">
                  {cat.desc}
                </p>

                {/* CTA */}
                <div className="relative z-10 flex items-center gap-3 text-white/40 font-black uppercase tracking-[0.25em] text-[11px] group-hover:text-primary transition-colors duration-700">
                  Explore
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-2 transition-transform duration-700"
                  />
                </div>

                {/* Border Glow */}
                <div className="absolute inset-0 rounded-[45px] border border-white/5 group-hover:border-primary/30 transition-colors duration-700" />
              </NavLink>
            );
          })}
        </div>

        {/* ========================= */}
        {/* Empty State */}
        {/* ========================= */}
        {filteredCategories.length === 0 && (
          <div className="text-center mt-20 text-white/40 font-bold">
            No categories found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
