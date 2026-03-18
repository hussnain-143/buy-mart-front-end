import { useEffect, useState } from "react";
import { useSearchParams, NavLink } from "react-router-dom";
import { verifySession } from "../services/stripe.service";
import { CreateOrder } from "../services/order.service";
import { CheckCircle, ArrowRight, Loader, ShoppingBag, ShieldCheck, Home } from "lucide-react";
import { useCart } from "../context/CartContext";

const Success = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const type = searchParams.get("type"); // 'product' or null (subscription)
    const [status, setStatus] = useState("loading"); // loading, success, error, finalizing
    const [orderId, setOrderId] = useState<string | null>(null);
    const { fetchCart } = useCart();

    useEffect(() => {
        if (!sessionId) {
            setStatus("error");
            return;
        }

        const verify = async () => {
            try {
                await verifySession(sessionId);

                if (type === "product") {
                    setStatus("finalizing");
                    const shippingAddress = sessionStorage.getItem("pending_shipping_address");

                    try {
                        const orderRes = await CreateOrder({
                            shipping_address: shippingAddress || "Stripe Payment Address",
                            payment_method: "card",
                            stripe_session_id: sessionId
                        });

                        if (orderRes.success) {
                            setOrderId(orderRes.data._id);
                            setStatus("success");
                            sessionStorage.removeItem("pending_shipping_address");
                            // Refresh cart to clear it locally (backend already cleared it)
                            fetchCart();
                        } else {
                            setStatus("error");
                        }
                    } catch (orderError) {
                        console.error("Order creation failed:", orderError);
                        setStatus("error");
                    }
                } else {
                    setStatus("success");
                }
            } catch (error) {
                console.error("Verification failed", error);
                setStatus("error");
            }
        };

        verify();
    }, [sessionId, type, fetchCart]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white px-4 relative overflow-hidden selection:bg-primary/30">
            {/* Background Decorations */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[150px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px]"></div>

            <div className="relative max-w-2xl w-full bg-white/[0.02] backdrop-blur-[100px] border border-white/10 rounded-[60px] p-12 md:p-20 text-center shadow-2xl animate-fade-in-up">
                
                {/* Visual Header Decoration */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full shadow-[0_0_20px_rgba(255,165,0,0.5)]"></div>

                {(status === "loading" || status === "finalizing") && (
                    <div className="py-12 flex flex-col items-center">
                        <div className="relative mb-12">
                            <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-ping opacity-50"></div>
                            <div className="w-24 h-24 rounded-full border border-white/5 flex items-center justify-center bg-white/[0.02] relative z-10">
                                <Loader className="w-12 h-12 text-primary animate-spin" />
                            </div>
                        </div>
                        <h2 className="text-5xl font-black italic mb-6 tracking-tighter uppercase text-white">
                            {status === "loading" ? "SYNCHRONIZING..." : "LOGGING DATA..."}
                        </h2>
                        <p className="text-white/30 text-lg font-medium max-w-sm mx-auto tracking-tight">
                            {status === "loading"
                                ? "Authenticating your secure payload transfer via Stripe Gateway."
                                : "Permanently writing your transaction to the platform ledger."}
                        </p>
                    </div>
                )}

                {status === "success" && (
                    <div className="py-2">
                        <div className="relative inline-block mb-12">
                            <div className="absolute inset-0 bg-green-500/10 rounded-full blur-[80px] animate-pulse"></div>
                            <div className="w-28 h-28 bg-green-500 rounded-full flex items-center justify-center relative z-10 shadow-[0_0_50px_rgba(34,197,94,0.3)]">
                                <CheckCircle className="w-14 h-14 text-white" strokeWidth={2.5} />
                            </div>
                        </div>
                        
                        <div className="space-y-2 mb-8">
                            <span className="text-primary font-black text-[10px] uppercase tracking-[0.5em] block mb-2">Verified Operation</span>
                            <h1 className="text-7xl font-black tracking-tighter italic uppercase text-white leading-none">
                                SECURED
                            </h1>
                        </div>

                        <div className="bg-white/[0.03] border border-white/5 rounded-[40px] p-8 mb-12 shadow-inner">
                            {type === "product" ? (
                                <>
                                    <p className="text-white/50 mb-6 font-medium text-lg leading-relaxed">
                                        Your premium acquisition has been authorized and dispatched to our fulfillment nodes.
                                    </p>
                                    {orderId && (
                                        <div className="pt-6 border-t border-white/5">
                                            <p className="text-[9px] font-black tracking-[0.4em] text-white/20 uppercase mb-3">Master Reference ID</p>
                                            <p className="text-3xl font-black text-primary tracking-widest uppercase italic tabular-nums">
                                                #{orderId.slice(-8).toUpperCase()}
                                            </p>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <p className="text-white/50 font-medium text-lg leading-relaxed">
                                    Operational credentials upgraded. Your Vendor Command Center is now fully operational.
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-6">
                            {type === "product" ? (
                                <NavLink
                                    to="/profile"
                                    className="group relative w-full py-8 bg-primary text-white rounded-[32px] font-black uppercase tracking-[0.3em] text-[11px] overflow-hidden shadow-2xl shadow-primary/40 transition-all hover:scale-[1.03] active:scale-95 flex items-center justify-center gap-4"
                                >
                                    <div className="absolute inset-x-0 bottom-0 h-1.5 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                                    LOCATE PAYLOAD <ShoppingBag size={18} />
                                </NavLink>
                            ) : (
                                <NavLink
                                    to="/vendor-form"
                                    className="group relative w-full py-8 bg-primary text-white rounded-[32px] font-black uppercase tracking-[0.3em] text-[11px] overflow-hidden shadow-2xl shadow-primary/40 transition-all hover:scale-[1.03] active:scale-95 flex items-center justify-center gap-4"
                                >
                                    <div className="absolute inset-x-0 bottom-0 h-1.5 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                                    LAUNCH TERMINAL <ArrowRight size={18} />
                                </NavLink>
                            )}
                            
                            <NavLink
                                to="/"
                                className="w-full py-5 text-white/30 border border-white/10 rounded-[32px] font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-3"
                            >
                                <Home size={16} /> RETURN TO HUB
                            </NavLink>
                        </div>
                        
                        <div className="mt-16 flex items-center justify-center gap-4 text-white/10 text-[9px] font-black uppercase tracking-[0.3em]">
                            <ShieldCheck size={14} className="text-primary/40" /> End-to-End Quantum Encryption Active
                        </div>
                    </div>
                )}

                {status === "error" && (
                    <div className="py-8">
                        <div className="w-28 h-28 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl">
                            <span className="text-5xl animate-pulse">⚠️</span>
                        </div>
                        <h2 className="text-5xl font-black italic mb-6 tracking-tighter uppercase text-white">ANOMALY DETECTED</h2>
                        <p className="text-white/30 text-lg font-medium mb-12 max-w-sm mx-auto leading-relaxed">
                            The handshake protocol failed to resolve. Security measures have logged this event.
                        </p>
                        <NavLink
                            to={type === "product" ? "/cart" : "/subscription"}
                            className="w-full py-8 bg-white/5 border border-white/10 text-white rounded-[32px] font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                        >
                            RETRY CONNECTION
                        </NavLink>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Success;
