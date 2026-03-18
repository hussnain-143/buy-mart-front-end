import { useEffect, useState } from "react";
import { useSearchParams, NavLink } from "react-router-dom";
import { verifySession } from "../services/stripe.service";
import { CreateOrder } from "../services/order.service";
import { CheckCircle, ArrowRight, ShoppingBag, ShieldCheck, Home } from "lucide-react";
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
        <div className="min-h-screen flex items-center justify-center bg-secondary text-white px-6 relative overflow-hidden selection:bg-primary/30">
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[150px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px]"></div>

            <div className="relative max-w-2xl w-full bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[60px] p-12 md:p-20 text-center shadow-2xl animate-fade-in-up">
                
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full shadow-[0_0_20px_rgba(255,165,0,0.5)]"></div>

                {(status === "loading" || status === "finalizing") && (
                    <div className="py-12 flex flex-col items-center">
                        <div className="relative mb-12">
                            <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-ping opacity-50"></div>
                            <div className="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center bg-white/5 relative z-10 shadow-2xl">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                            </div>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight uppercase text-white leading-none">
                            {status === "loading" ? "Verifying..." : "Finalizing..."}
                        </h2>
                        <p className="text-white/40 text-lg font-medium max-w-sm mx-auto tracking-tight italic">
                            Securing your transaction and updating our records.
                        </p>
                    </div>
                )}

                {status === "success" && (
                    <div className="py-4">
                        <div className="relative inline-block mb-12">
                            <div className="absolute inset-0 bg-green-500/10 rounded-full blur-[60px] animate-pulse"></div>
                            <div className="w-28 h-28 bg-green-500 rounded-full flex items-center justify-center relative z-10 shadow-2xl shadow-green-500/30">
                                <CheckCircle className="w-14 h-14 text-secondary" strokeWidth={2.5} />
                            </div>
                        </div>
                        
                        <div className="space-y-3 mb-10">
                            <span className="text-accent font-black text-[10px] uppercase tracking-[0.5em] block">Transaction Secured</span>
                            <h1 className="text-6xl md:text-8xl font-black tracking-tight uppercase text-white leading-none">
                                SUCCESS
                            </h1>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 mb-12 shadow-inner">
                            {type === "product" ? (
                                <>
                                    <p className="text-white/50 mb-6 font-medium text-lg leading-relaxed">
                                        Your premium acquisition has been authorized and dispatched to fulfillment.
                                    </p>
                                    {orderId && (
                                        <div className="pt-6 border-t border-white/10">
                                            <p className="text-[10px] font-black tracking-[0.5em] text-white/30 uppercase mb-3 text-center">Reference ID</p>
                                            <p className="text-3xl font-black text-primary tracking-widest uppercase tabular-nums">
                                                #{orderId.slice(-8).toUpperCase()}
                                            </p>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <p className="text-white/50 font-medium text-lg leading-relaxed italic">
                                    Operational credentials upgraded. Your premium access is now active.
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-5">
                            {type === "product" ? (
                                <NavLink
                                    to="/profile"
                                    className="group relative w-full py-7 bg-primary text-secondary rounded-[30px] font-black uppercase tracking-[0.4em] text-[12px] overflow-hidden shadow-2xl shadow-primary/30 transition-all hover:scale-[1.03] active:scale-95 flex items-center justify-center gap-4"
                                >
                                    <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                                    Track Order <ShoppingBag size={18} />
                                </NavLink>
                            ) : (
                                <NavLink
                                    to="/vendor-form"
                                    className="group relative w-full py-7 bg-primary text-secondary rounded-[30px] font-black uppercase tracking-[0.4em] text-[12px] overflow-hidden shadow-2xl shadow-primary/30 transition-all hover:scale-[1.03] active:scale-95 flex items-center justify-center gap-4"
                                >
                                    <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                                    Launch Vendor Dashboard <ArrowRight size={18} />
                                </NavLink>
                            )}
                            
                            <NavLink
                                to="/"
                                className="w-full py-5 text-white/40 border border-white/10 rounded-[30px] font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-3 shadow-xl"
                            >
                                <Home size={16} /> Return to Home
                            </NavLink>
                        </div>
                        
                        <div className="mt-12 flex items-center justify-center gap-3 text-white/10 text-[8px] font-black uppercase tracking-[0.3em]">
                            <ShieldCheck size={12} className="text-primary/40" /> Quantum Encryption Active
                        </div>
                    </div>
                )}

                {status === "error" && (
                    <div className="py-10">
                        <div className="w-28 h-28 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl">
                            <span className="text-5xl animate-pulse">⚠️</span>
                        </div>
                        <h2 className="text-5xl font-black mb-6 tracking-tight uppercase text-white">An Error Occurred</h2>
                        <p className="text-white/40 text-lg font-medium mb-12 max-w-md mx-auto leading-relaxed italic">
                             The transaction hash could not be verified. Please retry.
                        </p>
                        <NavLink
                            to={type === "product" ? "/cart" : "/subscription"}
                            className="w-full py-7 bg-white/5 border border-white/10 text-white rounded-[30px] font-black uppercase tracking-[0.3em] text-[11px] hover:bg-white/10 transition-all flex items-center justify-center gap-3 shadow-2xl hover:border-primary/30"
                        >
                            Retry Connection
                        </NavLink>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Success;
