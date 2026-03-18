import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, ArrowLeft, ShieldCheck } from "lucide-react";
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
            <div className="min-h-screen bg-secondary flex justify-center items-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    <p className="text-white/40 font-black uppercase tracking-widest text-[10px]">Updating Cart...</p>
                </div>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-secondary flex flex-col justify-center items-center text-white px-6 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
                
                <div className="relative p-16 rounded-[60px] bg-white/5 border border-white/10 backdrop-blur-3xl mb-12 shadow-2xl group transition-all duration-700 hover:border-primary/30">
                    <ShoppingBag size={80} className="text-white/20 group-hover:text-primary transition-colors duration-500" />
                </div>
                <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tight text-center">
                    Your Cart is <span className="text-primary italic">Empty</span>
                </h1>
                <p className="text-white/40 mb-12 text-center max-w-md font-medium text-lg leading-relaxed">
                    Looks like you haven't added any premium products to your cart yet.
                </p>
                <NavLink to="/shop" className="group relative px-14 py-5 bg-primary text-white font-black uppercase tracking-[0.4em] text-[12px] rounded-full hover:scale-105 transition-all duration-500 shadow-2xl shadow-primary/20 overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                    <span className="relative">Browse Collection</span>
                </NavLink>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-secondary text-white selection:bg-primary/30 py-24 px-6 relative overflow-hidden">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[150px]"></div>
                <div className="absolute bottom-[0%] left-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px]"></div>
            </div>

            {refreshing && (
                <div className="fixed top-28 right-10 z-50 bg-white/5 backdrop-blur-3xl p-4 px-6 rounded-full border border-white/10 animate-pulse flex items-center gap-3 shadow-2xl">
                    <div className="w-2 h-2 rounded-full bg-primary animate-ping"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Updating Cart State</span>
                </div>
            )}
            
            {toast.show && <Toast type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />}
            
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20 animate-fade-in-up">
                    <div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-px w-12 bg-primary"></div>
                            <span className="text-white/40 font-black text-[10px] uppercase tracking-[0.5em]">Your Selection</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tight leading-none">
                            Shopping <span className="text-primary italic">Cart</span>
                        </h1>
                    </div>
                    <button onClick={() => navigate("/shop")} className="group flex items-center gap-4 text-white/40 hover:text-white transition-all font-black uppercase tracking-[0.3em] text-[10px] bg-white/5 px-8 py-4 rounded-full border border-white/10 hover:border-white/20">
                        <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform text-primary" /> Continue Shopping
                    </button>
                </div>

                <div className="grid lg:grid-cols-12 gap-16 items-start">
                    <div className="lg:col-span-8 space-y-8 animate-fade-in-up delay-100">
                        {cart.items.map((item: any) => (
                            <div key={item.product_id._id} className="bg-white/5 backdrop-blur-3xl p-8 rounded-[40px] border border-white/10 flex flex-col md:flex-row items-center gap-10 group hover:bg-white/10 transition-all duration-700 hover:-translate-y-1 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -mr-24 -mt-24 group-hover:bg-primary/10 transition-all duration-700"></div>
                                
                                <div className="h-44 w-44 flex-shrink-0 bg-white/5 rounded-[35px] overflow-hidden border border-white/10 p-3 shadow-xl transition-all duration-500 group-hover:border-primary/30">
                                    {item.product_id.images_id?.[0]?.image_url ? (
                                        <img src={item.product_id.images_id[0].image_url} alt={item.product_id.name} className="h-full w-full object-cover rounded-[25px] group-hover:scale-110 transition-transform duration-700" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center bg-white/5 rounded-[25px]">
                                            <ShoppingBag size={48} className="text-white/10" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 flex flex-col gap-4 min-w-0 py-2">
                                    <div className="space-y-2">
                                        <span className="text-accent font-black text-[9px] uppercase tracking-[0.4em] block">{item.product_id.sku || 'PREMIUM-ITEM'}</span>
                                        <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase group-hover:text-primary transition-colors truncate">{item.product_id.name}</h3>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <p className="text-3xl font-black text-white tracking-tighter tabular-nums">${(item.product_id.discount_price > 0 ? item.product_id.discount_price : item.product_id.price).toFixed(2)}</p>
                                        {item.product_id.discount_price > 0 && (
                                            <span className="text-white/20 line-through text-sm font-bold">${item.product_id.price.toFixed(2)}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col md:items-end gap-6 w-full md:w-auto">
                                    <div className="flex items-center bg-white/5 rounded-2xl border border-white/10 p-2 shadow-inner">
                                        <button 
                                            onClick={() => handleUpdateQuantity(item.product_id._id, item.quantity - 1)} 
                                            disabled={refreshing || item.quantity <= 1}
                                            className="w-12 h-12 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all disabled:opacity-10"
                                        >
                                            <Minus size={20} />
                                        </button>
                                        <span className="mx-4 text-2xl font-black text-white w-10 text-center tabular-nums italic">{item.quantity}</span>
                                        <button 
                                            onClick={() => handleUpdateQuantity(item.product_id._id, item.quantity + 1)} 
                                            disabled={refreshing}
                                            className="w-12 h-12 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all disabled:opacity-10"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>

                                    <button 
                                        onClick={() => handleRemove(item.product_id._id)} 
                                        disabled={refreshing} 
                                        className="h-14 px-8 rounded-full bg-rose-500/5 text-rose-500/50 hover:bg-rose-500 hover:text-white transition-all duration-500 disabled:opacity-20 font-black text-[10px] uppercase tracking-[0.2em] border border-rose-500/10 hover:border-rose-500 shadow-lg shadow-rose-500/0 hover:shadow-rose-500/20"
                                    >
                                        Remove Item
                                    </button>
                                </div>
                            </div>
                        ))}

                        <div className="flex justify-end pt-10">
                            <button onClick={handleClear} disabled={refreshing} className="group relative px-10 py-5 bg-white/5 border border-white/10 hover:border-rose-500/40 text-white/40 hover:text-rose-500 font-black uppercase tracking-[0.4em] text-[10px] rounded-full transition-all duration-500 disabled:opacity-30 overflow-hidden shadow-xl">
                                <div className="absolute inset-0 bg-rose-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                                <span className="relative flex items-center gap-3">
                                    <Trash2 size={16} /> Clear Cart
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="lg:col-span-4 lg:sticky lg:top-32 animate-fade-in-up delay-200">
                        <div className="bg-white/5 backdrop-blur-3xl p-12 rounded-[50px] border border-white/10 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                            
                            <h2 className="text-3xl font-black text-white mb-10 border-b border-white/10 pb-8 uppercase tracking-tight italic">Summary</h2>

                            <div className="space-y-6 mb-12">
                                <div className="flex justify-between items-center bg-white/5 p-6 rounded-2xl border border-white/5 transition-all hover:bg-white/10">
                                    <span className="text-white/40 font-black uppercase tracking-[0.3em] text-[10px]">Total Items</span>
                                    <span className="text-xl font-black text-white">{cart.items.length} Units</span>
                                </div>
                                
                                <div className="flex flex-col gap-5 px-3">
                                    <div className="flex justify-between text-white/40 font-black uppercase tracking-[0.3em] text-[11px]">
                                        <span>Subtotal</span>
                                        <span className="text-white tracking-tighter text-lg">${cart.total_price.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-white/40 font-black uppercase tracking-[0.3em] text-[11px]">
                                        <span>Shipping</span>
                                        <span className="text-accent tracking-widest text-sm italic font-black">COMPLIMENTARY</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-10 border-t border-white/10 flex flex-col gap-2 mb-12">
                                <span className="text-white/30 font-black uppercase tracking-[0.5em] text-[10px]">Estimated Total</span>
                                <div className="flex justify-between items-end">
                                    <span className="text-6xl font-black text-primary tracking-tighter drop-shadow-[0_0_30px_rgba(255,111,0,0.3)]">${cart.total_price.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate("/product-checkout")}
                                className="group relative w-full py-8 bg-primary text-secondary font-black uppercase tracking-[0.5em] text-[13px] rounded-[35px] hover:scale-[1.03] active:scale-95 transition-all duration-500 shadow-2xl shadow-primary/30 flex items-center justify-center gap-5 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>
                                <span className="relative flex items-center gap-5">
                                    Checkout <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform duration-500" />
                                </span>
                            </button>
                            
                            <p className="mt-8 text-center text-white/20 text-[9px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3">
                                <ShieldCheck size={14} className="text-primary/50" /> Secure Premium Transaction
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
