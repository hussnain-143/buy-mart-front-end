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
                    <div className="w-12 h-12 border-4 border-white/10 border-t-primary rounded-full animate-spin"></div>
                    <span className="text-xs font-black uppercase tracking-widest text-white/40">Loading Cart</span>
                </div>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-secondary flex flex-col justify-center items-center text-white px-6">
                <div className="w-24 h-24 mb-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                    <ShoppingCart size={40} className="text-white/20" />
                </div>
                <h1 className="text-5xl font-black mb-6 tracking-tight uppercase">Your Cart is Empty</h1>
                <p className="text-lg text-white/50 mb-12 font-medium max-w-md text-center">It looks like you haven't added any premium selections to your cart yet.</p>
                <NavLink to="/shop" className="px-14 py-5 bg-primary text-secondary font-black uppercase tracking-[0.3em] text-[12px] rounded-full hover:scale-105 transition-all duration-500 shadow-2xl">
                    Back to Collection
                </NavLink>
            </div>
        );
    }

    const hasOutOfStock = cart.items.some((item: any) => (item.product_id?.stock_quantity || 0) <= 0);

    return (
        <div className="min-h-screen bg-secondary text-white py-32 px-6 md:px-12 lg:px-24">
            {toast.show && <Toast type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />}
            
            <div className="max-w-7xl mx-auto animate-fade-in-up">
                <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-10">
                    <div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 leading-none">
                            Shopping <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Cart</span>
                        </h1>
                        <p className="text-white/40 font-black uppercase tracking-[0.5em] text-[11px]">System: Inventory Verification</p>
                    </div>
                    <button onClick={() => navigate("/shop")} className="flex items-center gap-4 text-white/40 hover:text-white transition-all font-black uppercase tracking-widest text-[11px] border-b border-white/10 pb-4">
                        <ArrowLeft size={16} /> Continue Selection
                    </button>
                </header>

                <div className="grid lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-8 space-y-8">
                        {cart.items.map((item: any) => (
                            <div key={item.product_id._id} className="group relative flex flex-col md:flex-row items-center gap-10 p-10 bg-[#1E1E1E]/40 backdrop-blur-xl rounded-[40px] border border-white/5 hover:border-primary/30 transition-all duration-700">
                                <div className="h-48 w-48 flex-shrink-0 bg-white/5 rounded-[30px] p-6 overflow-hidden relative border border-white/5">
                                    {item.product_id.images_id?.[0]?.image_url ? (
                                        <img src={item.product_id.images_id[0].image_url} alt={item.product_id.name} className="h-full w-full object-cover rounded-2xl group-hover:scale-110 transition-transform duration-700" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center">
                                            <ShoppingCart size={32} className="text-white/10" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-8">
                                        <div>
                                            <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight line-clamp-1">{item.product_id.name}</h3>
                                            <span className="px-5 py-1.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-white/30">Ref: {item.product_id.sku || 'N/A'}</span>
                                        </div>
                                        <button onClick={() => handleRemove(item.product_id._id)} className="p-4 rounded-full bg-white/5 text-white/20 hover:text-rose-500 hover:bg-rose-500/10 transition-all duration-500">
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                    
                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="flex items-center gap-8 bg-white/5 px-8 py-4 rounded-full border border-white/5">
                                            {(item.product_id?.stock_quantity || 0) <= 0 ? (
                                                <span className="text-primary text-[11px] font-black uppercase tracking-widest italic font-montserrat">Out of Stock</span>
                                            ) : (
                                                <>
                                                    <button onClick={() => handleUpdateQuantity(item.product_id._id, item.quantity - 1)} disabled={refreshing || item.quantity <= 1} className="text-white/20 hover:text-white disabled:opacity-0 transition-opacity"><Minus size={16} /></button>
                                                    <span className="text-xl font-black w-8 text-center tabular-nums italic">{item.quantity}</span>
                                                    <button onClick={() => handleUpdateQuantity(item.product_id._id, item.quantity + 1)} disabled={refreshing || item.quantity >= (item.product_id?.stock_quantity || 0)} className="text-white/20 hover:text-white disabled:opacity-0 transition-opacity"><Plus size={16} /></button>
                                                </>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-3xl font-black text-white flex flex-col">
                                                <span className="text-[10px] uppercase text-white/30 tracking-[0.3em] font-black mb-1">Item Total</span>
                                                <span className="tabular-nums font-montserrat">${(item.total_price || 0).toFixed(2)}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="pt-10 flex justify-start">
                             <button onClick={clearCart} className="flex items-center gap-3 text-white/20 hover:text-rose-500 transition-all font-black uppercase tracking-[0.3em] text-[10px]">
                                <Trash2 size={16} /> Purge Cart Data
                             </button>
                        </div>
                    </div>

                    <div className="lg:col-span-4 lg:sticky lg:top-32">
                        <div className="bg-[#1E1E1E]/60 backdrop-blur-2xl p-16 rounded-[50px] border border-white/10 shadow-3xl shadow-black/50">
                            <h2 className="text-3xl font-black text-white mb-12 uppercase tracking-tight italic">Summary</h2>
                            
                            <div className="space-y-8 mb-16">
                                <div className="flex justify-between items-end">
                                    <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30">Subtotal Value</span>
                                    <span className="text-2xl font-bold text-white tabular-nums">${(cart.total_price || 0).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30">Logistics</span>
                                    <span className="text-primary font-black uppercase tracking-widest text-xs italic">Complimentary</span>
                                </div>
                                <div className="h-px w-full bg-white/5"></div>
                                <div className="space-y-4 pt-4">
                                    <span className="text-[11px] font-black uppercase tracking-[0.6em] text-white/20 block">Final Settlement</span>
                                    <span className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent tabular-nums leading-none">
                                        ${(cart.total_price || 0).toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate("/product-checkout")}
                                disabled={hasOutOfStock}
                                className="w-full py-8 bg-primary text-secondary font-black uppercase tracking-[0.5em] text-[13px] rounded-full hover:scale-[1.03] transition-all duration-700 shadow-3xl flex items-center justify-center gap-6 disabled:opacity-20 disabled:grayscale group shadow-primary/20"
                            >
                                {hasOutOfStock ? "RESTOCK REQUIRED" : "Checkout"}
                                {!hasOutOfStock && <ArrowRight size={24} className="group-hover:translate-x-3 transition-transform duration-700" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
