import { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import {
  Package,
  ShoppingCart,
  Heart,
  Star,
} from "lucide-react";
import Slider from "react-slick";
import { GetAllProducts, GetProductById } from "../services/product.service";
import { useCart } from "../context/CartContext";
import { AddReview, GetProductReviews } from "../services/review.service";
import Toast from "../components/common/Toast";

const SingleProduct = () => {
  const { slug } = useParams(); // This is the SKU
  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description");
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  const showToast = (message: string, type: string = "info") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "info" }), 3000);
  };

  const { addItem } = useCart();

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch by SKU/ID (Backend needs to support searching by SKU)
      const res = await GetProductById(slug as string);
      if (res.success) {
        setProduct(res.data);

        // Fetch reviews
        const reviewRes = await GetProductReviews(res.data._id);
        if (reviewRes.success) {
          setReviews(reviewRes.data);
        }

        // Fetch related products (same category)
        const relatedRes = await GetAllProducts({ category: res.data.category_id?._id, limit: 6 });
        if (relatedRes.success) {
          setRelatedProducts(relatedRes.data.docs.filter((p: any) => p._id !== res.data._id));
        }
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [slug]);

  const handleAddToCart = async () => {
    if (!product) return;
    const success = await addItem(product._id, 1);
    if (success) {
      showToast("Added to cart!", "success");
    } else {
      showToast("Failed to add to cart", "error");
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    try {
      const res = await AddReview({ product_id: product._id, ...newReview });
      if (res.success) {
        showToast("Review added!", "success");
        setNewReview({ rating: 5, comment: "" });
        // Refresh reviews
        const reviewRes = await GetProductReviews(product._id);
        if (reviewRes.success) {
          setReviews(reviewRes.data);
        }
      }
    } catch (error: any) {
      showToast(error.message || "Failed to add review", "error");
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-secondary flex flex-col justify-center items-center text-white">
        <h1 className="text-4xl font-black mb-4">Product Not Found</h1>
        <NavLink to="/shop" className="text-primary hover:underline">Back to Shop</NavLink>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary px-6 py-12">
      {toast.show && <Toast type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />}

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-14">
        {/* Left - Images */}
        <div className="flex-1">
          <Slider {...sliderSettings} className="rounded-[45px] overflow-hidden shadow-lg shadow-primary/20">
            {product.images_id?.length > 0 ? (
              product.images_id.map((img: any, idx: number) => (
                <div key={idx} className="relative h-[500px] md:h-[600px] flex items-center justify-center bg-gradient-to-br from-white/5 to-white/10">
                  <img src={img.image_url} alt={product.name} className="h-full object-contain" />
                </div>
              ))
            ) : (
              <div className="relative h-[500px] md:h-[600px] flex items-center justify-center bg-gradient-to-br from-white/5 to-white/10">
                <Package size={200} className="text-white/10" />
              </div>
            )}
          </Slider>
        </div>

        {/* Right - Details */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <span className="text-white/50 font-black uppercase tracking-[0.25em] text-[11px]">
              {product.category_id?.name}
            </span>
            <Heart size={20} className="text-white/40 hover:text-primary cursor-pointer transition-all duration-500" />
          </div>

          <h1 className="text-5xl font-black text-white tracking-tight">{product.name}</h1>

          <div className="flex items-center gap-6">
            <span className="text-3xl font-black text-primary">
              ${product.discount_price > 0 ? product.discount_price : product.price}
            </span>
            {product.discount_price > 0 && (
              <span className="text-white/30 line-through font-bold">${product.price}</span>
            )}
          </div>

          <div className="flex gap-4 mt-6 flex-wrap">
            <button 
              onClick={handleAddToCart} 
              disabled={product.stock_quantity <= 0}
              className="flex-1 px-8 py-4 rounded-full bg-primary text-white font-black uppercase tracking-[0.25em] hover:scale-105 transition-all duration-500 shadow-lg shadow-primary/30 flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale disabled:scale-100"
            >
              {product.stock_quantity <= 0 ? (
                "Out of Stock"
              ) : (
                <>
                  <ShoppingCart size={18} /> Add to Cart
                </>
              )}
            </button>
          </div>

          {/* Tabs */}
          <div className="mt-12">
            <div className="flex gap-6 border-b border-white/10 mb-6">
              {["description", "specs", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`uppercase font-black tracking-[0.2em] text-[11px] pb-3 transition-colors duration-300 ${activeTab === tab ? "text-primary border-b-2 border-primary" : "text-white/40"
                    }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="text-white/70 font-medium leading-relaxed">
              {activeTab === "description" && <p>{product.desc}</p>}

              {activeTab === "specs" && (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <li className="flex justify-between border-b border-white/10 pb-2">
                    <span className="font-bold">Brand</span>
                    <span>{product.brand_id?.name || "N/A"}</span>
                  </li>
                  <li className="flex justify-between border-b border-white/10 pb-2">
                    <span className="font-bold">Stock</span>
                    <span>{product.stock_quantity}</span>
                  </li>
                  <li className="flex justify-between border-b border-white/10 pb-2">
                    <span className="font-bold">SKU</span>
                    <span>{product.sku}</span>
                  </li>
                </ul>
              )}

              {activeTab === "reviews" && (
                <div className="flex flex-col gap-8">
                  <form onSubmit={handleAddReview} className="bg-white/5 p-6 rounded-3xl border border-white/10">
                    <h3 className="text-lg font-black text-white mb-4 uppercase tracking-widest">Add a Review</h3>
                    <div className="mb-4">
                      <label className="block text-white/50 mb-2 font-bold text-xs uppercase tracking-widest">Rating</label>
                      <select
                        value={newReview.rating}
                        onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                        className="w-full bg-white/5 text-white border border-white/10 rounded-full px-4 py-2 focus:outline-none focus:border-primary"
                      >
                        {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                      </select>
                    </div>
                    <div className="mb-6">
                      <label className="block text-white/50 mb-2 font-bold text-xs uppercase tracking-widest">Comment</label>
                      <textarea
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        className="w-full bg-white/5 text-white border border-white/10 rounded-2xl px-4 py-3 focus:outline-none focus:border-primary h-24"
                        placeholder="Write your review here..."
                        required
                      ></textarea>
                    </div>
                    <button type="submit" className="w-full py-3 rounded-full bg-primary text-white font-black uppercase tracking-widest text-xs hover:scale-105 transition-all">Submit Review</button>
                  </form>

                  <div className="flex flex-col gap-6">
                    {reviews.length > 0 ? reviews.map((review, idx) => (
                      <div key={idx} className="border border-white/10 rounded-3xl p-5">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-black text-white">{review.user_id?.firstName} {review.user_id?.lastName}</span>
                          <div className="flex gap-1">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star key={i} size={16} className="text-primary" />
                            ))}
                          </div>
                        </div>
                        <p className="text-white/50 text-sm">{review.comment}</p>
                      </div>
                    )) : (
                      <p className="text-white/40 text-center font-bold">No reviews yet.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Products - Full Width Section */}
      {relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto mt-24 border-t border-white/5 pt-12">
          <h2 className="text-3xl font-black text-white mb-8 uppercase tracking-[0.2em]">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rp) => (
              <NavLink
                to={`/product/${rp.sku}`}
                key={rp._id}
                className="group bg-white/5 rounded-[30px] border border-white/10 shadow-lg hover:shadow-primary/20 transition-all duration-500 overflow-hidden flex flex-col"
              >
                <div className="relative h-64 flex items-center justify-center bg-gradient-to-br from-white/5 to-white/10 p-6 overflow-hidden">
                  {rp.images_id?.[0]?.image_url ? (
                    <img src={rp.images_id[0].image_url} alt={rp.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <Package size={80} className="text-white/10 group-hover:scale-110 transition-transform duration-700" />
                  )}
                  {rp.discount_price > 0 && (
                    <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full">
                      Sale
                    </div>
                  )}
                </div>
                
                <div className="p-6 flex flex-col gap-3 flex-grow bg-black/20">
                  <div className="text-white/40 font-black uppercase tracking-[0.2em] text-[10px]">
                    {rp.category_id?.name || "Apparel"}
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors line-clamp-2">{rp.name}</h3>
                  <div className="mt-auto flex items-center gap-3 pt-3 border-t border-white/5">
                    <span className="text-xl font-black text-primary">
                      ${rp.discount_price > 0 ? rp.discount_price : rp.price}
                    </span>
                    {rp.discount_price > 0 && (
                       <span className="text-white/30 line-through font-bold text-sm min-w-0 truncate">${rp.price}</span>
                    )}
                  </div>
                </div>
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleProduct;
