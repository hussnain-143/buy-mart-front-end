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
                showToast("Gateway connection error.", "error");
            }
        } catch (error: any) {
            showToast(error.message || "Checkout failed.", "error");
        } finally {
            setLoading(false);
        }
    };

    if (!cart || cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-secondary flex flex-col justify-center items-center text-white p-6">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-8 border border-white/10">
                    <Lock size={32} className="text-white/20" />
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tight mb-4">Unauthorized Access</h2>
                <p className="text-white/40 mb-10 font-medium">Please populate your cart to proceed.</p>
                <button onClick={() => navigate("/cart")} className="px-10 py-4 bg-primary text-secondary font-black uppercase tracking-[0.2em] text-[11px] rounded-full hover:scale-105 transition-all">
                    Return to Cart
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-secondary text-white py-24 px-6 md:px-12 lg:px-24">
            {toast.show && <Toast type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />}
            
            <div className="max-w-7xl mx-auto animate-fade-in-up">
                <header className="mb-20">
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 leading-none">
                        Check<span className="text-primary italic">out.</span>
                    </h1>
                    <div className="flex items-center gap-4">
                        <div className="h-px w-10 bg-primary"></div>
                        <p className="text-white/40 font-black uppercase tracking-[0.5em] text-[11px]">Secure Settlement Layer</p>
                    </div>
                </header>

                <form onSubmit={handleCheckout} className="grid lg:grid-cols-12 gap-16 items-start">
                    <div className="lg:col-span-7 space-y-12 bg-[#1E1E1E]/40 backdrop-blur-xl p-12 rounded-[50px] border border-white/5">
                        <section className="space-y-8">
                            <h3 className="text-[12px] font-black uppercase tracking-[0.6em] text-primary">01. Identity</h3>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">First Name</label>
                                    <input required type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="Alex" className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white placeholder-white/5 focus:outline-none focus:border-primary transition-all font-bold tracking-wide" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Last Name</label>
                                    <input required type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Volkov" className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white placeholder-white/5 focus:outline-none focus:border-primary transition-all font-bold tracking-wide" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Email Address</label>
                                <input required type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="alex@premium.com" className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white placeholder-white/5 focus:outline-none focus:border-primary transition-all font-bold tracking-wide" />
                            </div>
                        </section>

                        <section className="space-y-8">
                            <h3 className="text-[12px] font-black uppercase tracking-[0.6em] text-primary">02. Destination</h3>
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Physical Address</label>
                                <input required type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="St. Avenue 42" className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white placeholder-white/5 focus:outline-none focus:border-primary transition-all font-bold tracking-wide" />
                            </div>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">City</label>
                                    <input required type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="Metropolis" className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white placeholder-white/5 focus:outline-none focus:border-primary transition-all font-bold tracking-wide" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4">Postal Code</label>
                                    <input required type="text" name="zip" value={formData.zip} onChange={handleInputChange} placeholder="000000" className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white placeholder-white/5 focus:outline-none focus:border-primary transition-all font-bold tracking-wide" />
                                </div>
                            </div>
                        </section>

                        <div className="flex items-center justify-between pt-8 border-t border-white/5">
                             <button type="button" onClick={() => navigate("/cart")} className="flex items-center gap-3 text-white/30 hover:text-white transition-all font-black uppercase tracking-widest text-[10px]">
                                <ChevronLeft size={16} /> Back to Vault
                             </button>
                             <div className="flex items-center gap-3 text-white/10 font-bold uppercase tracking-widest text-[9px]">
                                <ShieldCheck size={16} /> Encrypted Transmission
                             </div>
                        </div>
                    </div>

                    <aside className="lg:col-span-5 lg:sticky lg:top-32">
                        <div className="bg-[#1E1E1E]/60 backdrop-blur-2xl p-16 rounded-[50px] border border-white/10 shadow-3xl">
                            <h2 className="text-3xl font-black text-white mb-10 pb-6 border-b border-white/5 uppercase tracking-tight italic text-primary">Order Summary</h2>
                            
                            <div className="space-y-8 mb-12 max-h-[350px] overflow-y-auto pr-4 scrollbar-hide">
                                {cart.items.map((item: any) => (
                                    <div key={item.product_id._id} className="flex justify-between items-center bg-white/5 p-6 rounded-3xl border border-white/5">
                                        <div className="space-y-1">
                                            <p className="text-[11px] font-black uppercase tracking-widest text-white/70 truncate max-w-[160px]">{item.product_id.name}</p>
                                            <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="text-xl font-black tracking-tighter tabular-nums font-montserrat">${(item.total_price || 0).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-6 mb-12 pt-6 border-t border-white/5">
                                <div className="flex justify-between items-center text-white/30 text-[11px] font-black uppercase tracking-widest">
                                    <span>Subtotal</span>
                                    <span className="text-white tabular-nums">${(cart.total_price || 0).toFixed(2)}</span>
                                </div>
                                <div className="h-px w-full bg-white/5"></div>
                                <div className="flex flex-col gap-2">
                                    <span className="text-[11px] font-black uppercase tracking-[0.6em] text-white/20">Final Amount</span>
                                    <span className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent tabular-nums leading-none font-montserrat tracking-tighter">
                                        ${(cart.total_price || 0).toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-8 bg-primary text-secondary font-black uppercase tracking-[0.5em] text-[13px] rounded-full hover:scale-105 transition-all duration-700 shadow-3xl flex items-center justify-center gap-6 disabled:opacity-30 group shadow-primary/20"
                            >
                                {loading ? <div className="w-5 h-5 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin"></div> : (
                                    <>
                                        Authorize Payment
                                        <ArrowRight size={22} className="group-hover:translate-x-3 transition-transform duration-700" />
                                    </>
                                )}
                            </button>
                        </div>
                    </aside>
                </form>
            </div>
        </div>
    );
};

export default ProductCheckout;
