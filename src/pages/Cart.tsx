import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingCart, ArrowRight, ArrowLeft } from "lucide-react";
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
        if (!success) showToast("System error.", "error");
    };

    const handleRemove = async (productId: string) => {
        const success = await removeItem(productId);
        if (success) showToast("Item removed.", "success");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-secondary flex justify-center items-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-white/10 border-t-primary rounded-full animate-spin"></div>
                    <span className="text-xs font-bold uppercase tracking-widest text-white/40">Loading Cart</span>
                </div>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-secondary flex flex-col justify-center items-center text-white px-6">
                <div className="w-20 h-20 mb-8 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                    <ShoppingCart size={32} className="text-white/20" />
                </div>
                <h1 className="text-4xl font-black mb-4 tracking-tight uppercase">Your Cart is Empty</h1>
                <p className="text-base text-white/50 mb-10 font-medium max-w-sm text-center">Your digital selection is currently unpopulated.</p>
                <NavLink to="/shop" className="px-10 py-4 bg-primary text-secondary font-black uppercase tracking-widest text-[11px] rounded-full hover:scale-105 transition-all shadow-xl">
                    Back to Collection
                </NavLink>
            </div>
        );
    }

    const hasOutOfStock = cart.items.some((item: any) => (item.product_id?.stock_quantity || 0) <= 0);

    return (
        <div className="min-h-screen bg-secondary text-white py-20 px-6 md:px-12 lg:px-24">
            {toast.show && <Toast type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />}
            
            <div className="max-w-6xl mx-auto animate-fade-in-up">
                <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-2 leading-none">
                            Shopping <span className="text-primary italic">Cart.</span>
                        </h1>
                        <p className="text-white/30 font-bold uppercase tracking-widest text-[10px]">Registry: Inventory Management</p>
                    </div>
                    <button onClick={() => navigate("/shop")} className="flex items-center gap-3 text-white/40 hover:text-white transition-all font-bold uppercase tracking-widest text-[10px] pb-2">
                        <ArrowLeft size={14} /> Continue Selection
                    </button>
                </header>

                <div className="grid lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8 space-y-6">
                        {cart.items.map((item: any) => (
                            <div key={item.product_id._id} className="group relative flex flex-col md:flex-row items-center gap-8 p-8 bg-[#1E1E1E]/40 backdrop-blur-xl rounded-3xl border border-white/5 hover:border-white/10 transition-all duration-300">
                                <div className="h-32 w-32 flex-shrink-0 bg-white/5 rounded-2xl p-4 overflow-hidden relative border border-white/5">
                                    {item.product_id.images_id?.[0]?.image_url ? (
                                        <img src={item.product_id.images_id[0].image_url} alt={item.product_id.name} className="h-full w-full object-cover rounded-xl transition-transform duration-500" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center">
                                            <ShoppingCart size={24} className="text-white/10" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-lg font-bold text-white mb-1 uppercase tracking-tight line-clamp-1">{item.product_id.name}</h3>
                                            <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">Ref: {item.product_id.sku || 'N/A'}</span>
                                        </div>
                                        <button onClick={() => handleRemove(item.product_id._id)} className="p-3 rounded-full bg-white/5 text-white/10 hover:text-rose-500 transition-all">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    
                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="flex items-center gap-6 bg-white/5 px-6 py-3 rounded-full border border-white/5">
                                            {(item.product_id?.stock_quantity || 0) <= 0 ? (
                                                <span className="text-primary text-[10px] font-bold uppercase tracking-widest">Out of Stock</span>
                                            ) : (
                                                <>
                                                    <button onClick={() => handleUpdateQuantity(item.product_id._id, item.quantity - 1)} disabled={refreshing || item.quantity <= 1} className="text-white/20 hover:text-white disabled:opacity-30 transition-all scale-90"><Minus size={14} /></button>
                                                    <span className="text-lg font-bold w-6 text-center tabular-nums">{item.quantity}</span>
                                                    <button onClick={() => handleUpdateQuantity(item.product_id._id, item.quantity + 1)} disabled={refreshing || item.quantity >= (item.product_id?.stock_quantity || 0)} className="text-white/20 hover:text-white disabled:opacity-30 transition-all scale-90"><Plus size={14} /></button>
                                                </>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-black text-white flex flex-col items-end">
                                                <span className="text-[9px] uppercase text-white/20 tracking-widest font-bold mb-1">Item Total</span>
                                                <span className="tabular-nums">${((item.total_price || (item.product_id?.price * item.quantity)) || 0).toFixed(2)}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="pt-6">
                             <button onClick={clearCart} className="flex items-center gap-2 text-white/20 hover:text-rose-500/60 transition-all font-bold uppercase tracking-widest text-[9px]">
                                <Trash2 size={14} /> Clear Selection
                             </button>
                        </div>
                    </div>

                    <div className="lg:col-span-4 lg:sticky lg:top-24">
                        <div className="bg-[#1E1E1E]/60 backdrop-blur-2xl p-10 rounded-[32px] border border-white/5 shadow-2xl">
                            <h2 className="text-xl font-bold text-white mb-8 uppercase tracking-widest">Summary</h2>
                            
                            <div className="space-y-6 mb-10">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Subtotal</span>
                                    <span className="text-lg font-bold text-white tabular-nums">${(cart.total_price || 0).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Logistics</span>
                                    <span className="text-primary font-bold uppercase tracking-widest text-[10px]">Free</span>
                                </div>
                                <div className="h-px w-full bg-white/5"></div>
                                <div className="space-y-2 pt-2">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/20 block">Total Due</span>
                                    <span className="text-5xl font-black text-primary tabular-nums tracking-tighter">
                                        ${(cart.total_price || 0).toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate("/product-checkout")}
                                disabled={hasOutOfStock}
                                className="w-full py-6 bg-primary text-secondary font-black uppercase tracking-[0.3em] text-[12px] rounded-full hover:brightness-110 transition-all shadow-lg flex items-center justify-center gap-4 disabled:opacity-20 disabled:grayscale group"
                            >
                                {hasOutOfStock ? "RESTOCK REQUIRED" : "Proceed"}
                                {!hasOutOfStock && <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-300" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
