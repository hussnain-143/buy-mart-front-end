import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Truck, ShieldCheck, ArrowLeft, Loader, Lock, Mail, User } from "lucide-react";
import { GetCart } from "../services/cart.service";
import { CreateProductCheckout } from "../services/stripe.service";
import Toast from "../components/common/Toast";

const ProductCheckout = () => {
    const [cart, setCart] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "", type: "info" });
    const [shippingAddress, setShippingAddress] = useState("");
    const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();

    const showToast = (message: string, type: string = "info") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type: "info" }), 3000);
    };

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        setUser(storedUser);

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
            // Initiate Stripe Checkout
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
        } catch (error: any) {
            showToast(error.message || "Checkout failed", "error");
            setIsProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex justify-center items-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader className="animate-spin h-12 w-12 text-primary" />
                    <p className="text-white/40 font-bold uppercase tracking-widest text-xs">Securing Checkout...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f172a] text-white selection:bg-primary/30">
            {toast.show && <Toast type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />}
            
            {/* Background Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-600/10 rounded-full blur-[100px]"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-6 py-12 lg:py-20">
                <button 
                    onClick={() => navigate("/cart")} 
                    className="group inline-flex items-center gap-2 text-white/40 hover:text-white transition-all font-black uppercase tracking-[0.2em] text-[10px] mb-12"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Cart
                </button>

                <div className="grid lg:grid-cols-12 gap-12 items-start">
                    {/* LEFT COLUMN: INFO & ADDRESS */}
                    <div className="lg:col-span-7 space-y-10">
                        <div>
                            <h1 className="text-6xl font-black mb-4 tracking-tighter">
                                CHECKOUT
                            </h1>
                            <p className="text-white/40 text-lg font-medium max-w-md">
                                Secure your order with our encrypted payment gateway.
                            </p>
                        </div>

                        {/* User Summary Card */}
                        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[40px] p-8 flex flex-col md:flex-row gap-8">
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center gap-3 text-white/40 uppercase font-black text-[10px] tracking-widest">
                                    <User size={14} className="text-primary" /> Customer Info
                                </div>
                                <p className="text-2xl font-bold">{user?.firstName} {user?.lastName}</p>
                            </div>
                            <div className="flex-1 space-y-4 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-white/10 md:pl-8">
                                <div className="flex items-center gap-3 text-white/40 uppercase font-black text-[10px] tracking-widest">
                                    <Mail size={14} className="text-primary" /> Contact Email
                                </div>
                                <p className="text-xl font-bold truncate">{user?.email}</p>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[40px] p-10 space-y-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-black flex items-center gap-3 italic">
                                    <Truck className="text-primary" /> 01. SHIPPING ADDRESS
                                </h2>
                            </div>
                            <div className="relative group">
                                <textarea
                                    value={shippingAddress}
                                    onChange={(e) => setShippingAddress(e.target.value)}
                                    placeholder="Enter your complete delivery address here..."
                                    className="w-full h-40 bg-white/5 text-white border border-white/10 rounded-[30px] p-8 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-lg font-medium placeholder:text-white/10"
                                    required
                                ></textarea>
                                <div className="absolute right-6 bottom-6 text-[10px] font-black text-white/20 uppercase tracking-widest pointer-events-none group-focus-within:text-primary/40 transition-colors">
                                    Required
                                </div>
                            </div>
                        </div>

                        {/* Payment Info Banner */}
                        <div className="bg-primary/10 border border-primary/20 rounded-[40px] p-8 flex items-center gap-6">
                            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                                <ShieldCheck size={32} className="text-white" />
                            </div>
                            <div>
                                <h4 className="text-xl font-black italic">STRIPE SECURED</h4>
                                <p className="text-white/50 text-sm font-medium">Your payment is processed through Stripe's high-security infrastructure.</p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: SUMMARY */}
                    <div className="lg:col-span-5 lg:sticky lg:top-12">
                        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[50px] p-10 shadow-2xl overflow-hidden relative">
                            {/* Decorative Edge */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

                            <h2 className="text-3xl font-black mb-10 border-b border-white/10 pb-6 italic tracking-tight uppercase">
                                SUMMARY
                            </h2>

                            {/* Item List */}
                            <div className="space-y-4 mb-10 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {cart?.items.map((item: any) => (
                                    <div key={item.product_id._id} className="flex gap-4 p-4 rounded-[25px] bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-colors group">
                                        <div className="w-16 h-16 rounded-2xl bg-white/5 overflow-hidden flex-shrink-0 border border-white/10">
                                            {item.product_id.images_id?.[0]?.image_url ? (
                                                <img src={item.product_id.images_id[0].image_url} alt={item.product_id.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-white/10 font-black">?</div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <h4 className="font-bold text-white truncate text-base">{item.product_id.name}</h4>
                                            <div className="flex justify-between items-center mt-1">
                                                <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Qty: {item.quantity}</span>
                                                <span className="text-primary font-black text-sm">${((item.product_id.discount_price > 0 ? item.product_id.discount_price : item.product_id.price) * item.quantity).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="space-y-4 pt-6 border-t border-white/10">
                                <div className="flex justify-between text-white/40 font-bold uppercase tracking-widest text-xs">
                                    <span>Subtotal</span>
                                    <span>${cart?.total_price.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-white/40 font-bold uppercase tracking-widest text-xs">
                                    <span>Shipping</span>
                                    <span className="text-green-400 font-black">FREE</span>
                                </div>
                                <div className="flex justify-between items-end pt-4">
                                    <span className="text-2xl font-black italic tracking-tighter">TOTAL</span>
                                    <span className="text-5xl font-black text-primary tracking-tighter tabular-nums">${cart?.total_price.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* CTA */}
                            <button
                                onClick={handlePlaceOrder}
                                disabled={isProcessing}
                                className="w-full mt-10 py-7 bg-primary text-white font-black uppercase tracking-[0.4em] text-xs rounded-[30px] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-primary/40 flex items-center justify-center gap-4 disabled:opacity-50 disabled:hover:scale-100 overflow-hidden relative group"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                                <span className="relative flex items-center gap-4">
                                    {isProcessing ? "SECURELY PROCESSING..." : "PAY WITH STRIPE"} 
                                    {isProcessing ? <Loader className="animate-spin" size={18} /> : <Lock size={18} />}
                                </span>
                            </button>

                            <p className="text-center mt-6 text-white/20 text-[10px] uppercase font-black tracking-widest flex items-center justify-center gap-2">
                                <ShieldCheck size={12} /> Encrypted Zero-Knowledge Payment
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCheckout;
