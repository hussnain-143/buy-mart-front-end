import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Package,
  ShoppingCart,
  Heart,
  ArrowRight,
  Star,
} from "lucide-react";
import Slider from "react-slick";

const SingleProduct = () => {
  const { slug } = useParams();
  const productName = slug
    ? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "Product Name";

  // ======================
  // Dummy Product Data
  // ======================
  const product = {
    name: productName,
    category: "Electronics",
    price: "$299",
    oldPrice: "$399",
    images: [
      "/product1.png",
      "/product2.png",
      "/product3.png",
      "/product4.png",
    ],
    description:
      "This is a premium product description. High quality, curated for luxury and elegance.",
    specifications: [
      { key: "Brand", value: "Premium Brand" },
      { key: "Material", value: "Aluminum + Leather" },
      { key: "Weight", value: "1.2kg" },
      { key: "Warranty", value: "2 years" },
    ],
    reviews: [
      { user: "Alice", rating: 5, comment: "Excellent quality!" },
      { user: "Bob", rating: 4, comment: "Really loved it!" },
      { user: "Charlie", rating: 5, comment: "Worth every penny!" },
    ],
  };

  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">(
    "description"
  );

  // Slider settings
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

  // Dummy Related Products
  const relatedProducts = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    name: `Related Product ${i + 1}`,
    price: "$" + (99 + i * 20),
  }));

  return (
    <div className="min-h-screen bg-secondary px-6 py-12">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-14">
        {/* ====================== */}
        {/* Left - Images */}
        {/* ====================== */}
        <div className="flex-1">
          <Slider {...sliderSettings} className="rounded-[45px] overflow-hidden shadow-lg shadow-primary/20">
            {product.images.map((img, idx) => (
              <div key={idx} className="relative h-[500px] md:h-[600px] flex items-center justify-center bg-gradient-to-br from-white/5 to-white/10">
                <img src={img} alt={product.name} className="h-full object-contain" />
              </div>
            ))}
          </Slider>
        </div>

        {/* ====================== */}
        {/* Right - Details */}
        {/* ====================== */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <span className="text-white/50 font-black uppercase tracking-[0.25em] text-[11px]">
              {product.category}
            </span>
            <Heart size={20} className="text-white/40 hover:text-primary cursor-pointer transition-all duration-500" />
          </div>

          <h1 className="text-5xl font-black text-white tracking-tight">{product.name}</h1>

          <div className="flex items-center gap-6">
            <span className="text-3xl font-black text-primary">{product.price}</span>
            {product.oldPrice && (
              <span className="text-white/30 line-through font-bold">{product.oldPrice}</span>
            )}
          </div>

          <div className="flex gap-4 mt-6 flex-wrap">
            <button className="flex-1 px-8 py-4 rounded-full bg-primary text-white font-black uppercase tracking-[0.25em] hover:scale-105 transition-all duration-500 shadow-lg shadow-primary/30 flex items-center justify-center gap-3">
              <ShoppingCart size={18} /> Add to Cart
            </button>

            <button className="flex-1 px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-black uppercase tracking-[0.25em] hover:bg-primary hover:text-white transition-all duration-500 flex items-center justify-center gap-3">
              Buy Now <ArrowRight size={18} />
            </button>
          </div>

          {/* Tabs */}
          <div className="mt-12">
            <div className="flex gap-6 border-b border-white/10 mb-6">
              {["description", "specs", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`uppercase font-black tracking-[0.2em] text-[11px] pb-3 transition-colors duration-300 ${
                    activeTab === tab ? "text-primary border-b-2 border-primary" : "text-white/40"
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
                  {product.specifications.map((spec, idx) => (
                    <li key={idx} className="flex justify-between border-b border-white/10 pb-2">
                      <span className="font-bold">{spec.key}</span>
                      <span>{spec.value}</span>
                    </li>
                  ))}
                </ul>
              )}

              {activeTab === "reviews" && (
                <div className="flex flex-col gap-6">
                  {product.reviews.map((review, idx) => (
                    <div key={idx} className="border border-white/10 rounded-3xl p-5">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-black text-white">{review.user}</span>
                        <div className="flex gap-1">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} size={16} className="text-primary" />
                          ))}
                        </div>
                      </div>
                      <p className="text-white/50 text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-16">
            <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-[0.2em]">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((rp) => (
                <div
                  key={rp.id}
                  className="group bg-white/5 p-6 rounded-3xl border border-white/10 shadow-lg hover:shadow-primary/10 transition-all duration-500"
                >
                  <div className="relative h-56 flex items-center justify-center bg-gradient-to-br from-white/5 to-white/10 rounded-2xl mb-4">
                    <Package size={80} className="text-white/10 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{rp.name}</h3>
                  <span className="text-2xl font-black text-primary">{rp.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
