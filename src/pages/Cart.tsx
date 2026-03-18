import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, ArrowLeft, Shield } from "lucide-react";
import { useCart } from "../context/CartContext";
import Toast from "../components/common/Toast";

const Cart = () => {
    const { cart, loading, refreshing, fetchCart, updateQuantity, removeItem, clearCart } = useCart();
    const [toast, setToast] = useState({ show: false, message: "", type: "info" });
    const navigate = useNavigate();

    const showToast = (message: string, type: string = "info") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type: "info" }), 3000);
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const handleUpdateQuantity = async (productId: string, newQty: number) => {
        if (newQty < 1) return;
        const success = await updateQuantity(productId, newQty);
        if (!success) {
            showToast("Update failed", "error");
        }
    };

    const handleRemove = async (productId: string) => {
        const success = await removeItem(productId);
        if (success) {
            showToast("Item removed", "success");
        } else {
            showToast("Remove failed", "error");
        }
    };

    const handleClear = async () => {
        const success = await clearCart();
        if (success) {
            showToast("Cart cleared", "success");
        } else {
            showToast("Clear failed", "error");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex justify-center items-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 border-t-2 border-primary rounded-full animate-spin shadow-[0_0_20px_rgba(255,165,0,0.2)]"></div>
                    <p className="text-white/20 font-black uppercase tracking-[0.5em] text-[10px]">Synchronizing...</p>
                </div>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex flex-col justify-center items-center text-white px-6 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[160px] pointer-events-none"></div>
                
                <div className="relative p-20 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-3xl mb-12 animate-pulse">
                    <ShoppingBag size={100} className="text-white/10" />
                </div>
                <h1 className="text-4xl md:text-6xl font-black mb-8 uppercase tracking-tighter text-center leading-none">
                    NO ITEMS IN <span className="text-primary italic">VAULT</span>
                </h1>
                <p className="text-white/30 mb-16 text-center max-w-sm font-medium text-lg leading-relaxed">
                    Your premium selection is currently empty. Explore the latest collections.
                </p>
                <NavLink to="/shop" className="group relative px-14 py-6 bg-white text-black font-black uppercase tracking-[0.4em] text-[11px] rounded-full hover:bg-primary hover:text-white transition-all duration-700 shadow-2xl">
                    <span className="relative">Start Selection</span>
                </NavLink>
            </div>
        );
    }

    const hasOutOfStock = cart.items.some((item: any) => item.product_id.stock_quantity <= 0);

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-primary/30 py-32 px-6 lg:px-20 relative overflow-hidden">
            {toast.show && <Toast type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />}
            
            <div className="max-w-[1600px] mx-auto relative z-10">
                <div className="flex flex-col gap-4 mb-24 animate-fade-in-up">
                    <div className="flex items-center gap-3">
                        <div className="h-px w-20 bg-primary/30"></div>
                        <span className="text-white/30 font-black text-[10px] uppercase tracking-[0.6em]">Premium Collection</span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
                            Shopping <span className="text-primary italic">Vault</span>
                        </h1>
                        <button onClick={() => navigate("/shop")} className="group inline-flex items-center gap-6 text-white/40 hover:text-white transition-all font-black uppercase tracking-[0.3em] text-[10px] border-b border-white/10 pb-4">
                            <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform text-primary" /> Back to Collection
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-24 items-start">
                    <div className="lg:col-span-8 space-y-12 animate-fade-in-up delay-100">
                        {cart.items.map((item: any) => (
                            <div key={item.product_id._id} className="relative group flex flex-col md:flex-row items-center gap-12 p-10 rounded-[60px] bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] transition-all duration-1000">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                                
                                <div className="h-60 w-60 flex-shrink-0 bg-black rounded-[40px] overflow-hidden border border-white/5 p-4 shadow-2xl relative">
                                    {item.product_id.images_id?.[0]?.image_url ? (
                                        <img src={item.product_id.images_id[0].image_url} alt={item.product_id.name} className="h-full w-full object-cover rounded-[30px] group-hover:scale-110 transition-transform duration-1000" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center bg-white/5 rounded-[30px]">
                                            <ShoppingBag size={48} className="text-white/5" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0 py-2">
                                    <div className="space-y-4 mb-10">
                                        <span className="text-primary font-black text-[9px] uppercase tracking-[0.5em] block">{item.product_id.sku || 'ITEM.001'}</span>
                                        <h3 className="text-3xl font-black text-white tracking-tight uppercase leading-tight truncate">{item.product_id.name}</h3>
                                        <p className="text-white/20 text-sm font-medium line-clamp-1 italic">{item.product_id.desc || "Refining excellence in every detail."}</p>
                                    </div>
                                    
                                    <div className="flex items-center gap-12">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-white/20 text-[9px] font-black uppercase tracking-widest">Unit Price</span>
                                            <p className="text-2xl font-black text-white tracking-tighter tabular-nums">${(item.product_id.discount_price > 0 ? item.product_id.discount_price : item.product_id.price).toFixed(2)}</p>
                                        </div>
                                        <div className="h-10 w-px bg-white/5"></div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-white/20 text-[9px] font-black uppercase tracking-widest">Quantity</span>
                                            <div className="flex items-center gap-6 mt-1">
                                                {item.product_id.stock_quantity <= 0 ? (
                                                    <span className="text-rose-500 font-black text-[10px] uppercase tracking-widest bg-rose-500/10 px-4 py-1.5 rounded-full">Unavailable</span>
                                                ) : (
                                                    <>
                                                        <button 
                                                            onClick={() => handleUpdateQuantity(item.product_id._id, item.quantity - 1)} 
                                                            disabled={refreshing || item.quantity <= 1}
                                                            className="text-white/20 hover:text-primary transition-colors disabled:opacity-0"
                                                        >
                                                            <Minus size={20} />
                                                        </button>
                                                        <span className="text-xl font-black text-white tabular-nums italic">{item.quantity}</span>
                                                        <button 
                                                            onClick={() => handleUpdateQuantity(item.product_id._id, item.quantity + 1)} 
                                                            disabled={refreshing || item.quantity >= item.product_id.stock_quantity}
                                                            className="text-white/20 hover:text-primary transition-colors disabled:opacity-0"
                                                        >
                                                            <Plus size={20} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute top-10 right-10">
                                    <button 
                                        onClick={() => handleRemove(item.product_id._id)} 
                                        disabled={refreshing} 
                                        className="p-4 rounded-full bg-white/5 border border-white/5 text-white/20 hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/20 transition-all duration-500"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        <div className="flex justify-start pt-12">
                            <button onClick={handleClear} disabled={refreshing} className="group flex items-center gap-4 text-white/20 hover:text-rose-500 transition-all font-black uppercase tracking-[0.4em] text-[10px]">
                                <Trash2 size={16} /> Purge Selection
                            </button>
                        </div>
                    </div>

                    <div className="lg:col-span-4 lg:sticky lg:top-32 animate-fade-in-up delay-200">
                        <div className="bg-white/[0.02] backdrop-blur-3xl p-16 rounded-[70px] border border-white/5 shadow-3xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -mr-48 -mt-48"></div>
                            
                            <div className="mb-16">
                                <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter italic">Checkout</h2>
                                <p className="text-white/20 text-xs font-black uppercase tracking-widest">Final Ledger Settlement</p>
                            </div>

                            <div className="space-y-10 mb-20">
                                <div className="flex justify-between items-center text-white/40 font-black uppercase tracking-[0.4em] text-[10px]">
                                    <span>Subtotal</span>
                                    <span className="text-white tracking-tighter text-2xl">${cart.total_price.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-white/40 font-black uppercase tracking-[0.4em] text-[10px]">
                                    <span>Priority Shipping</span>
                                    <span className="text-primary tracking-widest text-xs italic font-black">INCLUDED</span>
                                </div>
                                <div className="h-px w-full bg-white/5"></div>
                                <div className="flex flex-col gap-4">
                                    <span className="text-white/20 font-black uppercase tracking-[0.6em] text-[9px]">Total Amount Due</span>
                                    <span className="text-7xl font-black text-white tracking-tighter drop-shadow-[0_0_40px_rgba(255,255,255,0.1)] leading-none tabular-nums animate-glow">${cart.total_price.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate("/product-checkout")}
                                disabled={hasOutOfStock}
                                className="group relative w-full py-10 bg-white text-black font-black uppercase tracking-[0.6em] text-[12px] rounded-full hover:bg-primary hover:text-white transition-all duration-700 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] flex items-center justify-center gap-8 overflow-hidden disabled:opacity-20 disabled:grayscale"
                            >
                                <span className="relative flex items-center gap-6">
                                    {hasOutOfStock ? "RESTOCK REQUIRED" : "Release Order"} <ArrowRight size={24} className="group-hover:translate-x-3 transition-transform duration-700" />
                                </span>
                            </button>
                            
                            <div className="mt-12 flex items-center justify-center gap-4 text-white/10 text-[9px] font-black uppercase tracking-[0.5em]">
                                <Shield size={14} /> Encrypted Transaction Protocol
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>
                {`
                    @keyframes fade-in-up {
                        from { opacity: 0; transform: translateY(40px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-fade-in-up {
                        animation: fade-in-up 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
                    }
                    .delay-100 { animation-delay: 0.1s; }
                    .delay-200 { animation-delay: 0.2s; }
                    @keyframes glow {
                        0%, 100% { text-shadow: 0 0 20px rgba(255,255,255,0); }
                        50% { text-shadow: 0 0 30px rgba(255,165,0,0.3); }
                    }
                    .animate-glow {
                        animation: glow 4s infinite ease-in-out;
                    }
                `}
            </style>
        </div>
    );
};

export default Cart;
