import { useEffect, useState } from "react";
import { useSearchParams, NavLink } from "react-router-dom";
import { verifySession } from "../services/stripe.service";
import { CreateOrder } from "../services/order.service";
import { CheckCircle, ArrowRight, Loader, ShoppingBag, ShieldCheck, Home } from "lucide-react";
import { useCart } from "../context/CartContext";

const Success = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const type = searchParams.get("type"); 
    const [status, setStatus] = useState("loading");
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
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[150px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px]"></div>

            <div className="relative max-w-xl w-full bg-white/[0.02] backdrop-blur-[80px] border border-white/10 rounded-[50px] p-10 md:p-16 text-center shadow-2xl animate-fade-in-up">
                
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full shadow-[0_0_20px_rgba(255,165,0,0.5)]"></div>

                {(status === "loading" || status === "finalizing") && (
                    <div className="py-10 flex flex-col items-center">
                        <div className="relative mb-10">
                            <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-ping opacity-50"></div>
                            <div className="w-20 h-20 rounded-full border border-white/5 flex items-center justify-center bg-white/[0.02] relative z-10">
                                <Loader className="w-10 h-10 text-primary animate-spin" />
                            </div>
                        </div>
                        <h2 className="text-4xl font-black italic mb-4 tracking-tighter uppercase text-white leading-none">
                            {status === "loading" ? "SYNCHRONIZING..." : "LOGGING DATA..."}
                        </h2>
                        <p className="text-white/30 text-base font-medium max-w-sm mx-auto tracking-tight">
                            Initialing secure handshake and verifying payload transfer.
                        </p>
                    </div>
                )}

                {status === "success" && (
                    <div className="py-2">
                        <div className="relative inline-block mb-10">
                            <div className="absolute inset-0 bg-green-500/10 rounded-full blur-[60px] animate-pulse"></div>
                            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center relative z-10 shadow-[0_0_40px_rgba(34,197,94,0.3)]">
                                <CheckCircle className="w-12 h-12 text-white" strokeWidth={2.5} />
                            </div>
                        </div>
                        
                        <div className="space-y-1 mb-6">
                            <span className="text-primary font-black text-[9px] uppercase tracking-[0.4em] block">Verified Node</span>
                            <h1 className="text-6xl font-black tracking-tighter italic uppercase text-white leading-none">
                                SECURED
                            </h1>
                        </div>

                        <div className="bg-white/[0.03] border border-white/5 rounded-[32px] p-6 mb-10">
                            {type === "product" ? (
                                <>
                                    <p className="text-white/50 mb-5 font-medium text-base leading-relaxed">
                                        Your acquisition has been authorized and dispatched to fulfillment.
                                    </p>
                                    {orderId && (
                                        <div className="pt-5 border-t border-white/5">
                                            <p className="text-[8px] font-black tracking-[0.3em] text-white/20 uppercase mb-2">Reference ID</p>
                                            <p className="text-2xl font-black text-primary tracking-widest uppercase italic tabular-nums">
                                                #{orderId.slice(-8).toUpperCase()}
                                            </p>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <p className="text-white/50 font-medium text-base leading-relaxed">
                                    Operational credentials upgraded. Access your Command Center.
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-4">
                            {type === "product" ? (
                                <NavLink
                                    to="/profile"
                                    className="group relative w-full py-6 bg-primary text-white rounded-[24px] font-black uppercase tracking-[0.3em] text-[10px] overflow-hidden shadow-2xl shadow-primary/40 transition-all hover:scale-[1.03] active:scale-95 flex items-center justify-center gap-3"
                                >
                                    <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                                    LOCATE PAYLOAD <ShoppingBag size={16} />
                                </NavLink>
                            ) : (
                                <NavLink
                                    to="/vendor-form"
                                    className="group relative w-full py-6 bg-primary text-white rounded-[24px] font-black uppercase tracking-[0.3em] text-[10px] overflow-hidden shadow-2xl shadow-primary/40 transition-all hover:scale-[1.03] active:scale-95 flex items-center justify-center gap-3"
                                >
                                    <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                                    LAUNCH TERMINAL <ArrowRight size={16} />
                                </NavLink>
                            )}
                            
                            <NavLink
                                to="/"
                                className="w-full py-4 text-white/30 border border-white/10 rounded-[24px] font-black uppercase tracking-[0.2em] text-[9px] hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-2"
                            >
                                <Home size={14} /> RETURN HUB
                            </NavLink>
                        </div>
                        
                        <div className="mt-12 flex items-center justify-center gap-3 text-white/10 text-[8px] font-black uppercase tracking-[0.3em]">
                            <ShieldCheck size={12} className="text-primary/40" /> Quantum Encryption Active
                        </div>
                    </div>
                )}

                {status === "error" && (
                    <div className="py-6">
                        <div className="w-24 h-24 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                            <span className="text-4xl animate-pulse">⚠️</span>
                        </div>
                        <h2 className="text-4xl font-black italic mb-4 tracking-tighter uppercase text-white">ANOMALY</h2>
                        <p className="text-white/30 text-base font-medium mb-10 max-w-sm mx-auto leading-relaxed">
                             हैंडशेक protocol failed. Logging event.
                        </p>
                        <NavLink
                            to={type === "product" ? "/cart" : "/subscription"}
                            className="w-full py-6 bg-white/5 border border-white/10 text-white rounded-[24px] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white/10 transition-all flex items-center justify-center gap-2"
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
