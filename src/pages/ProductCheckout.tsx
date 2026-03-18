import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { CreateProductCheckout } from "../services/stripe.service";
import { useNavigate } from "react-router-dom";
import { Lock, ArrowRight, ShieldCheck, ChevronLeft } from "lucide-react";
import Toast from "../components/common/Toast";

const ProductCheckout = () => {
    const { cart, fetchCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "", type: "info" });
    const [formData, setFormData] = useState({
        email: "",
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        zip: "",
    });

    useEffect(() => {
        fetchCart();
    }, []);

    const showToast = (message: string, type: string = "info") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type: "info" }), 3000);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!cart || cart.items.length === 0) return;

        setLoading(true);
        try {
            const res = await CreateProductCheckout({
                items: cart.items,
                shipping_address: `${formData.address}, ${formData.city}, ${formData.zip}`,
                customer_email: formData.email,
                type: "product"
            });

            if (res.success && res.data.url) {
                window.location.href = res.data.url;
            } else {
                showToast("Connection to gateway failed.", "error");
            }
        } catch (error: any) {
            showToast(error.message || "Protocol error during initiation.", "error");
        } finally {
            setLoading(false);
        }
    };

    if (!cart || cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-black flex flex-col justify-center items-center text-white p-6">
                <Lock size={40} className="mb-8 text-white/10" />
                <h2 className="text-3xl font-bold uppercase tracking-widest mb-4">Unauthorised</h2>
                <p className="text-white/30 mb-10 font-medium">Please populate your cart before accessing checkout.</p>
                <button onClick={() => navigate("/cart")} className="px-12 py-4 border border-white/20 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-white hover:text-black transition-all">
                    Return to Cart
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white py-24 px-6 md:px-12 lg:px-24">
            {toast.show && <Toast type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />}
            
            <div className="max-w-7xl mx-auto">
                <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/10 pb-12">
                    <div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4">Direct.</h1>
                        <p className="text-white/40 font-bold uppercase tracking-[0.3em] text-[11px]">Secure Disbursement Interface</p>
                    </div>
                </header>

                <form onSubmit={handleCheckout} className="grid lg:grid-cols-12 gap-20 items-start">
                    <div className="lg:col-span-7 space-y-16">
                        <section className="space-y-10">
                            <h3 className="text-xl font-bold uppercase tracking-[0.4em] text-white/20">01. Recipient Details</h3>
                            <div className="grid md:grid-cols-2 gap-10">
                                <div className="space-y-4 border-l border-white/10 pl-6 focus-within:border-white transition-colors">
                                    <label className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/30">First Name</label>
                                    <input required type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="Required" className="w-full bg-transparent text-white placeholder-white/5 focus:outline-none font-bold uppercase tracking-widest text-xs" />
                                </div>
                                <div className="space-y-4 border-l border-white/10 pl-6 focus-within:border-white transition-colors">
                                    <label className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/30">Last Name</label>
                                    <input required type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Required" className="w-full bg-transparent text-white placeholder-white/5 focus:outline-none font-bold uppercase tracking-widest text-xs" />
                                </div>
                            </div>
                            <div className="space-y-4 border-l border-white/10 pl-6 focus-within:border-white transition-colors">
                                <label className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/30">Email Identity</label>
                                <input required type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Required" className="w-full bg-transparent text-white placeholder-white/5 focus:outline-none font-bold uppercase tracking-widest text-xs" />
                            </div>
                        </section>

                        <section className="space-y-10">
                            <h3 className="text-xl font-bold uppercase tracking-[0.4em] text-white/20">02. Destination</h3>
                            <div className="space-y-4 border-l border-white/10 pl-6 focus-within:border-white transition-colors">
                                <label className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/30">Physical Address</label>
                                <input required type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Required" className="w-full bg-transparent text-white placeholder-white/5 focus:outline-none font-bold uppercase tracking-widest text-xs" />
                            </div>
                            <div className="grid md:grid-cols-2 gap-10">
                                <div className="space-y-4 border-l border-white/10 pl-6 focus-within:border-white transition-colors">
                                    <label className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/30">City</label>
                                    <input required type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="Required" className="w-full bg-transparent text-white placeholder-white/5 focus:outline-none font-bold uppercase tracking-widest text-xs" />
                                </div>
                                <div className="space-y-4 border-l border-white/10 pl-6 focus-within:border-white transition-colors">
                                    <label className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/30">Postal System</label>
                                    <input required type="text" name="zip" value={formData.zip} onChange={handleInputChange} placeholder="Required" className="w-full bg-transparent text-white placeholder-white/5 focus:outline-none font-bold uppercase tracking-widest text-xs" />
                                </div>
                            </div>
                        </section>

                        <div className="flex items-center justify-between pt-10">
                             <button type="button" onClick={() => navigate("/cart")} className="flex items-center gap-3 text-white/30 hover:text-white transition-all font-bold uppercase tracking-widest text-[10px]">
                                <ChevronLeft size={14} /> Back to Collection
                             </button>
                             <div className="flex items-center gap-3 text-white/10 font-bold uppercase tracking-widest text-[9px]">
                                <ShieldCheck size={14} /> 256-Bit SSL Secured
                             </div>
                        </div>
                    </div>

                    <aside className="lg:col-span-5 lg:sticky lg:top-24">
                        <div className="border border-white/10 p-12 bg-white/[0.01]">
                            <h2 className="text-xl font-bold uppercase tracking-widest mb-10 pb-6 border-b border-white/5">Summary.</h2>
                            
                            <div className="space-y-6 mb-12 max-h-[300px] overflow-y-auto pr-2">
                                {cart.items.map((item: any) => (
                                    <div key={item.product_id._id} className="flex justify-between items-end pb-6 border-b border-white/[0.03]">
                                        <div className="space-y-1">
                                            <p className="text-[11px] font-bold uppercase tracking-widest text-white/60 truncate max-w-[150px]">{item.product_id.name}</p>
                                            <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest">Quantity: {item.quantity}</p>
                                        </div>
                                        {/* Added null-safety check (item.total_price || 0) to fix the runtime crash */}
                                        <p className="text-lg font-bold tracking-tighter tabular-nums">${(item.total_price || 0).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-6 mb-12 pt-6 border-t border-white/10">
                                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-white/30">
                                    <span>Subtotal</span>
                                    <span className="text-white tabular-nums">${(cart.total_price || 0).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-white/30">Final Due</span>
                                    <span className="text-5xl font-black tracking-tighter tabular-nums text-white">${(cart.total_price || 0).toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-8 bg-white text-black font-bold uppercase tracking-[0.4em] text-[12px] hover:bg-white/90 transition-all flex items-center justify-center gap-6 disabled:opacity-30"
                            >
                                {loading ? <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div> : "Dispatch Payment"}
                            </button>
                        </div>
                    </aside>
                </form>
            </div>
        </div>
    );
};

export default ProductCheckout;
