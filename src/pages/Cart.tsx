import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { GetCart, UpdateCartItem, RemoveFromCart, ClearCart } from "../services/cart.service";
import Toast from "../components/common/Toast";

const Cart = () => {
    const [cart, setCart] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, message: "", type: "info" });
    const navigate = useNavigate();

    const showToast = (message: string, type: string = "info") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type: "info" }), 3000);
    };

    const fetchCart = async () => {
        setLoading(true);
        try {
            const res = await GetCart();
            if (res.success) {
                setCart(res.data);
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const handleUpdateQuantity = async (productId: string, newQty: number) => {
        if (newQty < 1) return;
        try {
            const res = await UpdateCartItem(productId, { quantity: newQty });
            if (res.success) {
                fetchCart();
            }
        } catch (error: any) {
            showToast(error.message || "Update failed", "error");
        }
    };

    const handleRemove = async (productId: string) => {
        try {
            const res = await RemoveFromCart(productId);
            if (res.success) {
                showToast("Item removed", "success");
                fetchCart();
            }
        } catch (error: any) {
            showToast(error.message || "Remove failed", "error");
        }
    };

    const handleClear = async () => {
        try {
            const res = await ClearCart();
            if (res.success) {
                showToast("Cart cleared", "success");
                setCart(null);
            }
        } catch (error: any) {
            showToast(error.message || "Clear failed", "error");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-secondary flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-secondary flex flex-col justify-center items-center text-white px-6">
                <div className="p-10 rounded-full bg-white/5 mb-8">
                    <ShoppingBag size={80} className="text-white/20" />
                </div>
                <h1 className="text-4xl font-black mb-4 uppercase tracking-tight text-center">Your Cart is Empty</h1>
                <p className="text-white/40 mb-10 text-center max-w-md font-medium">Looks like you haven't added anything to your cart yet. Explore our premium collection today.</p>
                <NavLink to="/shop" className="px-12 py-5 bg-primary text-white font-black uppercase tracking-widest text-xs rounded-full hover:scale-105 transition-all shadow-lg shadow-primary/30">
                    Start Shopping
                </NavLink>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-secondary px-6 py-12">
            {toast.show && <Toast type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />}
            <div className="max-w-7xl mx-auto">
                <h1 className="text-5xl font-black text-white mb-12 uppercase tracking-tight">Your <span className="text-primary">Cart</span></h1>

                <div className="grid lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        {cart.items.map((item: any) => (
                            <div key={item.product_id._id} className="bg-white/5 p-6 rounded-[40px] border border-white/10 flex flex-col md:flex-row items-center gap-8 group hover:border-primary/30 transition-all duration-500">
                                <div className="h-40 w-40 flex-shrink-0 bg-white/5 rounded-[30px] overflow-hidden">
                                    {item.product_id.images_id?.[0]?.image_url ? (
                                        <img src={item.product_id.images_id[0].image_url} alt={item.product_id.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center">
                                            <ShoppingBag size={40} className="text-white/10" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 flex flex-col gap-2">
                                    <h3 className="text-xl font-black text-white group-hover:text-primary transition-colors">{item.product_id.name}</h3>
                                    <p className="text-xs font-bold text-white/30 uppercase tracking-widest">{item.product_id.sku}</p>
                                    <p className="text-2xl font-black text-primary mt-2">${item.product_id.discount_price > 0 ? item.product_id.discount_price : item.product_id.price}</p>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="flex items-center bg-white/5 rounded-full border border-white/10 px-4 py-2">
                                        <button onClick={() => handleUpdateQuantity(item.product_id._id, item.quantity - 1)} className="text-white/50 hover:text-white transition-colors">
                                            <Minus size={18} />
                                        </button>
                                        <span className="mx-6 text-white font-black">{item.quantity}</span>
                                        <button onClick={() => handleUpdateQuantity(item.product_id._id, item.quantity + 1)} className="text-white/50 hover:text-white transition-colors">
                                            <Plus size={18} />
                                        </button>
                                    </div>

                                    <button onClick={() => handleRemove(item.product_id._id)} className="p-4 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        <button onClick={handleClear} className="self-end mt-4 text-white/30 hover:text-red-500 font-black uppercase tracking-widest text-[10px] flex items-center gap-2 transition-colors">
                            <Trash2 size={14} /> Clear Entire Cart
                        </button>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-white/5 p-10 rounded-[45px] border border-white/10 backdrop-blur-3xl shadow-2xl">
                            <h2 className="text-2xl font-black text-white mb-8 border-b border-white/5 pb-4 uppercase tracking-widest">Summary</h2>

                            <div className="flex flex-col gap-4 mb-8">
                                <div className="flex justify-between text-white/50 font-bold uppercase tracking-widest text-xs">
                                    <span>Subtotal</span>
                                    <span>${cart.total_price}</span>
                                </div>
                                <div className="flex justify-between text-white/50 font-bold uppercase tracking-widest text-xs">
                                    <span>Shipping</span>
                                    <span className="text-primary">FREE</span>
                                </div>
                            </div>

                            <div className="flex justify-between text-3xl font-black text-white mb-10 pt-6 border-t border-white/5">
                                <span>Total</span>
                                <span className="text-primary">${cart.total_price}</span>
                            </div>

                            <button
                                onClick={() => navigate("/product-checkout")}
                                className="w-full py-5 bg-primary text-white font-black uppercase tracking-[0.2em] text-xs rounded-full hover:scale-105 transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-4"
                            >
                                Checkout Now <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
