import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Loader, ArrowLeft, ShieldCheck } from "lucide-react";
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
            <div className="min-h-screen bg-[#0f172a] flex justify-center items-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader className="animate-spin h-10 w-10 text-primary" />
                    <p className="text-white/40 font-bold uppercase tracking-widest text-[10px] italic">Syncing Cart Data...</p>
                </div>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex flex-col justify-center items-center text-white px-6 relative overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]"></div>
                
                <div className="relative p-12 rounded-[50px] bg-white/[0.02] border border-white/5 backdrop-blur-3xl mb-10 shadow-2xl">
                    <ShoppingBag size={80} className="text-white/10" />
                    <div className="absolute inset-0 bg-primary/5 rounded-[50px] animate-pulse"></div>
                </div>
                <h1 className="text-5xl font-black mb-6 uppercase tracking-tighter italic text-center">Empty <span className="text-primary">Payload</span></h1>
                <p className="text-white/30 mb-10 text-center max-w-sm font-medium text-lg leading-relaxed">No high-velocity assets detected in your current session.</p>
                <NavLink to="/shop" className="group relative px-12 py-5 bg-primary text-white font-black uppercase tracking-[0.3em] text-[11px] rounded-full hover:scale-105 transition-all shadow-2xl shadow-primary/40 overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                    <span className="relative">Access Database</span>
                </NavLink>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f172a] text-white selection:bg-primary/30 py-20 px-6 relative overflow-hidden">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[150px]"></div>
                <div className="absolute bottom-[10%] left-[-10%] w-[30%] h-[30%] bg-blue-600/5 rounded-full blur-[120px]"></div>
            </div>

            {refreshing && (
                <div className="fixed top-24 right-10 z-50 bg-white/10 backdrop-blur-3xl p-3 px-5 rounded-full border border-white/10 animate-pulse flex items-center gap-3">
                    <Loader size={14} className="text-primary animate-spin" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-primary">Refreshing Node</span>
                </div>
            )}
            
            {toast.show && <Toast type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />}
            
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 animate-fade-in-up">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-1 bg-primary rounded-full"></div>
                            <span className="text-white/20 font-black text-[9px] uppercase tracking-[0.4em]">Active Payload Node</span>
                        </div>
                        <h1 className="text-7xl font-black uppercase tracking-tighter italic leading-none">
                            Your <span className="text-primary">Cart</span>
                        </h1>
                    </div>
                    <button onClick={() => navigate("/shop")} className="group flex items-center gap-3 text-white/30 hover:text-white transition-all font-black uppercase tracking-[0.2em] text-[9px] bg-white/5 px-6 py-3 rounded-full border border-white/5">
                        <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform text-primary" /> Continue Acquisition
                    </button>
                </div>

                <div className="grid lg:grid-cols-12 gap-12 items-start">
                    <div className="lg:col-span-8 space-y-6 animate-fade-in-up delay-100">
                        {cart.items.map((item: any) => (
                            <div key={item.product_id._id} className="bg-white/[0.02] backdrop-blur-3xl p-6 rounded-[40px] border border-white/5 flex flex-col md:flex-row items-center gap-8 group hover:bg-white/[0.04] transition-all duration-500 hover:scale-[1.01] shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors"></div>
                                
                                <div className="h-40 w-40 flex-shrink-0 bg-black/40 rounded-[32px] overflow-hidden border border-white/5 p-2 group-hover:border-primary/20 transition-all shadow-xl">
                                    {item.product_id.images_id?.[0]?.image_url ? (
                                        <img src={item.product_id.images_id[0].image_url} alt={item.product_id.name} className="h-full w-full object-cover rounded-[24px] group-hover:scale-110 transition-transform duration-700" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center bg-white/5 rounded-[24px]">
                                            <ShoppingBag size={40} className="text-white/10" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 flex flex-col gap-3 min-w-0 py-1">
                                    <div className="space-y-1">
                                        <span className="text-primary font-black text-[8px] uppercase tracking-[0.3em] block">{item.product_id.sku}</span>
                                        <h3 className="text-2xl font-black text-white italic tracking-tight uppercase group-hover:text-primary transition-colors truncate">{item.product_id.name}</h3>
                                    </div>
                                    <p className="text-3xl font-black text-white tracking-tighter tabular-nums italic">${(item.product_id.discount_price > 0 ? item.product_id.discount_price : item.product_id.price).toFixed(2)}</p>
                                </div>

                                <div className="flex flex-col md:items-end gap-5 w-full md:w-auto">
                                    <div className="flex items-center bg-white/5 rounded-2xl border border-white/10 p-1.5 shadow-inner">
                                        <button 
                                            onClick={() => handleUpdateQuantity(item.product_id._id, item.quantity - 1)} 
                                            disabled={refreshing || item.quantity <= 1}
                                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white/30 hover:text-white hover:bg-white/5 transition-all disabled:opacity-20"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="mx-3 text-xl font-black text-white w-10 text-center tabular-nums italic">{item.quantity}</span>
                                        <button 
                                            onClick={() => handleUpdateQuantity(item.product_id._id, item.quantity + 1)} 
                                            disabled={refreshing}
                                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white/30 hover:text-white hover:bg-white/5 transition-all disabled:opacity-20"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>

                                    <button 
                                        onClick={() => handleRemove(item.product_id._id)} 
                                        disabled={refreshing} 
                                        className="h-12 px-6 rounded-full bg-red-500/5 text-red-500/40 hover:bg-red-500 hover:text-white transition-all disabled:opacity-20 font-black text-[9px] uppercase tracking-widest border border-red-500/10 hover:border-red-500"
                                    >
                                        Purge Node
                                    </button>
                                </div>
                            </div>
                        ))}

                        <div className="flex justify-end pt-6">
                            <button onClick={handleClear} disabled={refreshing} className="group relative px-8 py-4 bg-white/5 border border-white/5 hover:border-red-500/30 text-white/20 hover:text-red-500 font-black uppercase tracking-[0.3em] text-[9px] rounded-full transition-all disabled:opacity-30 overflow-hidden">
                                <div className="absolute inset-0 bg-red-500/5 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                                <span className="relative flex items-center gap-2">
                                    <Trash2 size={14} /> Purge All
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="lg:col-span-4 lg:sticky lg:top-24 animate-fade-in-up delay-200">
                        <div className="bg-white/[0.02] backdrop-blur-3xl p-10 rounded-[48px] border border-white/5 shadow-2xl relative overflow-hidden border-t-primary/20">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-[80px] -mr-24 -mt-24"></div>
                            
                            <h2 className="text-3xl font-black text-white mb-10 border-b border-white/5 pb-6 uppercase tracking-tighter italic">Ledger</h2>

                            <div className="space-y-4 mb-10">
                                <div className="flex justify-between items-center bg-white/5 p-5 rounded-2xl border border-white/5">
                                    <span className="text-white/20 font-black uppercase tracking-[0.2em] text-[9px]">Active Nodes</span>
                                    <span className="text-lg font-black text-white italic">{cart.items.length} Units</span>
                                </div>
                                
                                <div className="flex flex-col gap-3 px-2">
                                    <div className="flex justify-between text-white/30 font-black uppercase tracking-[0.2em] text-[10px]">
                                        <span>Subtotal</span>
                                        <span className="text-white/60 tracking-tighter text-sm">${cart.total_price.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-white/30 font-black uppercase tracking-[0.2em] text-[10px]">
                                        <span>Logistics</span>
                                        <span className="text-primary tracking-tighter text-sm italic">FREE</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-white/5 flex flex-col gap-1 mb-10">
                                <span className="text-white/20 font-black uppercase tracking-[0.4em] text-[9px]">Total Payload Value</span>
                                <div className="flex justify-between items-end">
                                    <span className="text-6xl font-black text-primary tracking-tighter italic leading-none shadow-primary/20 drop-shadow-2xl">${cart.total_price.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate("/product-checkout")}
                                className="group relative w-full py-8 bg-primary text-white font-black uppercase tracking-[0.4em] text-[11px] rounded-[32px] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-primary/50 flex items-center justify-center gap-4 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                                <span className="relative flex items-center gap-4">
                                    Checkout <ArrowRight size={18} />
                                </span>
                            </button>
                            
                            <p className="mt-6 text-center text-white/10 text-[8px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                                <ShieldCheck size={12} className="text-primary/40" /> SSL-256 Quantum Shield
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
