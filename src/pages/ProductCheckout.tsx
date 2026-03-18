import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Truck, ShieldCheck, ArrowLeft, Lock, Mail, User } from "lucide-react";
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
            const res = await CreateProductCheckout({
                items: cart.items,
                shippingAddress,
                email: user.email,
                fullName: `${user.firstName} ${user.lastName}`,
            });

            if (res.data?.url) {
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
            <div className="min-h-screen bg-secondary flex justify-center items-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    <p className="text-white/40 font-black uppercase tracking-widest text-[10px]">Securing Session...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-secondary text-white selection:bg-primary/30 py-24 px-6 relative overflow-hidden">
            {toast.show && <Toast type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />}
            
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[150px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="relative max-w-7xl mx-auto">
                <button 
                    onClick={() => navigate("/cart")} 
                    className="group inline-flex items-center gap-4 text-white/40 hover:text-white transition-all font-black uppercase tracking-[0.3em] text-[10px] mb-16 bg-white/5 px-8 py-4 rounded-full border border-white/10 hover:border-white/20"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform text-primary" /> Back to Cart
                </button>

                <div className="grid lg:grid-cols-12 gap-12 items-start animate-fade-in-up">
                    <div className="lg:col-span-7 space-y-10">
                        <div>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-px w-12 bg-primary"></div>
                                <span className="text-white/40 font-black text-[10px] uppercase tracking-[0.5em]">Secure Checkout</span>
                            </div>
                            <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight uppercase leading-none">
                                Review & <span className="text-primary italic">Pay</span>
                            </h1>
                            <p className="text-white/40 text-lg font-medium max-w-lg leading-relaxed">
                                Complete your acquisition with our secure encrypted payment gateway.
                            </p>
                        </div>

                        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[40px] p-10 flex flex-col md:flex-row gap-10 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center gap-3 text-white/30 uppercase font-black text-[10px] tracking-[0.3em]">
                                    <User size={14} className="text-primary" /> Recipient
                                </div>
                                <p className="text-3xl font-black tracking-tight">{user?.firstName} {user?.lastName}</p>
                            </div>
                            <div className="flex-1 space-y-4 pt-8 md:pt-0 md:border-l border-white/10 md:pl-10">
                                <div className="flex items-center gap-3 text-white/30 uppercase font-black text-[10px] tracking-[0.3em]">
                                    <Mail size={14} className="text-primary" /> Contact Email
                                </div>
                                <p className="text-xl font-bold text-white/60 truncate italic">{user?.email}</p>
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[50px] p-12 space-y-10 shadow-2xl transition-all hover:bg-white/10 group">
                            <h2 className="text-2xl font-black flex items-center gap-5 tracking-tight uppercase">
                                <Truck className="text-primary group-hover:scale-110 transition-transform" size={28} /> 01. Delivery Destination
                            </h2>
                            <div className="relative">
                                <textarea
                                    value={shippingAddress}
                                    onChange={(e) => setShippingAddress(e.target.value)}
                                    placeholder="Enter complete shipping address..."
                                    className="w-full h-44 bg-white/5 text-white border border-white/10 rounded-[35px] p-10 focus:outline-none focus:border-primary/40 focus:ring-8 focus:ring-primary/5 transition-all text-xl font-medium placeholder:text-white/10 shadow-inner"
                                    required
                                ></textarea>
                            </div>
                        </div>

                        <div className="bg-primary/5 border border-primary/10 rounded-[40px] p-10 flex items-center gap-8 shadow-2xl">
                            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-2xl shadow-primary/40">
                                <ShieldCheck size={40} className="text-secondary" />
                            </div>
                            <div>
                                <h4 className="text-2xl font-black tracking-tight uppercase">Encryption Active</h4>
                                <p className="text-white/30 text-base font-medium mt-2 italic">Your transaction is protected by military-grade SSL standards.</p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5 lg:sticky lg:top-12">
                        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[50px] p-12 shadow-2xl overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>

                            <h2 className="text-4xl font-black mb-12 border-b border-white/10 pb-8 tracking-tight uppercase">
                                Summary
                            </h2>

                            <div className="space-y-6 mb-12 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                                {cart?.items.map((item: any) => (
                                    <div key={item.product_id._id} className="flex gap-6 p-6 rounded-[35px] bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-500 group shadow-lg">
                                        <div className="w-24 h-24 rounded-[25px] bg-white/5 overflow-hidden flex-shrink-0 border border-white/10 p-2 shadow-inner">
                                            {item.product_id.images_id?.[0]?.image_url ? (
                                                <img src={item.product_id.images_id[0].image_url} alt={item.product_id.name} className="w-full h-full object-cover rounded-[18px] group-hover:scale-110 transition-transform duration-700" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-white/5 font-black text-2xl">?</div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-center gap-2">
                                            <h4 className="font-black text-white truncate text-lg tracking-tight uppercase group-hover:text-primary transition-colors">{item.product_id.name}</h4>
                                            <div className="flex justify-between items-center">
                                                <span className="bg-white/10 px-4 py-1.5 rounded-full text-white/40 text-[9px] font-black uppercase tracking-[0.2em]">Qty: {item.quantity}</span>
                                                <span className="text-primary font-black text-2xl tracking-tighter tabular-nums">${((item.product_id.discount_price > 0 ? item.product_id.discount_price : item.product_id.price) * item.quantity).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-6 pt-10 border-t border-white/10">
                                <div className="flex justify-between text-white/40 font-black uppercase tracking-[0.4em] text-[10px]">
                                    <span>Subtotal</span>
                                    <span className="text-white tracking-tighter text-xl">${cart?.total_price.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-white/40 font-black uppercase tracking-[0.4em] text-[10px]">
                                    <span>Shipping</span>
                                    <span className="text-accent tracking-widest text-sm font-black italic">FREE</span>
                                </div>
                                <div className="flex justify-between items-end pt-10">
                                    <span className="text-3xl font-black tracking-tight uppercase leading-none">Total Due</span>
                                    <span className="text-7xl font-black text-primary tracking-tighter tabular-nums drop-shadow-[0_0_40px_rgba(255,111,0,0.3)] leading-none">${cart?.total_price.toFixed(2)}</span>
                                </div>
                            </div>

                            <form onSubmit={handlePlaceOrder}>
                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className="w-full mt-12 py-9 bg-primary text-secondary font-black uppercase tracking-[0.5em] text-[13px] rounded-[35px] hover:scale-[1.03] active:scale-95 transition-all duration-500 shadow-2xl shadow-primary/40 flex items-center justify-center gap-5 disabled:opacity-50 overflow-hidden relative group"
                                >
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>
                                    <span className="relative flex items-center gap-5">
                                        {isProcessing ? "INITIALIZING SECURE GATEWAY..." : "CONFIRM & PAY"} 
                                        {isProcessing ? <div className="w-5 h-5 border-2 border-secondary/30 border-t-secondary animate-spin rounded-full"></div> : <Lock size={22} />}
                                    </span>
                                </button>
                            </form>

                            <p className="text-center mt-8 text-white/20 text-[10px] uppercase font-black tracking-[0.4em] flex items-center justify-center gap-3">
                                <ShieldCheck size={14} className="text-primary/50" /> Secure Payment Protocol Active
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCheckout;
