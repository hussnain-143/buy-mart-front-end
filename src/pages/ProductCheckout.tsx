import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Truck, ShieldCheck, ArrowLeft, Loader } from "lucide-react";
import { GetCart } from "../services/cart.service";
import { CreateOrder } from "../services/order.service";
import { CreateProductCheckout } from "../services/stripe.service";
import Toast from "../components/common/Toast";

const ProductCheckout = () => {
    const [cart, setCart] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "", type: "info" });
    const [shippingAddress, setShippingAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("card");
    const navigate = useNavigate();

    const showToast = (message: string, type: string = "info") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type: "info" }), 3000);
    };

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await GetCart();
                if (res.success && res.data?.items.length > 0) {
                    setCart(res.data);
                } else {
                    navigate("/cart");
                }
            } catch (error) {
                console.error("Error fetching cart for checkout:", error);
                navigate("/cart");
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, [navigate]);

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!shippingAddress) {
            showToast("Shipping address is required", "error");
            return;
        }

        setIsProcessing(true);
        try {
            if (paymentMethod === "card") {
                // Stripe Checkout
                const user = JSON.parse(localStorage.getItem("user") || "{}");
                const res = await CreateProductCheckout({
                    items: cart.items,
                    shippingAddress,
                    email: user.email,
                    fullName: `${user.firstName} ${user.lastName}`,
                });

                if (res.data?.url) {
                    // Save shipping address in sessionStorage to retrieve on success page
                    sessionStorage.setItem("pending_shipping_address", shippingAddress);
                    window.location.href = res.data.url;
                } else {
                    showToast("Failed to initiate Stripe checkout", "error");
                    setIsProcessing(false);
                }
            } else {
                // COD or other methods
                const res = await CreateOrder({
                    shipping_address: shippingAddress,
                    payment_method: paymentMethod,
                });
                if (res.success) {
                    showToast("Order placed successfully!", "success");
                    setTimeout(() => navigate("/success"), 2000);
                }
            }
        } catch (error: any) {
            showToast(error.message || "Checkout failed", "error");
            setIsProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-secondary flex justify-center items-center">
                <Loader className="animate-spin h-12 w-12 text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-secondary px-6 py-12">
            {toast.show && <Toast type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />}
            <div className="max-w-7xl mx-auto">
                <button onClick={() => navigate("/cart")} className="inline-flex items-center gap-2 text-white/40 hover:text-primary transition-colors font-black uppercase tracking-[0.2em] text-[10px] mb-8">
                    <ArrowLeft size={16} /> Back to Cart
                </button>
                <h1 className="text-5xl font-black text-white mb-12 uppercase tracking-tight">Checkout</h1>

                <div className="grid lg:grid-cols-3 gap-10">
                    <form onSubmit={handlePlaceOrder} className="lg:col-span-2 flex flex-col gap-10">
                        <div className="bg-white/5 p-10 rounded-[45px] border border-white/10">
                            <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3"><Truck className="text-primary" /> Shipping Info</h2>
                            <textarea
                                value={shippingAddress}
                                onChange={(e) => setShippingAddress(e.target.value)}
                                placeholder="Enter your full shipping address..."
                                className="w-full h-32 bg-white/5 text-white border border-white/10 rounded-3xl p-6 focus:outline-none focus:border-primary transition-all text-lg font-medium"
                                required
                            ></textarea>
                        </div>

                        <div className="bg-white/5 p-10 rounded-[45px] border border-white/10">
                            <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3"><CreditCard className="text-primary" /> Payment Method</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {["card", "paypal", "bank_transfer"].map((method) => (
                                    <button
                                        key={method}
                                        type="button"
                                        onClick={() => setPaymentMethod(method)}
                                        className={`p-6 rounded-3xl border transition-all uppercase font-black text-[10px] tracking-widest ${paymentMethod === method ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10"}`}
                                    >
                                        {method.replace("_", " ")}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isProcessing}
                            className="w-full py-6 bg-primary text-white font-black uppercase tracking-[0.4em] text-xs rounded-full hover:scale-105 transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-4 disabled:opacity-50"
                        >
                            {isProcessing ? "Processing..." : "Confirm & Pay Order"} <ShieldCheck size={20} />
                        </button>
                    </form>

                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-white/5 p-10 rounded-[45px] border border-white/10 backdrop-blur-3xl shadow-2xl">
                            <h2 className="text-2xl font-black text-white mb-8 border-b border-white/5 pb-4 uppercase tracking-widest">Order Summary</h2>
                            <div className="flex flex-col gap-4 mb-8 max-h-64 overflow-y-auto pr-2 scrollbar-hide">
                                {cart?.items.map((item: any) => (
                                    <div key={item.product_id._id} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <div>
                                            <h4 className="text-sm font-black text-white truncate w-40">{item.product_id.name}</h4>
                                            <p className="text-[10px] text-white/30 font-bold">Qty: {item.quantity}</p>
                                        </div>
                                        <span className="text-primary font-black">${(item.product_id.discount_price > 0 ? item.product_id.discount_price : item.product_id.price) * item.quantity}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between text-3xl font-black text-white pt-6 border-t border-white/5">
                                <span>Total</span>
                                <span className="text-primary">${cart?.total_price}</span>
                            </div>
                            <div className="mt-10 flex items-center gap-3 text-white/30 text-xs font-bold uppercase tracking-widest text-center justify-center bg-white/5 p-4 rounded-2xl border border-white/5">
                                <ShieldCheck size={16} /> Secure Payment Processing
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCheckout;
