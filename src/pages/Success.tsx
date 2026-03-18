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
    }, [sessionId, type]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white px-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-600/10 rounded-full blur-[100px]"></div>

            <div className="relative max-w-xl w-full bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[50px] p-10 md:p-16 text-center shadow-2xl">
                
                {(status === "loading" || status === "finalizing") && (
                    <div className="py-12 flex flex-col items-center">
                        <div className="relative mb-10">
                            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-ping"></div>
                            <Loader className="w-20 h-20 text-primary animate-spin relative z-10" />
                        </div>
                        <h2 className="text-4xl font-black italic mb-4 tracking-tight uppercase">
                            {status === "loading" ? "VERIFYING..." : "FINALIZING..."}
                        </h2>
                        <p className="text-white/40 text-lg font-medium max-w-xs mx-auto">
                            {status === "loading"
                                ? "Authenticating your secure transaction with Stripe."
                                : "Writing your order to our secure blockchain ledger."}
                        </p>
                    </div>
                )}

                {status === "success" && (
                    <div className="py-2">
                        <div className="relative inline-block mb-10">
                            <div className="absolute inset-0 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
                            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center relative z-10 shadow-2xl shadow-green-500/40">
                                <CheckCircle className="w-12 h-12 text-white" />
                            </div>
                        </div>
                        
                        <h1 className="text-5xl font-black mb-6 tracking-tighter italic uppercase text-transparent bg-clip-text bg-gradient-to-br from-white to-white/40">
                            PAYMENT SECURED
                        </h1>

                        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 mb-10">
                            {type === "product" ? (
                                <>
                                    <p className="text-white/60 mb-2 font-medium">
                                        Your premium order has been initialized.
                                    </p>
                                    {orderId && (
                                        <div className="mt-4 pt-4 border-t border-white/5">
                                            <p className="text-[10px] font-black tracking-[0.3em] text-white/20 uppercase mb-2">Transaction ID</p>
                                            <p className="text-2xl font-black text-primary tracking-widest uppercase">
                                                {orderId.slice(-8).toUpperCase()}
                                            </p>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <p className="text-white/60 font-medium">
                                    Your Vendor Subscription is now active. Explore your new dashboard.
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-4">
                            {type === "product" ? (
                                <NavLink
                                    to="/profile"
                                    className="group relative w-full py-6 bg-primary text-white rounded-[25px] font-black uppercase tracking-[0.2em] text-[10px] overflow-hidden shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
                                >
                                    <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                                    VIEW TRACKING <ShoppingBag size={16} />
                                </NavLink>
                            ) : (
                                <NavLink
                                    to="/vendor-form"
                                    className="group relative w-full py-6 bg-primary text-white rounded-[25px] font-black uppercase tracking-[0.2em] text-[10px] overflow-hidden shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
                                >
                                    <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                                    CONFIGURE STORE <ArrowRight size={16} />
                                </NavLink>
                            )}
                            
                            <NavLink
                                to="/"
                                className="w-full py-4 text-white/30 border border-white/5 rounded-[25px] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
                            >
                                <Home size={14} /> Back to Hub
                            </NavLink>
                        </div>
                        
                        <div className="mt-12 flex items-center justify-center gap-4 text-white/20 text-[10px] font-black uppercase tracking-widest">
                            <ShieldCheck size={14} /> Zero-Knowledge Security Verified
                        </div>
                    </div>
                )}

                {status === "error" && (
                    <div className="py-8">
                        <div className="w-24 h-24 bg-red-500/20 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-red-500/10">
                            <span className="text-4xl">⚠️</span>
                        </div>
                        <h2 className="text-4xl font-black italic mb-6 tracking-tight uppercase">SYSTEM ERROR</h2>
                        <p className="text-white/40 text-lg font-medium mb-10 max-w-xs mx-auto">
                            The verification protocol encountered an anomaly. Please re-check your session.
                        </p>
                        <NavLink
                            to={type === "product" ? "/cart" : "/subscription"}
                            className="w-full py-6 bg-white/5 border border-white/10 text-white rounded-[25px] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                        >
                            RETRY HANDSHAKE
                        </NavLink>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Success;
