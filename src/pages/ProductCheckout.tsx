import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { CreateProductCheckout } from "../services/stripe.service";
import { useNavigate } from "react-router-dom";
import { Lock, ArrowRight, ShieldCheck, CreditCard, ChevronLeft } from "lucide-react";
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
                showToast("Failed to initialize payment gateway", "error");
            }
        } catch (error: any) {
            showToast(error.message || "Payment initiation failed", "error");
        } finally {
            setLoading(false);
        }
    };

    if (!cart || cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-[#080808] flex flex-col justify-center items-center text-white p-6">
                <div className="w-20 h-20 rounded-full border border-white/5 bg-white/[0.02] flex items-center justify-center mb-8">
                   <Lock size={32} className="text-white/20" />
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Secure Area Restricted</h2>
                <p className="text-white/30 mb-10 font-medium">Your vault is empty. Please select items first.</p>
                <button onClick={() => navigate("/cart")} className="px-10 py-4 bg-white text-black font-black uppercase tracking-[0.3em] text-[10px] rounded-full hover:bg-primary hover:text-white transition-all">
                    Return to Vault
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#080808] text-white py-24 px-6 flex flex-col items-center relative overflow-hidden">
            {toast.show && <Toast type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />}
            
            {/* Background Atmosphere */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[180px]"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[150px]"></div>
            </div>

            <div className="max-w-5xl w-full relative z-10 flex flex-col gap-16 animate-page-in">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="flex flex-col gap-4 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                           <span className="text-primary font-black uppercase tracking-[0.5em] text-[10px]">Secure Settlement</span>
                           <div className="h-px w-12 bg-white/10"></div>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                            Identity & <span className="text-primary italic">Detail</span>
                        </h1>
                    </div>
                    
                    <div className="flex flex-col items-center md:items-end gap-2">
                        <div className="flex gap-1 h-1 mb-2">
                             <div className="w-12 bg-primary rounded-full"></div>
                             <div className="w-12 bg-white/10 rounded-full"></div>
                             <div className="w-12 bg-white/10 rounded-full"></div>
                        </div>
                        <span className="text-white/20 font-black uppercase tracking-[0.4em] text-[9px]">Module 01 / Shipping Details</span>
                    </div>
                </div>

                <form onSubmit={handleCheckout} className="grid md:grid-cols-12 gap-16 items-start">
                    {/* Form Left */}
                    <div className="md:col-span-7 space-y-12">
                        <div className="bg-white/[0.02] border border-white/5 rounded-[50px] p-12 backdrop-blur-3xl shadow-2xl space-y-10 group">
                            <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-4">
                                Shipping <span className="text-white/20 italic">Information</span>
                            </h3>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 ml-4">First Name</label>
                                    <input
                                        required
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        placeholder="ALEXANDER"
                                        className="w-full bg-black/40 border border-white/5 rounded-full px-8 py-5 text-white placeholder-white/5 focus:outline-none focus:border-primary transition-all font-bold uppercase tracking-widest text-xs"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 ml-4">Last Name</label>
                                    <input
                                        required
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        placeholder="VOLKOV"
                                        className="w-full bg-black/40 border border-white/5 rounded-full px-8 py-5 text-white placeholder-white/5 focus:outline-none focus:border-primary transition-all font-bold uppercase tracking-widest text-xs"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 ml-4">Email Address</label>
                                <input
                                    required
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="ALEX@QUANTUM.CORE"
                                    className="w-full bg-black/40 border border-white/5 rounded-full px-8 py-5 text-white placeholder-white/5 focus:outline-none focus:border-primary transition-all font-bold uppercase tracking-widest text-xs"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 ml-4">Delivery Address</label>
                                <input
                                    required
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder="STREET NAME, SUITE 800"
                                    className="w-full bg-black/40 border border-white/5 rounded-full px-8 py-5 text-white placeholder-white/5 focus:outline-none focus:border-primary transition-all font-bold uppercase tracking-widest text-xs"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 ml-4">City</label>
                                    <input
                                        required
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        placeholder="METROPOLIS"
                                        className="w-full bg-black/40 border border-white/5 rounded-full px-8 py-5 text-white placeholder-white/5 focus:outline-none focus:border-primary transition-all font-bold uppercase tracking-widest text-xs"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 ml-4">Postal Code</label>
                                    <input
                                        required
                                        type="text"
                                        name="zip"
                                        value={formData.zip}
                                        onChange={handleInputChange}
                                        placeholder="000000"
                                        className="w-full bg-black/40 border border-white/5 rounded-full px-8 py-5 text-white placeholder-white/5 focus:outline-none focus:border-primary transition-all font-bold uppercase tracking-widest text-xs"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between px-10">
                             <button type="button" onClick={() => navigate("/cart")} className="flex items-center gap-4 text-white/20 hover:text-white transition-all font-black uppercase tracking-[0.4em] text-[10px]">
                                <ChevronLeft size={16} /> Back to Vault
                             </button>
                             <div className="flex items-center gap-3 text-white/10 font-black uppercase tracking-[0.4em] text-[9px]">
                                <ShieldCheck size={14} /> Encrypted Session
                             </div>
                        </div>
                    </div>

                    {/* Form Right - Summary */}
                    <div className="md:col-span-5 space-y-10">
                        <div className="bg-white/[0.03] border border-white/10 rounded-[50px] p-12 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
                           <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-10 transition-opacity duration-1000"></div>
                           
                           <h3 className="text-xl font-black uppercase tracking-tight mb-10 pb-6 border-b border-white/5">
                                Transaction <span className="text-white/20 italic">Ledger</span>
                           </h3>

                           <div className="space-y-8 mb-12 max-h-[300px] overflow-y-auto pr-4 scrollbar-hide">
                                {cart.items.map((item: any) => (
                                    <div key={item.product_id._id} className="flex justify-between items-center bg-white/[0.02] p-6 rounded-[30px] border border-white/5">
                                        <div className="flex flex-col gap-1">
                                            <p className="text-xs font-black uppercase tracking-widest truncate max-w-[140px]">{item.product_id.name}</p>
                                            <p className="text-[9px] text-white/30 font-bold uppercase tracking-[0.2em]">Quantity: {item.quantity}</p>
                                        </div>
                                        <p className="text-lg font-black tracking-tighter tabular-nums">${item.total_price.toFixed(2)}</p>
                                    </div>
                                ))}
                           </div>

                           <div className="space-y-6 mb-12 pt-6 border-t border-white/5">
                               <div className="flex justify-between items-center text-white/30 text-[10px] font-black uppercase tracking-[0.3em]">
                                   <span>Subtotal</span>
                                   <span className="text-white">${cart.total_price.toFixed(2)}</span>
                               </div>
                               <div className="flex justify-between items-center text-white/30 text-[10px] font-black uppercase tracking-[0.3em]">
                                   <span>Priority Fee</span>
                                   <span className="text-primary italic">FREE</span>
                               </div>
                               <div className="h-px w-full bg-white/5"></div>
                               <div className="flex justify-between items-end">
                                   <div className="flex flex-col gap-1">
                                        <span className="text-white/20 text-[9px] font-black uppercase tracking-[0.4em]">Total Due</span>
                                        <span className="text-5xl font-black tracking-tighter tabular-nums">${cart.total_price.toFixed(2)}</span>
                                   </div>
                               </div>
                           </div>

                           <button
                             type="submit"
                             disabled={loading}
                             className="group relative w-full py-10 bg-primary text-secondary font-black uppercase tracking-[0.6em] text-[12px] rounded-full hover:bg-white hover:text-black transition-all duration-700 shadow-2xl flex items-center justify-center gap-6 overflow-hidden"
                           >
                             {loading ? (
                               <div className="w-6 h-6 border-t-2 border-secondary rounded-full animate-spin"></div>
                             ) : (
                               <>
                                 <CreditCard size={20} className="group-hover:scale-110 transition-transform" />
                                 Initialize Payment
                                 <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                               </>
                             )}
                           </button>
                        </div>
                        
                        <div className="bg-black/40 border border-white/5 rounded-[40px] p-8 flex items-center gap-6">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary shadow-inner">
                                <Lock size={20} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-[10px] font-black uppercase tracking-widest leading-none">Military-Grade Security</p>
                                <p className="text-[9px] text-white/20 font-bold uppercase tracking-[0.2em]">AES-256 Bit Payment Layer</p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <style>
                {`
                    @keyframes page-in {
                        from { opacity: 0; transform: scale(0.98); filter: blur(10px); }
                        to { opacity: 1; transform: scale(1); filter: blur(0); }
                    }
                    .animate-page-in {
                        animation: page-in 1.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
                    }
                    .scrollbar-hide::-webkit-scrollbar { display: none; }
                    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
                `}
            </style>
        </div>
    );
};

export default ProductCheckout;
