import React, { useMemo, useState } from "react";
import { Package, ShoppingCart, BadgePercent, Search, Timer } from "lucide-react";

const Deals = () => {
  // =========================
  // Deals Products (Dummy Data)
  // =========================
  const dealsProducts = Array.from({ length: 15 }, (_, i) => {
    const oldPrice = 199 + i * 25;
    const newPrice = oldPrice - (30 + i * 2);

    return {
      id: i + 1,
      name: `Limited Deal Product ${i + 1}`,
      price: `$${newPrice}`,
      oldPrice: `$${oldPrice}`,
      discount: `${Math.floor(((oldPrice - newPrice) / oldPrice) * 100)}% OFF`,
      category: ["Electronics", "Fashion", "Beauty", "Home"][i % 4],
    };
  });

  // =========================
  // Search + Sort State
  // =========================
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");

  // =========================
  // Filtered Deals
  // =========================
  const filteredDeals = useMemo(() => {
    let data = dealsProducts.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );

    if (sort === "discount") {
      data = [...data].sort(
        (a, b) =>
          parseInt(b.discount.replace("% OFF", "")) -
          parseInt(a.discount.replace("% OFF", ""))
      );
    }

    if (sort === "price-low") {
      data = [...data].sort(
        (a, b) =>
          parseFloat(a.price.replace("$", "")) -
          parseFloat(b.price.replace("$", ""))
      );
    }

    if (sort === "price-high") {
      data = [...data].sort(
        (a, b) =>
          parseFloat(b.price.replace("$", "")) -
          parseFloat(a.price.replace("$", ""))
      );
    }

    return data;
  }, [dealsProducts, search, sort]);

  return (
    <div className="min-h-screen bg-secondary px-6 py-12">
      <div className="max-w-7xl mx-auto">
        {/* ========================= */}
        {/* HERO HEADER */}
        {/* ========================= */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-3 px-7 py-4 rounded-full bg-primary/10 border border-primary/20 text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-6">
            <BadgePercent size={16} />
            Limited Deals
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tight">
            Exclusive Deals
          </h1>

          <p className="text-white/50 mt-5 max-w-2xl mx-auto font-medium leading-relaxed">
            Shop premium products at special limited-time prices. Once gone,
            they won’t return.
          </p>
        </div>

        {/* ========================= */}
        {/* Countdown Banner */}
        {/* ========================= */}
        <div className="relative mb-14 overflow-hidden rounded-[50px] border border-white/10 bg-white/5 backdrop-blur-2xl shadow-xl">
          <div className="absolute -inset-32 bg-gradient-to-r from-primary/20 via-white/5 to-primary/10 blur-[120px] opacity-40" />

          <div className="relative z-10 p-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
                Flash Sale Ends Soon
              </h2>
              <p className="text-white/50 mt-3 font-medium max-w-xl">
                Limited discounts on curated items. Grab them before time runs out.
              </p>
            </div>

            <div className="flex items-center gap-4 px-8 py-5 rounded-full bg-secondary/40 border border-white/10 backdrop-blur-xl">
              <Timer size={22} className="text-primary" />
              <div className="text-white font-black uppercase tracking-[0.3em] text-[11px]">
                12H : 45M : 09S
              </div>
            </div>
          </div>
        </div>

        {/* ========================= */}
        {/* Sticky Search + Sort */}
        {/* ========================= */}
        <div className="sticky top-6 z-20 mb-14 bg-secondary/80 backdrop-blur-2xl border border-white/10 rounded-[45px] p-5 shadow-xl">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-6 py-4 focus-within:border-primary transition-all duration-300">
              <Search size={18} className="text-white/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search deals..."
                className="flex-1 bg-transparent text-white placeholder-white/30 focus:outline-none font-bold"
              />
            </div>

            {/* Sort */}
            <div className="w-full lg:w-72">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full px-6 py-4 rounded-full bg-white/5 text-white border border-white/10 focus:outline-none focus:border-primary transition-all duration-300 font-black uppercase tracking-[0.25em] text-[11px]"
              >
                <option value="default">Sort: Default</option>
                <option value="discount">Biggest Discount</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* ========================= */}
        {/* Deals Grid */}
        {/* ========================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredDeals.map((product, idx) => (
            <div
              key={product.id}
              className="group bg-white/5 p-7 rounded-[45px] border border-white/10 shadow-lg hover:shadow-primary/10 transition-all duration-700 hover:-translate-y-2"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              {/* Product Image */}
              <div className="relative h-60 flex items-center justify-center bg-gradient-to-br from-white/5 to-white/10 rounded-[35px] mb-7 overflow-hidden">
                <Package
                  size={90}
                  className="text-white/15 group-hover:scale-125 transition-transform duration-700 group-hover:rotate-12"
                />

                {/* Discount Badge */}
                <div className="absolute top-4 left-4 px-5 py-2 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-[0.25em] shadow-lg shadow-primary/30">
                  {product.discount}
                </div>
              </div>

              {/* Product Info */}
              <h3 className="text-xl font-black text-white mb-3 group-hover:text-primary transition-colors duration-500">
                {product.name}
              </h3>

              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40 mb-6">
                {product.category}
              </p>

              {/* Price */}
              <div className="flex items-center gap-4 mb-7">
                <span className="text-2xl font-black text-primary">
                  {product.price}
                </span>

                <span className="text-sm text-white/30 line-through font-bold">
                  {product.oldPrice}
                </span>
              </div>

              {/* Add to Cart */}
              <button className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-full bg-primary text-white font-black uppercase tracking-[0.25em] text-[11px] hover:scale-105 transition-all duration-500 shadow-lg shadow-primary/30">
                <ShoppingCart size={18} />
                Add to Cart
              </button>
            </div>
          ))}
        </div>

        {/* ========================= */}
        {/* Empty State */}
        {/* ========================= */}
        {filteredDeals.length === 0 && (
          <div className="text-center mt-20">
            <p className="text-white/40 font-bold text-lg">
              No deals found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Deals;
