import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate, NavLink } from "react-router-dom";
import { Check, ArrowRight, ShieldCheck, ShoppingBag, Home } from "lucide-react";
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
            <div className="min-h-screen bg-secondary flex flex-col justify-center items-center gap-6 text-white text-center">
                <div className="w-12 h-12 border-4 border-white/10 border-t-primary rounded-full animate-spin"></div>
                <div className="space-y-1">
                    <h2 className="text-xs font-black uppercase tracking-[0.4em] text-primary">{status === "verifying" ? "Verifying Transaction" : "Finalizing Order"}</h2>
                    <p className="text-white/20 font-bold uppercase tracking-[0.2em] text-[10px]">Harmonizing with systems...</p>
                </div>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="min-h-screen bg-secondary flex flex-col justify-center items-center text-white px-6">
                <div className="w-14 h-14 rounded-full bg-rose-500/10 flex items-center justify-center mb-8 border border-rose-500/20">
                    <Check size={32} className="text-rose-500/40 rotate-180" />
                </div>
                <h1 className="text-4xl font-black uppercase tracking-tighter mb-4 text-center leading-none">Sync <span className="text-rose-500 italic">Interrupted</span></h1>
                <p className="text-white/40 text-center max-w-sm mb-10 font-medium text-sm leading-relaxed">
                    Transaction was successful, but catalog synchronization failed. Our support team has been engaged.
                </p>
                <button onClick={() => navigate("/")} className="px-10 py-4 bg-white/5 border border-white/10 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-full hover:bg-white hover:text-secondary transition-all">
                    Return to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-secondary text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient Ambient */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 rounded-full blur-[200px] pointer-events-none opacity-40"></div>
            
            <div className="max-w-4xl w-full relative z-10 flex flex-col items-center text-center animate-fade-in-up">
                <div className="h-32 w-32 rounded-[40px] bg-white/5 border border-primary/20 flex items-center justify-center mb-12 shadow-2xl group">
                    <Check size={56} className="text-primary group-hover:scale-110 transition-transform duration-500" strokeWidth={3} />
                </div>

                <div className="space-y-6 mb-20">
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">
                        Success<span className="text-primary italic">.</span>
                    </h1>
                    <p className="text-white/30 text-[11px] font-black uppercase tracking-[0.6em] max-w-md mx-auto leading-relaxed">
                        Transaction Completed
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 w-full mb-12">
                    <div className="bg-[#1E1E1E]/40 backdrop-blur-xl p-10 rounded-[40px] border border-white/5 text-left space-y-6 hover:border-primary/20 transition-all shadow-xl">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-primary border-b border-white/5 pb-3">Order Registry</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-white/30">
                                <span>Reference ID</span>
                                <span className="text-white tabular-nums">#{orderDetails?._id?.slice(-8).toUpperCase() || "N/A"}</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-white/30">
                                <span>Status Level</span>
                                <span className="text-primary">In Fulfillment</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#1E1E1E]/40 backdrop-blur-xl p-10 rounded-[40px] border border-white/5 text-left flex flex-col justify-between hover:border-primary/20 transition-all shadow-xl group">
                         <h3 className="text-[10px] font-black uppercase tracking-widest text-primary border-b border-white/5 pb-3">Next Phase</h3>
                         <div className="mt-4 space-y-3">
                            <p className="text-white/30 text-[11px] font-medium leading-relaxed italic">
                                Logistics stream initiated. Verification sent to your primary channel.
                            </p>
                            <NavLink to="/" className="inline-flex items-center gap-4 text-white font-black uppercase tracking-widest text-[10px] group-hover:text-primary transition-all">
                                Open Dashboard <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                            </NavLink>
                         </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-10">
                    <NavLink to="/shop" className="group flex items-center gap-4 text-white/40 hover:text-white transition-all font-black uppercase tracking-widest text-[10px]">
                        <ShoppingBag size={16} /> Shop Again
                    </NavLink>
                    <div className="hidden md:block h-5 w-px bg-white/10"></div>
                    <NavLink to="/" className="group flex items-center gap-4 text-white/40 hover:text-white transition-all font-black uppercase tracking-widest text-[10px]">
                        <Home size={16} /> Home Interface
                    </NavLink>
                </div>

                <div className="mt-16 flex items-center gap-3 text-white/5 font-black uppercase tracking-widest text-[9px]">
                    <ShieldCheck size={14} /> Encrypted.
                </div>
            </div>
        </div>
    );
};

export default Success;
