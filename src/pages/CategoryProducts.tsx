import React, { useMemo, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  ShoppingCart,
  Search,
  BadgePercent,
} from "lucide-react";

const CategoryProducts = () => {
  const { slug } = useParams();

  // Convert slug to readable name
  const categoryName = useMemo(() => {
    if (!slug) return "Category";
    return slug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }, [slug]);

  // ========================
  // Sample Products
  // ========================
  const products = Array.from({ length: 18 }, (_, i) => ({
    id: i + 1,
    name: `${categoryName} Product ${i + 1}`,
    price: "$" + (99 + i * 15),
    oldPrice: i % 3 === 0 ? "$" + (129 + i * 15) : null,
    category: categoryName,
  }));

  // ========================
  // Search + Sort State
  // ========================
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");

  // ========================
  // Filter + Sort Products
  // ========================
  const filteredProducts = useMemo(() => {
    let data = products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );

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

    if (sort === "deals") {
      data = [...data].sort((a, b) => (b.oldPrice ? 1 : 0) - (a.oldPrice ? 1 : 0));
    }

    return data;
  }, [products, search, sort]);

  return (
    <div className="min-h-screen bg-secondary px-6 py-12">
      <div className="max-w-7xl mx-auto">
        {/* ========================= */}
        {/* Top Header */}
        {/* ========================= */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <NavLink
              to="/categories"
              className="inline-flex items-center gap-2 text-white/40 hover:text-primary transition-colors font-black uppercase tracking-[0.25em] text-[11px]"
            >
              <ArrowLeft size={16} />
              Back to Categories
            </NavLink>

            <h1 className="text-4xl md:text-6xl font-black text-white mt-5 uppercase tracking-tight">
              {categoryName}
            </h1>

            <p className="text-white/50 mt-3 font-medium max-w-xl">
              Discover premium curated products inside{" "}
              <span className="text-primary font-black">{categoryName}</span>.
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <div className="px-6 py-4 rounded-full bg-white/5 border border-white/10 text-white/60 font-black uppercase tracking-[0.25em] text-[10px]">
              {filteredProducts.length} Items
            </div>

            <div className="px-6 py-4 rounded-full bg-primary/10 border border-primary/20 text-primary font-black uppercase tracking-[0.25em] text-[10px]">
              Luxury Picks
            </div>
          </div>
        </div>

        {/* ========================= */}
        {/* Sticky Search + Sort */}
        {/* ========================= */}
        <div className="sticky top-6 z-20 mb-14 bg-secondary/80 backdrop-blur-2xl border border-white/10 rounded-[45px] p-5 shadow-xl">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-5 py-3 focus-within:border-primary transition-all duration-300">
              <Search size={18} className="text-white/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search in ${categoryName}...`}
                className="flex-1 bg-transparent text-white placeholder-white/30 focus:outline-none font-bold"
              />
            </div>

            {/* Sort */}
            <div className="w-full lg:w-64">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full px-6 py-4 rounded-full bg-white/5 text-white border border-white/10 focus:outline-none focus:border-primary transition-all duration-300 font-black uppercase tracking-[0.2em] text-[11px]"
              >
                <option value="default">Sort: Default</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
                <option value="deals">Deals First</option>
              </select>
            </div>
          </div>
        </div>

        {/* ========================= */}
        {/* Products Grid */}
        {/* ========================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredProducts.map((product, idx) => (
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

                {/* Deal Badge */}
                {product.oldPrice && (
                  <div className="absolute top-4 left-4 flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-[0.25em] shadow-lg shadow-primary/30">
                    <BadgePercent size={14} />
                    Deal
                  </div>
                )}
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

                {product.oldPrice && (
                  <span className="text-sm text-white/30 line-through font-bold">
                    {product.oldPrice}
                  </span>
                )}
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
        {filteredProducts.length === 0 && (
          <div className="text-center mt-20">
            <p className="text-white/40 font-bold text-lg">
              No products found in {categoryName}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;
