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
import { AddToCart } from "../services/cart.service";
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
    try {
      const res = await AddToCart({ product_id: product._id, quantity: 1 });
      if (res.success) {
        showToast("Added to cart!", "success");
      }
    } catch (error: any) {
      showToast(error.message || "Failed to add to cart", "error");
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
            <button onClick={handleAddToCart} className="flex-1 px-8 py-4 rounded-full bg-primary text-white font-black uppercase tracking-[0.25em] hover:scale-105 transition-all duration-500 shadow-lg shadow-primary/30 flex items-center justify-center gap-3">
              <ShoppingCart size={18} /> Add to Cart
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
              {activeTab === "description" && <p>{product.description}</p>}

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

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-[0.2em]">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedProducts.map((rp) => (
                  <NavLink
                    to={`/product/${rp.sku}`}
                    key={rp._id}
                    className="group bg-white/5 p-6 rounded-3xl border border-white/10 shadow-lg hover:shadow-primary/10 transition-all duration-500"
                  >
                    <div className="relative h-56 flex items-center justify-center bg-gradient-to-br from-white/5 to-white/10 rounded-2xl mb-4 overflow-hidden">
                      {rp.images_id?.[0]?.image_url ? (
                        <img src={rp.images_id[0].image_url} alt={rp.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <Package size={80} className="text-white/10 group-hover:scale-110 transition-transform duration-500" />
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{rp.name}</h3>
                    <span className="text-2xl font-black text-primary">${rp.price}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
