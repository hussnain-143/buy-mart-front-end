import { useEffect, useState, useRef } from "react";
import { useSearchParams, NavLink, useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowRight, Home, ShoppingBag, Sparkles, CreditCard } from "lucide-react";
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
                // 1. Verify Session
                const verifyRes = await verifySession(sessionId);
                if (!verifyRes.success) throw new Error("Invalid session verification");

                if (type === "product") {
                    setStatus("finalizing");
                    
                    // 2. Create Order (Backend fix ensures this handles reloads via stripe_session_id)
                    const orderRes = await CreateOrder({
                        shipping_address: verifyRes.data.customer_details?.address?.line1 || "Digital Product Delivery",
                        payment_method: "card",
                        stripe_session_id: sessionId
                    });

                    if (orderRes.success) {
                        setOrderDetails(orderRes.data);
                        setStatus("success");
                        clearCart();
                    } else {
                        // Check if it's just already processed
                        if (orderRes.message === "Order already processed") {
                             setOrderDetails(orderRes.data);
                             setStatus("success");
                        } else {
                             throw new Error(orderRes.message || "Order registration failed");
                        }
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
            <div className="min-h-screen bg-[#050505] flex flex-col justify-center items-center gap-12 text-white relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 rounded-full blur-[200px] animate-pulse"></div>
                <div className="relative">
                    <div className="w-32 h-32 border-2 border-white/5 border-t-primary rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <CreditCard size={32} className="text-white/10 animate-pulse" />
                    </div>
                </div>
                <div className="text-center space-y-4 relative z-10">
                    <h2 className="text-3xl font-black uppercase tracking-[0.4em] italic leading-tight">
                        {status === "verifying" ? "Authenticating Session" : "Securing Selection"}
                    </h2>
                    <p className="text-white/20 font-black uppercase tracking-[0.2em] text-[10px]">Quantum Confirmation in progress...</p>
                </div>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col justify-center items-center text-white px-6">
                <div className="p-10 rounded-full bg-rose-500/10 border border-rose-500/20 mb-10 text-rose-500">
                    <Sparkles size={60} strokeWidth={1} />
                </div>
                <h1 className="text-5xl font-black uppercase tracking-tighter mb-6 text-center">Synchronization <span className="text-rose-500 italic">Interrupted</span></h1>
                <p className="text-white/30 text-center max-w-md mb-12 font-medium leading-relaxed">
                    The payment was recorded, but order synchronization failed. Our executive team has been notified for manual reconciliation.
                </p>
                <div className="flex gap-6">
                    <button onClick={() => navigate("/")} className="px-12 py-5 bg-white text-black font-black uppercase tracking-[0.4em] text-[10px] rounded-full hover:bg-primary hover:text-white transition-all">Support Center</button>
                    <button onClick={() => navigate("/")} className="px-12 py-5 border border-white/10 text-white/40 font-black uppercase tracking-[0.4em] text-[10px] rounded-full hover:bg-white/5 transition-all">Home Dashboard</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/30 flex flex-col items-center justify-center relative overflow-hidden p-6">
            {/* Immersive Background */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[70%] bg-primary/[0.07] rounded-full blur-[200px]"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[60%] bg-blue-500/[0.05] rounded-full blur-[180px]"></div>
            </div>

            <div className="max-w-4xl w-full relative z-10 flex flex-col items-center animate-celebrate">
                <div className="relative mb-20 group">
                    <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000 scale-150"></div>
                    <div className="relative h-48 w-48 rounded-full border border-white/10 flex items-center justify-center bg-white/[0.02] backdrop-blur-3xl shadow-3xl">
                        <CheckCircle2 size={80} className="text-primary animate-check-pop" strokeWidth={1.5} />
                    </div>
                </div>

                <div className="text-center space-y-6 mb-24">
                    <div className="flex items-center justify-center gap-4 mb-2 animate-fade-in delay-200">
                        <div className="h-px w-10 bg-white/20"></div>
                        <span className="text-primary font-black uppercase tracking-[0.6em] text-[10px]">Transaction Complete</span>
                        <div className="h-px w-10 bg-white/20"></div>
                    </div>
                    <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-none animate-fade-in delay-300">
                        CONFIRMED <span className="text-white/20">&</span> <span className="text-primary italic">SECURED</span>
                    </h1>
                    <p className="text-white/30 text-xl font-medium max-w-xl mx-auto animate-fade-in delay-400">
                        Your selection has been successfully processed into our production queue.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 w-full animate-fade-in delay-500">
                    <div className="bg-white/[0.02] border border-white/5 p-12 rounded-[50px] backdrop-blur-3xl space-y-8 hover:bg-white/[0.04] transition-all duration-700">
                        <h3 className="text-white/20 font-black uppercase tracking-[0.4em] text-[10px] pb-4 border-b border-white/5">Order Status</h3>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center font-black uppercase tracking-widest text-xs">
                                <span className="text-white/40">Reference</span>
                                <span className="text-white truncate max-w-[150px] italic">#{orderDetails?._id?.slice(-8) || "N/A"}</span>
                            </div>
                            <div className="flex justify-between items-center font-black uppercase tracking-widest text-xs">
                                <span className="text-white/40">Dispatched To</span>
                                <span className="text-white">Standard Courier</span>
                            </div>
                            <div className="flex justify-between items-center font-black uppercase tracking-widest text-xs">
                                <span className="text-white/40">Timeline</span>
                                <span className="text-primary">2-5 Business Days</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 p-12 rounded-[50px] backdrop-blur-3xl flex flex-col justify-between hover:bg-white/[0.04] transition-all duration-700 group">
                         <h3 className="text-white/20 font-black uppercase tracking-[0.4em] text-[10px] pb-4 border-b border-white/5">Next Action</h3>
                         <div className="space-y-6 mt-4">
                             <p className="text-white/40 text-sm font-medium leading-relaxed italic">
                                Check your encrypted inbox for the full transaction receipt and tracking credentials.
                             </p>
                             <NavLink to="/" className="inline-flex items-center gap-6 text-white font-black uppercase tracking-[0.4em] text-[11px] group-hover:text-primary transition-all">
                                 Dashboard Access <ArrowRight size={18} className="group-hover:translate-x-3 transition-transform" />
                             </NavLink>
                         </div>
                    </div>
                </div>

                <div className="mt-24 flex items-center gap-10 animate-fade-in delay-700">
                    <NavLink to="/shop" className="group flex items-center gap-4 text-white/20 hover:text-white transition-all font-black uppercase tracking-[0.4em] text-[10px]">
                        <ShoppingBag size={16} /> New Selection
                    </NavLink>
                    <div className="h-10 w-px bg-white/10"></div>
                    <NavLink to="/" className="group flex items-center gap-4 text-white/20 hover:text-white transition-all font-black uppercase tracking-[0.4em] text-[10px]">
                        <Home size={16} /> Main Interface
                    </NavLink>
                </div>
            </div>

            <style>
                {`
                    @keyframes celebrate {
                        from { opacity: 0; transform: translateY(60px); filter: blur(20px); }
                        to { opacity: 1; transform: translateY(0); filter: blur(0); }
                    }
                    .animate-celebrate {
                        animation: celebrate 1.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
                    }
                    @keyframes check-pop {
                        0% { transform: scale(0.5); opacity: 0; }
                        50% { transform: scale(1.1); }
                        100% { transform: scale(1); opacity: 1; }
                    }
                    .animate-check-pop {
                        animation: check-pop 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                        animation-delay: 0.8s;
                        opacity: 0;
                    }
                    @keyframes fade-in {
                        from { opacity: 0; filter: blur(10px); }
                        to { opacity: 1; filter: blur(0); }
                    }
                    .animate-fade-in {
                        animation: fade-in 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                        opacity: 0;
                    }
                    .delay-200 { animation-delay: 0.2s; }
                    .delay-300 { animation-delay: 0.4s; }
                    .delay-400 { animation-delay: 0.6s; }
                    .delay-500 { animation-delay: 0.8s; }
                    .delay-700 { animation-delay: 1.2s; }
                `}
            </style>
        </div>
    );
};

export default Success;
