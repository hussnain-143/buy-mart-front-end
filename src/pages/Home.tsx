import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { ArrowRight, Laptop, Shirt, Sparkles, HomeIcon, Package, Zap } from "lucide-react";
import { GetAllCategories } from "../services/category.service";
import { GetAllProducts } from "../services/product.service";
import { GetAllBrands } from "../services/brand.service";
import { GetActiveDeals } from "../services/deal.service";

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

const CATEGORY_ICONS: Record<string, any> = {
  "Electronics": Laptop,
  "Fashion": Shirt,
  "Beauty": Sparkles,
  "Home & Living": HomeIcon,
};

const CATEGORY_COLORS: Record<string, string> = {
  "Electronics": COLORS.electronics,
  "Fashion": COLORS.fashion,
  "Beauty": COLORS.beauty,
  "Home & Living": COLORS.home,
};

// ========================
// Component
// ========================
const Home = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [latestProducts, setLatestProducts] = useState<any[]>([]);
  const [hotSellingProducts, setHotSellingProducts] = useState<any[]>([]);
  const [brands, setBrands] = useState<string[]>(["ROLEX", "GUCCI", "APPLE", "SONY", "PRADA", "DYSON", "TESLA"]);
  const [loading, setLoading] = useState(true);

  const [deals, setDeals] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await GetAllCategories();
        if (catRes.success) {
          setCategories(catRes.data.slice(0, 4));
        }

        const prodRes = await GetAllProducts({ limit: 8 });
        if (prodRes.success) {
          setLatestProducts(prodRes.data.docs.slice(0, 6));
          setHotSellingProducts(prodRes.data.docs);
        }

        const dealsRes = await GetActiveDeals();
        if (dealsRes.success) {
          setDeals(dealsRes.data.slice(0, 3)); // Display top 3 active deals
        }

        const brandRes = await GetAllBrands();
        if (brandRes.success && brandRes.data.length > 0) {
          setBrands(brandRes.data.map((b: any) => b.name.toUpperCase()));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary overflow-x-hidden">

      {/* Hero Section */}
      <section className="relative h-screen min-h-[900px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-bg.png"
            alt="Hero Background"
            className="w-full h-full object-cover scale-110 animate-pulse-slow brightness-80 contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 via-secondary/60 to-secondary" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-[1400px] mx-auto">
          <h1 className="text-6xl md:text-[80px] font-black text-white mb-6 md:mb-8 leading-[0.85] tracking-tight">
            Live Smarter. <br />
            <span className="
              md:text-[100px]
              bg-gradient-to-r from-primary to-accent
              bg-clip-text text-transparent
              underline decoration-8 underline-offset-16
              leading-[0.9]
              mt-4 inline-block
            ">
              Feel Premium.
            </span>
          </h1>

          <p className="
            text-lg md:text-2xl 
            text-white/80 
            max-w-3xl md:max-w-4xl 
            mx-auto 
            leading-relaxed md:leading-loose 
            font-medium 
            mt-6 
            mb-16 
            text-center
          ">
            Discover a curated selection of products where sleek design meets ultimate functionality — crafted to elevate your everyday lifestyle.
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
              const Icon = CATEGORY_ICONS[cat.name] || Package;
              const color = CATEGORY_COLORS[cat.name] || "from-gray-500/20 to-slate-500/20";
              return (
                <NavLink
                  key={cat._id}
                  to={`/categories/${cat.slug}`}
                  className="group relative h-64 flex flex-col items-center justify-center rounded-[40px] overflow-hidden transition-all duration-700 hover:-translate-y-4 shadow-2xl"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl border border-white/10 group-hover:border-accent/30 transition-colors" />
                  <div
                    className={`absolute -inset-20 bg-gradient-to-br ${color} blur-[80px] opacity-10 group-hover:opacity-40 transition-opacity`}
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
              <NavLink
                to={`/product/${product.sku}`}
                key={product._id}
                className="snap-start min-w-[320px] flex-shrink-0 bg-white/5 p-6 rounded-3xl border border-white/10 shadow-lg hover:shadow-accent/10 transition-all duration-500"
              >
                <div className="relative h-56 flex items-center justify-center bg-gradient-to-br from-white/5 to-white/10 rounded-2xl mb-4 overflow-hidden">
                  {product.images_id?.[0]?.image_url ? (
                    <img src={product.images_id[0].image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <Package size={80} className="text-white/20 group-hover:scale-110 transition-transform duration-500" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                <span className="text-2xl font-black text-accent">${product.price}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </section>

      {/* Deals */}
      <section className="py-24 px-6 bg-secondary relative overflow-hidden">
        {/* Dynamic Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/5 rounded-[100%] blur-[120px] pointer-events-none" />

        <div className="mx-auto max-w-7xl relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
            <div>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight flex items-center gap-4">
                Flash <span className="text-accent flex items-center gap-2">Deals <Zap size={36} className="text-accent animate-pulse" /></span>
              </h2>
              <p className="text-white/50 mt-4 text-lg max-w-xl">
                Unbeatable discounts on our premium collection. Grab them before they're gone!
              </p>
            </div>
            <NavLink
              to="/deals"
              className="group flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-[0.2em] text-[12px] rounded-full border border-white/10 transition-all duration-300"
            >
              View All Offers
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </NavLink>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {deals.length > 0 ? (
              deals.map((deal, idx) => {
                const iconMap = [Zap, Sparkles, Package];
                const Icon = iconMap[idx % iconMap.length];
                return (
                  <NavLink
                    to={deal.product_id ? `/product/${deal.product_id.sku}` : `/shop?category=${deal.category_id?._id || ""}`}
                    key={deal._id}
                    className="group relative bg-[#1E1E1E]/40 backdrop-blur-xl p-8 rounded-[40px] border border-white/10 shadow-2xl hover:border-accent/30 transition-all duration-500 flex flex-col items-start overflow-hidden"
                  >
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/20 rounded-full blur-[60px] group-hover:bg-accent/40 transition-colors duration-700" />
                    
                    <div className="relative z-10 p-4 rounded-2xl bg-white/5 border border-white/10 mb-8 group-hover:bg-accent/10 transition-colors duration-500 shadow-inner">
                      <Icon size={32} className="text-white group-hover:text-accent transition-colors duration-500" />
                    </div>
                    
                    <div className="relative z-10 flex-grow">
                      <h3 className="text-2xl lg:text-3xl font-black text-white mb-3 tracking-tight">{deal.name}</h3>
                      <p className="text-white/60 mb-8 font-medium line-clamp-2">{deal.description}</p>
                    </div>
                    
                    <div className="relative z-10 w-full flex items-end justify-between mt-auto">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-black tracking-[0.3em] text-white/40 mb-1">Up to</span>
                        <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent to-yellow-200">
                          {deal.discount}%
                        </span>
                      </div>
                      <button className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-all duration-300 shadow-lg">
                        <ArrowRight size={20} className="text-white group-hover:text-secondary group-hover:-rotate-45 transition-all duration-300" />
                      </button>
                    </div>
                  </NavLink>
                );
              })
            ) : (
              <div className="col-span-3 text-center text-white/50 py-12">
                More exciting deals coming soon!
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Hot Selling Slider */}
      <section className="py-32 px-6 bg-secondary/10">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-12 tracking-tight text-center">
            Hot Selling
          </h2>
          <div className="relative overflow-hidden">
            <div className="flex gap-6 animate-scroll-hot">
              {hotSellingProducts.concat(hotSellingProducts).map((product, i) => (
                <NavLink
                  to={`/product/${product.sku}`}
                  key={i}
                  className="min-w-[370px] flex-shrink-0 bg-white/5 p-6 rounded-3xl border border-white/10 shadow-lg hover:shadow-accent/10 transition-all duration-500"
                >
                  <div className="relative h-56 flex items-center justify-center bg-gradient-to-br from-white/5 to-white/10 rounded-2xl mb-4 overflow-hidden">
                    {product.images_id?.[0]?.image_url ? (
                      <img src={product.images_id[0].image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <Package size={80} className="text-white/20 group-hover:scale-110 transition-transform duration-500" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                  <div className="flex gap-2 items-center">
                    <span className="text-2xl font-black text-accent">${product.price}</span>
                    {product.discount_price > 0 && (
                      <span className="text-sm text-white/30 line-through font-bold">${product.price + 50}</span>
                    )}
                  </div>
                </NavLink>
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
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            display: flex;
            animation: marquee 60s linear infinite;
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
