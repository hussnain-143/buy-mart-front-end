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
                showToast("Gateway error.", "error");
            }
        } catch (error: any) {
            showToast(error.message || "Execution error.", "error");
        } finally {
            setLoading(false);
        }
    };

    if (!cart || cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-secondary flex flex-col justify-center items-center text-white p-6">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                    <Lock size={24} className="text-white/20" />
                </div>
                <h2 className="text-2xl font-bold uppercase tracking-tight mb-4 text-center">Checkout Restricted</h2>
                <p className="text-white/30 mb-8 font-medium">Please add items to your cart before proceeding.</p>
                <button onClick={() => navigate("/cart")} className="px-8 py-3 bg-primary text-secondary font-black uppercase tracking-widest text-[10px] rounded-full hover:scale-105 transition-all">
                    Return to Cart
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-secondary text-white py-20 px-6 md:px-12 lg:px-24">
            {toast.show && <Toast type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />}
            
            <div className="max-w-6xl mx-auto animate-fade-in-up">
                <header className="mb-16 border-b border-white/5 pb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-2 leading-none uppercase">
                            Check<span className="text-primary italic">out.</span>
                        </h1>
                        <p className="text-white/30 font-bold uppercase tracking-widest text-[10px]">Security: 256-bit AES Encryption</p>
                    </div>
                    <button type="button" onClick={() => navigate("/cart")} className="flex items-center gap-3 text-white/40 hover:text-white transition-all font-bold uppercase tracking-widest text-[10px] pb-2">
                        <ChevronLeft size={14} /> Back to Library
                    </button>
                </header>

                <form onSubmit={handleCheckout} className="grid lg:grid-cols-12 gap-12 items-start">
                    <div className="lg:col-span-7 space-y-10 bg-[#1E1E1E]/40 backdrop-blur-xl p-10 rounded-3xl border border-white/5 shadow-xl">
                        <section className="space-y-6">
                            <h3 className="text-[11px] font-black uppercase tracking-widest text-primary border-b border-white/5 pb-2">Identity</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold uppercase tracking-widest text-white/20 ml-2">First Name</label>
                                    <input required type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First" className="w-full bg-white/5 border border-white/5 rounded-xl px-6 py-4 text-white placeholder-white/5 focus:outline-none focus:border-primary transition-all text-sm" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold uppercase tracking-widest text-white/20 ml-2">Last Name</label>
                                    <input required type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last" className="w-full bg-white/5 border border-white/5 rounded-xl px-6 py-4 text-white placeholder-white/5 focus:outline-none focus:border-primary transition-all text-sm" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold uppercase tracking-widest text-white/20 ml-2">Primary Email</label>
                                <input required type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="email@address.com" className="w-full bg-white/5 border border-white/5 rounded-xl px-6 py-4 text-white placeholder-white/5 focus:outline-none focus:border-primary transition-all text-sm" />
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h3 className="text-[11px] font-black uppercase tracking-widest text-primary border-b border-white/5 pb-2">Location</h3>
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold uppercase tracking-widest text-white/20 ml-2">Physical Address</label>
                                <input required type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="St. Address 101" className="w-full bg-white/5 border border-white/5 rounded-xl px-6 py-4 text-white placeholder-white/5 focus:outline-none focus:border-primary transition-all text-sm" />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold uppercase tracking-widest text-white/20 ml-2">City</label>
                                    <input required type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="Metropolis" className="w-full bg-white/5 border border-white/5 rounded-xl px-6 py-4 text-white placeholder-white/5 focus:outline-none focus:border-primary transition-all text-sm" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold uppercase tracking-widest text-white/20 ml-2">Postal System</label>
                                    <input required type="text" name="zip" value={formData.zip} onChange={handleInputChange} placeholder="00000" className="w-full bg-white/5 border border-white/5 rounded-xl px-6 py-4 text-white placeholder-white/5 focus:outline-none focus:border-primary transition-all text-sm" />
                                </div>
                            </div>
                        </section>

                        <div className="flex items-center gap-4 text-white/10 font-bold uppercase tracking-widest text-[8px] pt-4">
                            <ShieldCheck size={14} /> End-to-End Cryptography Enabled
                        </div>
                    </div>

                    <aside className="lg:col-span-5 lg:sticky lg:top-24">
                        <div className="bg-[#1E1E1E]/60 backdrop-blur-2xl p-10 rounded-[32px] border border-white/5 shadow-2xl">
                            <h2 className="text-xl font-bold text-white mb-8 uppercase tracking-widest border-b border-white/5 pb-4">Verification</h2>
                            
                            <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                                {cart.items.map((item: any) => (
                                    <div key={item.product_id._id} className="flex justify-between items-center bg-white/[0.02] p-4 rounded-xl border border-white/5">
                                        <div className="space-y-0.5">
                                            <p className="text-[10px] font-bold uppercase tracking-wide text-white/60 truncate max-w-[140px]">{item.product_id.name}</p>
                                            <p className="text-[8px] text-white/20 font-bold uppercase tracking-widest">Qty {item.quantity}</p>
                                        </div>
                                        <p className="text-base font-black tabular-nums font-montserrat tracking-tight">${((item.total_price || (item.product_id?.price * item.quantity)) || 0).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-6 mb-10 pt-4">
                                <div className="flex justify-between items-center text-white/30 text-[10px] font-bold uppercase tracking-widest">
                                    <span>Subtotal</span>
                                    <span className="text-white tabular-nums">${(cart.total_price || 0).toFixed(2)}</span>
                                </div>
                                <div className="h-px w-full bg-white/5"></div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/20 block">Final Settlement</span>
                                    <span className="text-5xl font-black text-primary tabular-nums tracking-tighter font-montserrat leading-none">
                                        ${(cart.total_price || 0).toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-6 bg-primary text-secondary font-black uppercase tracking-[0.3em] text-[12px] rounded-full hover:brightness-110 transition-all shadow-lg flex items-center justify-center gap-4 disabled:opacity-30 group"
                            >
                                {loading ? <div className="w-5 h-5 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin"></div> : (
                                    <>
                                        Confirm Selection
                                        <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-300" />
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
