import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate, NavLink } from "react-router-dom";
import { Check, ArrowRight, ShieldCheck, Sparkles, ShoppingBag, Home } from "lucide-react";
import { verifySession } from "../services/stripe.service";
import { CreateOrder } from "../services/order.service";
import { useCart } from "../context/CartContext";

const Success = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const type = searchParams.get("type");
    const [status, setStatus] = useState<"verifying" | "finalizing" | "success" | "error">("verifying");
    const [orderDetails, setOrderDetails] = useState<any>(null);
    const { clearCart } = useCart();
    const navigate = useNavigate();
    const hasExecuted = useRef(false);

    useEffect(() => {
        if (!sessionId || hasExecuted.current) return;

        const finalizeTransaction = async () => {
            hasExecuted.current = true;
            try {
                const verifyRes = await verifySession(sessionId);
                if (!verifyRes.success) throw new Error("Verification failed.");

                if (type === "product") {
                    setStatus("finalizing");
                    const orderRes = await CreateOrder({
                        shipping_address: verifyRes.data.customer_details?.address?.line1 || "Digital Delivery",
                        payment_method: "card",
                        stripe_session_id: sessionId
                    });

                    if (orderRes.success || orderRes.message === "Order already processed") {
                        setOrderDetails(orderRes.data);
                        setStatus("success");
                        clearCart();
                    } else {
                        throw new Error(orderRes.message || "Finalization failed.");
                    }
                } else {
                    setStatus("success");
                }
            } catch (error) {
                console.error("Success Page Execution Error:", error);
                setStatus("error");
            }
        };

        finalizeTransaction();
    }, [sessionId, type]);

    if (status === "verifying" || status === "finalizing") {
        return (
            <div className="min-h-screen bg-secondary flex flex-col justify-center items-center gap-8 text-white">
                <div className="w-14 h-14 border-4 border-white/10 border-t-primary rounded-full animate-spin"></div>
                <div className="text-center space-y-2">
                    <h2 className="text-sm font-black uppercase tracking-[0.4em] text-primary">{status === "verifying" ? "Verifying Transaction" : "Finalizing Order"}</h2>
                    <p className="text-white/20 font-bold uppercase tracking-[0.2em] text-[10px]">Harmonizing with systems...</p>
                </div>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="min-h-screen bg-secondary flex flex-col justify-center items-center text-white px-6">
                <Sparkles size={48} className="mb-10 text-rose-500/40" />
                <h1 className="text-5xl font-black uppercase tracking-tighter mb-6 text-center">Sync <span className="text-rose-500 italic">Interrupted</span></h1>
                <p className="text-white/40 text-center max-w-sm mb-12 font-medium leading-relaxed">
                    Transaction was successful, but catalog synchronization failed. Our support team has been engaged.
                </p>
                <button onClick={() => navigate("/")} className="px-14 py-5 bg-white/5 border border-white/10 text-white font-black uppercase tracking-[0.3em] text-[11px] rounded-full hover:bg-white hover:text-secondary transition-all">
                    Return to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-secondary text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 rounded-full blur-[200px] pointer-events-none opacity-50"></div>
            
            <div className="max-w-4xl w-full relative z-10 flex flex-col items-center text-center animate-fade-in-up">
                <div className="h-44 w-44 rounded-[60px] bg-white/5 border-2 border-primary/20 flex items-center justify-center mb-16 shadow-2xl shadow-primary/10 group">
                    <Check size={80} className="text-primary group-hover:scale-110 transition-transform duration-700" strokeWidth={3} />
                </div>

                <div className="space-y-6 mb-24">
                    <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase leading-none">
                        Success<span className="text-primary italic">.</span>
                    </h1>
                    <p className="text-white/40 text-[13px] font-black uppercase tracking-[0.8em] max-w-lg mx-auto leading-relaxed">
                        Transaction Finalized & Verified
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 w-full mb-16">
                    <div className="bg-[#1E1E1E]/40 backdrop-blur-xl p-12 rounded-[50px] border border-white/5 text-left space-y-8 hover:border-primary/20 transition-all">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-primary pb-4 border-b border-white/5">Order Identity</h3>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-white/40">
                                <span>Reference</span>
                                <span className="text-white italic">#{orderDetails?._id?.slice(-8).toUpperCase() || "N/A"}</span>
                            </div>
                            <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-white/40">
                                <span>Status</span>
                                <span className="text-primary">In Fulfillment</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#1E1E1E]/40 backdrop-blur-xl p-12 rounded-[50px] border border-white/5 text-left flex flex-col justify-between hover:border-primary/20 transition-all group">
                         <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-primary pb-4 border-b border-white/5">Next Protocol</h3>
                         <div className="mt-4 space-y-4">
                            <p className="text-white/40 text-xs font-medium leading-relaxed italic">
                                A high-priority logistics stream has been initiated. Check your inbox for real-time telemetry.
                            </p>
                            <NavLink to="/" className="inline-flex items-center gap-4 text-white font-black uppercase tracking-[0.4em] text-[10px] group-hover:text-primary transition-all">
                                Access Dashboard <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                            </NavLink>
                         </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-12">
                    <NavLink to="/shop" className="group flex items-center gap-4 text-white/40 hover:text-white transition-all font-black uppercase tracking-[0.4em] text-[11px]">
                        <ShoppingBag size={18} /> New Selection
                    </NavLink>
                    <div className="hidden md:block h-6 w-px bg-white/10"></div>
                    <NavLink to="/" className="group flex items-center gap-4 text-white/40 hover:text-white transition-all font-black uppercase tracking-[0.4em] text-[11px]">
                        <Home size={18} /> Exit to Home
                    </NavLink>
                </div>

                <div className="mt-24 flex items-center gap-4 text-white/5 font-black uppercase tracking-[0.5em] text-[9px]">
                    <ShieldCheck size={16} /> Advanced Encryption Layer Active
                </div>
            </div>
        </div>
    );
};

export default Success;
