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
            <div className="min-h-screen bg-[#0f172a] flex justify-center items-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader className="animate-spin h-10 w-10 text-primary" />
                    <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Securing Checkout...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f172a] text-white selection:bg-primary/30 py-20 px-6 relative overflow-hidden">
            {toast.show && <Toast type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />}
            
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-600/5 rounded-full blur-[100px]"></div>
            </div>

            <div className="relative max-w-7xl mx-auto">
                <button 
                    onClick={() => navigate("/cart")} 
                    className="group inline-flex items-center gap-3 text-white/30 hover:text-white transition-all font-black uppercase tracking-[0.2em] text-[9px] mb-12 bg-white/5 px-6 py-3 rounded-full border border-white/5"
                >
                    <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform text-primary" /> Return to Terminal
                </button>

                <div className="grid lg:grid-cols-12 gap-12 items-start animate-fade-in-up">
                    <div className="lg:col-span-7 space-y-10">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-1 bg-primary rounded-full"></div>
                                <span className="text-white/20 font-black text-[9px] uppercase tracking-[0.4em]">Secure Transaction Node</span>
                            </div>
                            <h1 className="text-7xl font-black mb-4 tracking-tighter italic uppercase leading-none">
                                Checkout
                            </h1>
                            <p className="text-white/40 text-lg font-medium max-w-lg leading-relaxed">
                                Authorizing secure payload transfer via Stripe gateway.
                            </p>
                        </div>

                        <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[40px] p-8 flex flex-col md:flex-row gap-8 shadow-2xl">
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-2 text-white/20 uppercase font-black text-[9px] tracking-[0.2em]">
                                    <User size={12} className="text-primary" /> Recipient
                                </div>
                                <p className="text-2xl font-black tracking-tight italic">{user?.firstName} {user?.lastName}</p>
                            </div>
                            <div className="flex-1 space-y-3 pt-6 md:pt-0 border-t md:border-t-0 md:border-l border-white/5 md:pl-8">
                                <div className="flex items-center gap-2 text-white/20 uppercase font-black text-[9px] tracking-[0.2em]">
                                    <Mail size={12} className="text-primary" /> Email Comms
                                </div>
                                <p className="text-lg font-bold text-white/70 truncate">{user?.email}</p>
                            </div>
                        </div>

                        <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[48px] p-10 space-y-8 shadow-2xl">
                            <h2 className="text-2xl font-black flex items-center gap-4 italic tracking-tight uppercase">
                                <Truck className="text-primary" size={24} /> 01. Destination
                            </h2>
                            <div className="relative group">
                                <textarea
                                    value={shippingAddress}
                                    onChange={(e) => setShippingAddress(e.target.value)}
                                    placeholder="Enter physical address coordinates..."
                                    className="w-full h-40 bg-white/[0.03] text-white border border-white/10 rounded-[32px] p-8 focus:outline-none focus:border-primary/40 focus:ring-8 focus:ring-primary/5 transition-all text-lg font-medium placeholder:text-white/5"
                                    required
                                ></textarea>
                            </div>
                        </div>

                        <div className="bg-primary/5 border border-primary/10 rounded-[40px] p-8 flex items-center gap-6 shadow-2xl">
                            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-xl shadow-primary/20">
                                <ShieldCheck size={32} className="text-white" />
                            </div>
                            <div>
                                <h4 className="text-xl font-black italic tracking-tight uppercase">Stripe Infrastructure Secured</h4>
                                <p className="text-white/30 text-sm font-medium mt-1">End-to-end encrypted protocol active.</p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5 lg:sticky lg:top-12">
                        <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[48px] p-10 shadow-2xl overflow-hidden relative border-t-primary/20">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-[80px] -mr-24 -mt-24"></div>

                            <h2 className="text-3xl font-black mb-10 border-b border-white/5 pb-6 italic tracking-tighter uppercase">
                                Payload
                            </h2>

                            <div className="space-y-4 mb-10 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                                {cart?.items.map((item: any) => (
                                    <div key={item.product_id._id} className="flex gap-4 p-4 rounded-[28px] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group">
                                        <div className="w-20 h-20 rounded-[20px] bg-black/40 overflow-hidden flex-shrink-0 border border-white/5 p-1.5">
                                            {item.product_id.images_id?.[0]?.image_url ? (
                                                <img src={item.product_id.images_id[0].image_url} alt={item.product_id.name} className="w-full h-full object-cover rounded-[14px] group-hover:scale-110 transition-transform duration-700" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-white/5 font-black text-xl">?</div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <h4 className="font-black text-white truncate text-base tracking-tight italic uppercase">{item.product_id.name}</h4>
                                            <div className="flex justify-between items-center mt-2">
                                                <span className="bg-white/5 px-3 py-1 rounded-full text-white/40 text-[8px] font-black uppercase tracking-[0.1em]">Qty: {item.quantity}</span>
                                                <span className="text-primary font-black text-lg tracking-tighter">${((item.product_id.discount_price > 0 ? item.product_id.discount_price : item.product_id.price) * item.quantity).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 pt-8 border-t border-white/5">
                                <div className="flex justify-between text-white/20 font-black uppercase tracking-[0.2em] text-[8px]">
                                    <span>Subtotal</span>
                                    <span className="text-white/60 tracking-tighter text-sm">${cart?.total_price.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-white/20 font-black uppercase tracking-[0.2em] text-[8px]">
                                    <span>Logistics</span>
                                    <span className="text-green-400 tracking-tighter text-sm">FREE</span>
                                </div>
                                <div className="flex justify-between items-end pt-4">
                                    <span className="text-2xl font-black italic tracking-tighter uppercase leading-none">Total</span>
                                    <span className="text-6xl font-black text-primary tracking-tighter tabular-nums shadow-primary/20 drop-shadow-2xl leading-none italic">${cart?.total_price.toFixed(2)}</span>
                                </div>
                            </div>

                            <form onSubmit={handlePlaceOrder}>
                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className="w-full mt-10 py-8 bg-primary text-white font-black uppercase tracking-[0.4em] text-[11px] rounded-[32px] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-primary/50 flex items-center justify-center gap-4 disabled:opacity-50 overflow-hidden relative group"
                                >
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                                    <span className="relative flex items-center gap-4">
                                        {isProcessing ? "INITIALIZING..." : "CONFIRM SETTLEMENT"} 
                                        {isProcessing ? <Loader className="animate-spin" size={18} /> : <Lock size={18} />}
                                    </span>
                                </button>
                            </form>

                            <p className="text-center mt-6 text-white/10 text-[8px] uppercase font-black tracking-[0.3em] flex items-center justify-center gap-2">
                                <ShieldCheck size={12} className="text-primary/40" /> SECURE QUANTUM SHIELD ACTIVE
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCheckout;
