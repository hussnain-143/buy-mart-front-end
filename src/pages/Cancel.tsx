import { NavLink } from "react-router-dom";
import { XCircle, ArrowLeft } from "lucide-react";

const Cancel = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <XCircle className="w-10 h-10 text-red-500" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Payment Canceled</h2>
                <p className="text-gray-600 mb-8">
                    You have canceled the checkout process. No charges were made.
                </p>
                <div className="space-y-3">
                    <NavLink
                        to="/checkout"
                        className="inline-flex items-center justify-center w-full py-4 px-6 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition shadow-lg"
                    >
                        Try Again
                    </NavLink>
                    <NavLink
                        to="/subscription"
                        className="inline-flex items-center justify-center gap-2 w-full py-3 px-6 bg-white border-2 border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition"
                    >
                        <ArrowLeft size={18} /> Back to Plans
                    </NavLink>
                </div>
            </div>
        </div>
    );
};

export default Cancel;
