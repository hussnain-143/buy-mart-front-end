import React, { useState } from "react";
import { Package, ShoppingCart, SlidersHorizontal } from "lucide-react";

const Shop = () => {
  // ========================
  // Sample Products
  // ========================
  const products = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    price: "$" + (99 + i * 20),
    category: ["Electronics", "Fashion", "Home"][i % 3],
    oldPrice: i % 2 === 0 ? "$" + (129 + i * 20) : null,
  }));

  // ========================
  // Filters
  // ========================
  const [filters, setFilters] = useState({
    category: "",
    priceRange: "",
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredProducts = products.filter((p) => {
    if (filters.category && p.category !== filters.category) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-secondary px-6 py-12">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
        {/* ========================= */}
        {/* Sidebar Filter (Improved) */}
        {/* ========================= */}
        <aside className="w-full lg:w-72 flex-shrink-0">
          <div className="sticky top-24 bg-white/5 p-7 rounded-[40px] border border-white/10 backdrop-blur-2xl shadow-xl">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
                <SlidersHorizontal size={22} className="text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-widest">
                  Filters
                </h3>
                <p className="text-xs text-white/40 font-semibold">
                  Refine your search
                </p>
              </div>
            </div>

            {/* Category */}
            <div className="mb-7">
              <label className="block text-white/50 mb-2 font-black uppercase tracking-[0.3em] text-[10px]">
                Category
              </label>

              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full px-5 py-3 rounded-full bg-white/5 text-white border border-white/10 focus:outline-none focus:border-primary transition-all duration-300"
              >
                <option value="">All</option>
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Home">Home</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="mb-10">
              <label className="block text-white/50 mb-2 font-black uppercase tracking-[0.3em] text-[10px]">
                Price Range
              </label>

              <select
                name="priceRange"
                value={filters.priceRange}
                onChange={handleFilterChange}
                className="w-full px-5 py-3 rounded-full bg-white/5 text-white border border-white/10 focus:outline-none focus:border-primary transition-all duration-300"
              >
                <option value="">All</option>
                <option value="0-50">$0 - $50</option>
                <option value="50-100">$50 - $100</option>
                <option value="100-200">$100 - $200</option>
              </select>
            </div>

            {/* Apply Button */}
            <button className="w-full px-6 py-4 rounded-full bg-primary text-white font-black uppercase tracking-[0.25em] text-[11px] hover:scale-105 transition-all duration-500 shadow-lg shadow-primary/30">
              Apply Filters
            </button>

            {/* Reset */}
            <button
              onClick={() => setFilters({ category: "", priceRange: "" })}
              className="w-full mt-4 px-6 py-4 rounded-full bg-white/5 text-white/70 font-black uppercase tracking-[0.25em] text-[11px] border border-white/10 hover:bg-white/10 transition-all duration-500"
            >
              Reset Filters
            </button>
          </div>
        </aside>

        {/* ========================= */}
        {/* Products Area */}
        {/* ========================= */}
        <div className="flex-1">
          {/* Sticky Search Section */}
          <div className="sticky top-24 z-20 mb-12 bg-secondary/80 backdrop-blur-2xl border border-white/10 rounded-[40px] p-5 shadow-xl">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <input
                type="text"
                placeholder="Search products..."
                className="flex-1 px-7 py-4 rounded-full bg-white/5 text-white placeholder-white/30 focus:outline-none border border-white/10 focus:border-primary transition-all duration-300"
              />

              <button className="px-10 py-4 rounded-full bg-primary text-white font-black uppercase tracking-[0.25em] text-[11px] hover:scale-105 transition-all duration-500 shadow-lg shadow-primary/30">
                Search
              </button>

              <button className="px-10 py-4 rounded-full bg-white/5 text-white font-black uppercase tracking-[0.25em] text-[11px] border border-white/10 hover:bg-white/10 transition-all duration-500">
                AI Search
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white/5 p-6 rounded-[40px] border border-white/10 shadow-lg hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2"
              >
                {/* Product Image */}
                <div className="relative h-60 flex items-center justify-center bg-gradient-to-br from-white/5 to-white/10 rounded-[32px] mb-6 overflow-hidden">
                  <Package
                    size={85}
                    className="text-white/15 group-hover:scale-125 transition-transform duration-700 group-hover:rotate-12"
                  />

                  {/* Discount Badge */}
                  {product.oldPrice && (
                    <div className="absolute top-4 left-4 px-4 py-2 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-[0.25em] shadow-lg">
                      Deal
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <h3 className="text-xl font-black text-white mb-2 group-hover:text-primary transition-colors duration-500">
                  {product.name}
                </h3>

                <p className="text-xs font-bold text-white/40 uppercase tracking-[0.25em] mb-4">
                  {product.category}
                </p>

                {/* Price */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-black text-primary">
                      {product.price}
                    </span>

                    {product.oldPrice && (
                      <span className="text-sm text-white/30 line-through font-bold">
                        {product.oldPrice}
                      </span>
                    )}
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-full bg-primary text-white font-black uppercase tracking-[0.25em] text-[11px] hover:scale-105 transition-all duration-500 shadow-lg shadow-primary/30">
                  <ShoppingCart size={18} />
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
