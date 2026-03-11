import { useEffect, useState } from "react";
import { useSearchParams, NavLink } from "react-router-dom";
import { verifySession } from "../services/stripe.service";
import { CreateOrder } from "../services/order.service";
import { CheckCircle, ArrowRight, Loader, ShoppingBag } from "lucide-react";

const Success = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const type = searchParams.get("type"); // 'product' or null (subscription)
    const [status, setStatus] = useState("loading"); // loading, success, error, finalizing
    const [orderId, setOrderId] = useState<string | null>(null);

    useEffect(() => {
        if (!sessionId) {
            setStatus("error");
            return;
        }

        const verify = async () => {
            try {
                const res = await verifySession(sessionId);

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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100">

                {(status === "loading" || status === "finalizing") && (
                    <div className="py-12">
                        <Loader className="w-16 h-16 text-primary animate-spin mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            {status === "loading" ? "Verifying Payment" : "Finalizing Order"}
                        </h2>
                        <p className="text-gray-500">
                            {status === "loading"
                                ? "Please wait while we confirm your payment..."
                                : "Creating your order and clearing cart..."}
                        </p>
                    </div>
                )}

                {status === "success" && (
                    <div className="py-8">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Payment Successful!</h2>

                        {type === "product" ? (
                            <>
                                <p className="text-gray-600 mb-2">
                                    Your order has been placed successfully.
                                </p>
                                {orderId && (
                                    <p className="text-sm font-bold text-primary mb-8 tracking-wider">
                                        ORDER #{orderId.slice(-6).toUpperCase()}
                                    </p>
                                )}
                                <NavLink
                                    to="/profile"
                                    className="inline-flex items-center justify-center gap-2 w-full py-4 px-6 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition shadow-lg"
                                >
                                    View Your Orders <ShoppingBag size={20} />
                                </NavLink>
                            </>
                        ) : (
                            <>
                                <p className="text-gray-600 mb-8">
                                    Thank you for subscribing. You now have full access to vendor features.
                                </p>
                                <NavLink
                                    to="/vendor-form"
                                    className="inline-flex items-center justify-center gap-2 w-full py-4 px-6 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition shadow-lg"
                                >
                                    Set Up Your Store <ArrowRight size={20} />
                                </NavLink>
                            </>
                        )}
                    </div>
                )}

                {status === "error" && (
                    <div className="py-8">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-3xl">⚠️</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Verification Failed</h2>
                        <p className="text-gray-600 mb-8">
                            We couldn't verify your payment or finalize your order. Please contact support.
                        </p>
                        <NavLink
                            to={type === "product" ? "/cart" : "/subscription"}
                            className="inline-flex items-center justify-center w-full py-3 px-6 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition"
                        >
                            {type === "product" ? "Return to Cart" : "Return to Plans"}
                        </NavLink>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Success;
