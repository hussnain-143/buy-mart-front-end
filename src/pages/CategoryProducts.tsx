import { useEffect, useMemo, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  ShoppingCart,
  Search,
  BadgePercent,
} from "lucide-react";
import { GetAllProducts } from "../services/product.service";
import { GetAllCategories } from "../services/category.service";
import { AddToCart } from "../services/cart.service";
import Toast from "../components/common/Toast";

const CategoryProducts = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState<any[]>([]);
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });

  const showToast = (message: string, type: string = "info") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "info" }), 3000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Get all categories to find the one matching the slug
      const catRes = await GetAllCategories();
      if (catRes.success) {
        const foundCat = catRes.data.find((c: any) => c.slug === slug);
        if (foundCat) {
          setCategory(foundCat);

          // 2. Fetch products for this category
          const prodRes = await GetAllProducts({ category: foundCat._id });
          if (prodRes.success) {
            setProducts(prodRes.data.docs);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching category products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [slug]);

  const filteredAndSortedProducts = useMemo(() => {
    let data = products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );

    if (sort === "price-low") {
      data = [...data].sort((a, b) => a.price - b.price);
    } else if (sort === "price-high") {
      data = [...data].sort((a, b) => b.price - a.price);
    } else if (sort === "deals") {
      data = [...data].sort((a, b) => (b.discount_price > 0 ? 1 : 0) - (a.discount_price > 0 ? 1 : 0));
    }

    return data;
  }, [products, search, sort]);

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

  const categoryName = category ? category.name : "Category";

  return (
    <div className="min-h-screen bg-secondary px-6 py-12">
      {toast.show && <Toast type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />}

      <div className="max-w-7xl mx-auto">
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
              {filteredAndSortedProducts.length} Items
            </div>
          </div>
        </div>

        <div className="sticky top-6 z-20 mb-14 bg-secondary/80 backdrop-blur-2xl border border-white/10 rounded-[45px] p-5 shadow-xl">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
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

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredAndSortedProducts.map((product, idx) => (
              <div
                key={product._id}
                className="group bg-white/5 p-7 rounded-[45px] border border-white/10 shadow-lg hover:shadow-primary/10 transition-all duration-700 hover:-translate-y-2"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <NavLink to={`/product/${product.sku}`}>
                  <div className="relative h-60 flex items-center justify-center bg-gradient-to-br from-white/5 to-white/10 rounded-[35px] mb-7 overflow-hidden">
                    {product.images_id?.[0]?.image_url ? (
                      <img src={product.images_id[0].image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700" />
                    ) : (
                      <Package size={90} className="text-white/15 group-hover:scale-125 transition-transform duration-700 group-hover:rotate-12" />
                    )}
                    {product.discount_price > 0 && (
                      <div className="absolute top-4 left-4 flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-[0.25em] shadow-lg shadow-primary/30">
                        <BadgePercent size={14} />
                        Deal
                      </div>
                    )}
                  </div>
                </NavLink>

                <h3 className="text-xl font-black text-white mb-3 group-hover:text-primary transition-colors duration-500">
                  {product.name}
                </h3>

                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40 mb-6">
                  {categoryName}
                </p>

                <div className="flex items-center gap-4 mb-7">
                  <span className="text-2xl font-black text-primary">
                    ${product.discount_price > 0 ? product.discount_price : product.price}
                  </span>
                  {product.discount_price > 0 && (
                    <span className="text-sm text-white/30 line-through font-bold">
                      ${product.price}
                    </span>
                  )}
                </div>

                <button onClick={() => handleAddToCart(product._id)} className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-full bg-primary text-white font-black uppercase tracking-[0.25em] text-[11px] hover:scale-105 transition-all duration-500 shadow-lg shadow-primary/30">
                  <ShoppingCart size={18} />
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredAndSortedProducts.length === 0 && (
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
