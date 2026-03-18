import React, { useEffect, useState } from "react";
import { SlidersHorizontal, Package, ShoppingCart, Sparkles, Search } from "lucide-react";
import { GetAllProducts, AISearch } from "../services/product.service";
import { GetAllCategories } from "../services/category.service";
import { AddToCart } from "../services/cart.service";
import { NavLink } from "react-router-dom";
import Toast from "../components/common/Toast";

const Shop = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [aiEnabled, setAiEnabled] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });

  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
  });

  const showToast = (message: string, type: string = "info") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "info" }), 3000);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      if (aiEnabled && search) {
        const res = await AISearch(search);
        if (res.success) {
          setProducts(res.data);
        }
      } else {
        const params: any = {};
        if (filters.category) params.category = filters.category;
        if (filters.minPrice) params.minPrice = filters.minPrice;
        if (filters.maxPrice) params.maxPrice = filters.maxPrice;
        if (search) params.search = search;

        const res = await GetAllProducts(params);
        if (res.success) {
          // Handle both paginated (res.data.docs) and unpaginated (res.data) results
          const productList = res.data?.docs || (Array.isArray(res.data) ? res.data : []);
          setProducts(productList);
        }
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await GetAllCategories();
      if (res.success) {
        setCategories(res.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [aiEnabled]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApplyFilters = () => {
    setAiEnabled(false);
    fetchProducts();
  };

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

  return (
    <div className="min-h-screen bg-secondary px-6 py-12">
      {toast.show && <Toast type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />}

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
        {/* Sidebar Filter */}
        <aside className="w-full lg:w-72 flex-shrink-0">
          <div className="sticky top-24 bg-white/5 p-7 rounded-[40px] border border-white/10 backdrop-blur-2xl shadow-xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
                <SlidersHorizontal size={22} className="text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-widest">Filters</h3>
                <p className="text-xs text-white/40 font-semibold">Refine your search</p>
              </div>
            </div>

            <div className="mb-7">
              <label className="block text-white/50 mb-2 font-black uppercase tracking-[0.3em] text-[10px]">Category</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full px-5 py-3 rounded-full bg-white/5 text-white border border-white/10 focus:outline-none focus:border-primary transition-all duration-300"
              >
                <option value="">All</option>
                {categories?.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="mb-7">
              <label className="block text-white/50 mb-2 font-black uppercase tracking-[0.3em] text-[10px]">Min Price</label>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="0"
                className="w-full px-5 py-3 rounded-full bg-white/5 text-white border border-white/10 focus:outline-none focus:border-primary"
              />
            </div>

            <div className="mb-10">
              <label className="block text-white/50 mb-2 font-black uppercase tracking-[0.3em] text-[10px]">Max Price</label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="1000"
                className="w-full px-5 py-3 rounded-full bg-white/5 text-white border border-white/10 focus:outline-none focus:border-primary"
              />
            </div>

            <button onClick={handleApplyFilters} className="w-full px-6 py-4 rounded-full bg-primary text-white font-black uppercase tracking-[0.25em] text-[11px] hover:scale-105 transition-all duration-500 shadow-lg shadow-primary/30">
              Apply Filters
            </button>

            <button
              onClick={() => {
                setFilters({ category: "", minPrice: "", maxPrice: "" });
                setAiEnabled(false);
                fetchProducts();
              }}
              className="w-full mt-4 px-6 py-4 rounded-full bg-white/5 text-white/70 font-black uppercase tracking-[0.25em] text-[11px] border border-white/10 hover:bg-white/10 transition-all duration-500"
            >
              Reset Filters
            </button>
          </div>
        </aside>

        {/* Products Area */}
        <div className="flex-1">
          <div className="sticky top-24 z-20 mb-12 bg-secondary/80 backdrop-blur-2xl border border-white/10 rounded-[40px] p-5 shadow-xl">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 group">
                <input
                  type="text"
                  placeholder={aiEnabled ? "Talk to AI Assistant..." : "Search products..."}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`w-full px-7 py-4 rounded-full bg-white/5 text-white placeholder-white/30 focus:outline-none border transition-all duration-500 ${aiEnabled ? "border-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)] pl-14" : "border-white/10 focus:border-primary"}`}
                />
                {aiEnabled && <Sparkles className="absolute left-6 top-1/2 -translate-y-1/2 text-primary animate-pulse" size={20} />}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setAiEnabled(!aiEnabled)}
                  className={`p-4 rounded-full border transition-all duration-500 flex items-center gap-2 group ${aiEnabled ? "bg-primary border-primary text-white" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"}`}
                  title="Toggle AI Search"
                >
                  <Sparkles size={20} className={aiEnabled ? "animate-spin-slow" : "group-hover:rotate-12 transition-transform"} />
                  <span className={`text-[10px] font-black uppercase tracking-widest hidden sm:block ${aiEnabled ? "opacity-100" : "opacity-40"}`}>AI Mode</span>
                </button>

                <button onClick={fetchProducts} className="px-10 py-4 rounded-full bg-primary text-white font-black uppercase tracking-[0.25em] text-[11px] hover:scale-105 transition-all duration-500 shadow-lg shadow-primary/30 flex items-center gap-2">
                  <Search size={18} />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {products?.map((product) => (
                <div
                  key={product._id}
                  className="group bg-white/5 p-6 rounded-[40px] border border-white/10 shadow-lg hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2"
                >
                  <NavLink to={`/product/${product.sku}`}>
                    <div className="relative h-60 flex items-center justify-center bg-gradient-to-br from-white/5 to-white/10 rounded-[32px] mb-6 overflow-hidden">
                      {product.images_id?.[0]?.image_url ? (
                        <img src={product.images_id[0].image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700" />
                      ) : (
                        <Package size={85} className="text-white/15 group-hover:scale-125 transition-transform duration-700 group-hover:rotate-12" />
                      )}
                      {product.discount_price > 0 && (
                        <div className="absolute top-4 left-4 px-4 py-2 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-[0.25em] shadow-lg">
                          Deal
                        </div>
                      )}
                    </div>
                  </NavLink>
                  <h3 className="text-xl font-black text-white mb-2 group-hover:text-primary transition-colors duration-500">
                    {product.name}
                  </h3>
                  <p className="text-xs font-bold text-white/40 uppercase tracking-[0.25em] mb-4">
                    {product.category_id?.name}
                  </p>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-black text-primary">
                        ${product.discount_price > 0 ? product.discount_price : product.price}
                      </span>
                      {product.discount_price > 0 && (
                        <span className="text-sm text-white/30 line-through font-bold">
                          ${product.price}
                        </span>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleAddToCart(product._id)} 
                    disabled={product.stock_quantity <= 0}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-full bg-primary text-white font-black uppercase tracking-[0.25em] text-[11px] hover:scale-105 transition-all duration-500 shadow-lg shadow-primary/30 disabled:opacity-50 disabled:grayscale disabled:scale-100"
                  >
                    {product.stock_quantity <= 0 ? (
                      "Out of Stock"
                    ) : (
                      <>
                        <ShoppingCart size={18} />
                        Add to Cart
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
