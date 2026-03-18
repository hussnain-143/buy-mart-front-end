import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Check, ArrowRight, ShieldCheck, CreditCard, Sparkles } from "lucide-react";
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
                if (!verifyRes.success) throw new Error("Invalid session verification");

                if (type === "product") {
                    setStatus("finalizing");
                    const orderRes = await CreateOrder({
                        shipping_address: verifyRes.data.customer_details?.address?.line1 || "Digital Product Delivery",
                        payment_method: "card",
                        stripe_session_id: sessionId
                    });

                    if (orderRes.success || orderRes.message === "Order already processed") {
                        setOrderDetails(orderRes.data);
                        setStatus("success");
                        clearCart();
                    } else {
                        throw new Error(orderRes.message || "Order registration failed");
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
            <div className="min-h-screen bg-black flex flex-col justify-center items-center gap-6 text-white">
                <div className="w-10 h-10 border-2 border-white/10 border-t-white rounded-full animate-spin"></div>
                <div className="text-center space-y-2">
                    <h2 className="text-sm font-bold uppercase tracking-[0.4em]">{status === "verifying" ? "Authenticating Session" : "Securing Selection"}</h2>
                    <p className="text-white/20 font-bold uppercase tracking-[0.2em] text-[9px]">Awaiting system confirmation...</p>
                </div>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="min-h-screen bg-black flex flex-col justify-center items-center text-white px-6">
                <Sparkles size={40} className="mb-8 text-rose-500/40" />
                <h1 className="text-4xl font-bold uppercase tracking-tight mb-4 text-center">Protocol <span className="text-rose-500 italic">Interrupted</span></h1>
                <p className="text-white/30 text-center max-w-sm mb-12 font-medium text-sm">
                    Payment recorded. System synchronization failed. Our team has been notified.
                </p>
                <button onClick={() => navigate("/")} className="px-12 py-4 border border-white/20 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-white hover:text-black transition-all">
                    Return to Interface
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/[0.03] to-transparent">
            <div className="max-w-xl w-full flex flex-col items-center text-center">
                <div className="h-40 w-40 rounded-full border border-white/10 flex items-center justify-center mb-16 relative">
                    <div className="absolute inset-0 bg-white/5 rounded-full blur-2xl"></div>
                    <Check size={60} className="text-white relative z-10" />
                </div>

                <div className="space-y-6 mb-20">
                    <h1 className="text-7xl font-black tracking-tighter uppercase leading-none">Accepted.</h1>
                    <p className="text-white/40 text-[11px] font-bold uppercase tracking-[0.6em] max-w-md mx-auto">
                        Your transaction has been finalized.
                    </p>
                </div>

                <div className="w-full border border-white/10 bg-white/[0.01] p-10 space-y-8 mb-16 text-left">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest border-b border-white/5 pb-6">
                        <span className="text-white/20">Reference No.</span>
                        <code className="text-white block">#{orderDetails?._id?.slice(-12).toUpperCase() || "N/A"}</code>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest border-b border-white/5 pb-6">
                        <span className="text-white/20">Delivery Status</span>
                        <span className="text-white italic">Processing in Queue</span>
                    </div>
                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest leading-relaxed">
                        An electronic ledger of this transaction has been dispatched to your primary communication channel.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-10">
                    <button onClick={() => navigate("/")} className="group flex items-center gap-3 text-white font-bold uppercase tracking-[0.3em] text-[11px] hover:underline underline-offset-8 decoration-white/30">
                        Interface Dashboard <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <div className="hidden md:block h-6 w-px bg-white/10"></div>
                    <button onClick={() => navigate("/shop")} className="text-white/20 hover:text-white transition-all font-bold uppercase tracking-[0.3em] text-[10px]">
                        Start New Cycle
                    </button>
                </div>

                <div className="mt-20 flex items-center gap-4 text-white/5 font-bold uppercase tracking-widest text-[9px]">
                    <ShieldCheck size={14} /> End-to-End Cryptography Enabled
                </div>
            </div>
        </div>
    );
};

export default Success;
