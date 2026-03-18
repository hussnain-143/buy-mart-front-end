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
        if (!success) showToast("System synchronization error.", "error");
    };

    const handleRemove = async (productId: string) => {
        const success = await removeItem(productId);
        if (success) showToast("Item dequeued.", "success");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex justify-center items-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-2 border-white/10 border-t-white rounded-full animate-spin"></div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Initialising Interface</span>
                </div>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-black flex flex-col justify-center items-center text-white px-6">
                <div className="w-24 h-24 mb-10 border border-white/10 rounded-full flex items-center justify-center bg-white/[0.02]">
                    <ShoppingCart size={32} className="text-white/20" />
                </div>
                <h1 className="text-5xl font-bold mb-4 tracking-tight">Basket Empty</h1>
                <p className="text-white/40 mb-12 font-medium">Your digital selection is currently unpopulated.</p>
                <NavLink to="/shop" className="px-12 py-4 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-white/90 transition-all">
                    Browse Collection
                </NavLink>
            </div>
        );
    }

    const hasOutOfStock = cart.items.some((item: any) => (item.product_id?.stock_quantity || 0) <= 0);

    return (
        <div className="min-h-screen bg-black text-white py-24 px-6 md:px-12 lg:px-24">
            {toast.show && <Toast type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />}
            
            <div className="max-w-7xl mx-auto">
                <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/10 pb-12">
                    <div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4">Cart.</h1>
                        <p className="text-white/40 font-bold uppercase tracking-[0.3em] text-[11px]">Protocol: Review & Proceed</p>
                    </div>
                    <button onClick={() => navigate("/shop")} className="flex items-center gap-3 text-white/30 hover:text-white transition-all font-bold uppercase tracking-widest text-[10px]">
                        <ArrowLeft size={14} /> Continue Shopping
                    </button>
                </header>

                <div className="grid lg:grid-cols-12 gap-20">
                    <div className="lg:col-span-8 space-y-px bg-white/5 border border-white/5 overflow-hidden">
                        {cart.items.map((item: any) => (
                            <div key={item.product_id._id} className="group relative flex flex-col md:flex-row items-center gap-10 p-10 bg-black hover:bg-white/[0.02] transition-all">
                                <div className="h-40 w-40 flex-shrink-0 bg-white/[0.03] border border-white/5 p-4 overflow-hidden relative">
                                    {item.product_id.images_id?.[0]?.image_url ? (
                                        <img src={item.product_id.images_id[0].image_url} alt={item.product_id.name} className="h-full w-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center">
                                            <ShoppingCart size={24} className="text-white/10" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-2xl font-bold tracking-tight mb-2 uppercase">{item.product_id.name}</h3>
                                            <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">ModelRef: {item.product_id.sku || 'N/A'}</p>
                                        </div>
                                        <button onClick={() => handleRemove(item.product_id._id)} className="text-white/10 hover:text-white transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-6 border border-white/10 px-5 py-3 rounded-full">
                                            {(item.product_id?.stock_quantity || 0) <= 0 ? (
                                                <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Out of Stock</span>
                                            ) : (
                                                <>
                                                    <button onClick={() => handleUpdateQuantity(item.product_id._id, item.quantity - 1)} disabled={refreshing || item.quantity <= 1} className="text-white/40 hover:text-white disabled:opacity-0 transition-opacity"><Minus size={14} /></button>
                                                    <span className="text-sm font-bold w-4 text-center tabular-nums">{item.quantity}</span>
                                                    <button onClick={() => handleUpdateQuantity(item.product_id._id, item.quantity + 1)} disabled={refreshing || item.quantity >= (item.product_id?.stock_quantity || 0)} className="text-white/40 hover:text-white disabled:opacity-0 transition-opacity"><Plus size={14} /></button>
                                                </>
                                            )}
                                        </div>
                                        <p className="text-2xl font-bold tracking-tighter tabular-nums text-white/50 group-hover:text-white transition-colors">
                                            ${(item.total_price || 0).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="lg:col-span-4 lg:sticky lg:top-24">
                        <div className="border border-white/10 p-12 bg-white/[0.01]">
                            <h2 className="text-xl font-bold uppercase tracking-widest mb-10 pb-6 border-b border-white/5">Order Overview.</h2>
                            
                            <div className="space-y-6 mb-12">
                                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-white/40">
                                    <span>Subtotal</span>
                                    <span className="text-white tabular-nums">${(cart.total_price || 0).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-white/40">
                                    <span>Logistics</span>
                                    <span className="text-white italic">Complimentary</span>
                                </div>
                                <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                                    <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-white/30">Total Value</span>
                                    <span className="text-5xl font-black tracking-tighter tabular-nums">${(cart.total_price || 0).toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate("/product-checkout")}
                                disabled={hasOutOfStock}
                                className="w-full py-6 bg-white text-black font-bold uppercase tracking-[0.3em] text-[11px] hover:invert transition-all duration-500 disabled:opacity-10 flex items-center justify-center gap-4 group"
                            >
                                {hasOutOfStock ? "RESTOCK NECESSARY" : "Commit Transaction"}
                                {!hasOutOfStock && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                            </button>
                            
                            <div className="mt-8 flex justify-center">
                                <button onClick={clearCart} className="text-white/10 hover:text-white transition-all text-[9px] font-bold uppercase tracking-widest">Clear All Entities</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
