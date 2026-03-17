import React, { useEffect, useMemo, useState } from "react";
import { Package, ShoppingCart, BadgePercent, Search, Timer } from "lucide-react";
import { GetAllProducts } from "../services/product.service";
import { AddToCart } from "../services/cart.service";
import Toast from "../components/common/Toast";
import { NavLink } from "react-router-dom";

const Deals = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });

  const showToast = (message: string, type: string = "info") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "info" }), 3000);
  };

  const fetchDeals = async () => {
    setLoading(true);
    try {
      const res = await GetAllProducts();
      if (res.success) {
        // Filter products that have a discount_price
        const discounted = res.data.docs.filter((p: any) => p.discount_price > 0);
        setProducts(discounted);
      }
    } catch (error) {
      console.error("Error fetching deals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const handleAddToCart = async (productId: string) => {
    try {
      const res = await AddToCart({ product_id: productId, quantity: 1 });
      if (res.success) {
        showToast("Added to cart!", "success");
      }
    } catch (error: any) {
      showToast(error.message || "Failed to add to cart", "error");
    }
  };

  // =========================
  // Filtered Deals
  // =========================
  const filteredDeals = useMemo(() => {
    let data = products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );

    if (sort === "discount") {
      data = [...data].sort(
        (a, b) =>
          ((b.price - b.discount_price) / b.price) -
          ((a.price - a.discount_price) / a.price)
      );
    }

    if (sort === "price-low") {
      data = [...data].sort((a, b) => a.discount_price - b.discount_price);
    }

    if (sort === "price-high") {
      data = [...data].sort((a, b) => b.discount_price - a.discount_price);
    }

    return data;
  }, [products, search, sort]);

  return (
    <div className="min-h-screen bg-secondary px-6 py-12">
      {toast.show && <Toast type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />}
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
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredDeals.map((product, idx) => (
              <div
                key={product._id}
                className="group bg-white/5 p-7 rounded-[45px] border border-white/10 shadow-lg hover:shadow-primary/10 transition-all duration-700 hover:-translate-y-2"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                {/* Product Image */}
                <NavLink to={`/product/${product.sku}`}>
                  <div className="relative h-60 flex items-center justify-center bg-gradient-to-br from-white/5 to-white/10 rounded-[35px] mb-7 overflow-hidden">
                    {product.images_id?.[0]?.image_url ? (
                      <img src={product.images_id[0].image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700" />
                    ) : (
                      <Package
                        size={90}
                        className="text-white/15 group-hover:scale-125 transition-transform duration-700 group-hover:rotate-12"
                      />
                    )}

                    {/* Discount Badge */}
                    <div className="absolute top-4 left-4 px-5 py-2 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-[0.25em] shadow-lg shadow-primary/30">
                      {Math.round(((product.price - product.discount_price) / product.price) * 100)}% OFF
                    </div>
                  </div>
                </NavLink>

                {/* Product Info */}
                <h3 className="text-xl font-black text-white mb-3 group-hover:text-primary transition-colors duration-500">
                  {product.name}
                </h3>

                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40 mb-6">
                  {product.category_id?.name || "Product"}
                </p>

                {/* Price */}
                <div className="flex items-center gap-4 mb-7">
                  <span className="text-2xl font-black text-primary">
                    ${product.discount_price}
                  </span>

                  <span className="text-sm text-white/30 line-through font-bold">
                    ${product.price}
                  </span>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={() => handleAddToCart(product._id)}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-full bg-primary text-white font-black uppercase tracking-[0.25em] text-[11px] hover:scale-105 transition-all duration-500 shadow-lg shadow-primary/30"
                >
                  <ShoppingCart size={18} />
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}

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
