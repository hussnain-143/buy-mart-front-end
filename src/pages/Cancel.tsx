import { NavLink } from "react-router-dom";
import { XCircle, ArrowLeft, ShieldAlert, Home } from "lucide-react";

const Cancel = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white px-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[100px]"></div>

            <div className="relative max-w-xl w-full bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[50px] p-10 md:p-16 text-center shadow-2xl">
                <div className="relative inline-block mb-10">
                    <div className="absolute inset-0 bg-red-500/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="w-24 h-24 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center relative z-10 shadow-2xl shadow-red-500/10">
                        <XCircle className="w-12 h-12 text-red-500" />
                    </div>
                </div>

                <h1 className="text-4xl font-black mb-6 tracking-tighter italic uppercase text-transparent bg-clip-text bg-gradient-to-br from-white to-white/40">
                    PAYMENT ABORTED
                </h1>
                
                <p className="text-white/40 text-lg font-medium mb-10 max-w-xs mx-auto">
                    The transaction protocol was terminated by the user. No assets were exchanged.
                </p>

                <div className="flex flex-col gap-4">
                    <NavLink
                        to="/product-checkout"
                        className="group relative w-full py-6 bg-primary text-white rounded-[25px] font-black uppercase tracking-[0.2em] text-[10px] overflow-hidden shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
                    >
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                        RESTART CHECKOUT <ArrowLeft size={16} className="rotate-180" />
                    </NavLink>

                    <NavLink
                        to="/cart"
                        className="w-full py-4 text-white/30 border border-white/5 rounded-[25px] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
                    >
                        Return to Cart
                    </NavLink>
                    
                    <NavLink
                        to="/"
                        className="mt-4 flex items-center justify-center gap-2 text-white/20 hover:text-white transition-colors text-[10px] uppercase font-black tracking-widest"
                    >
                        <Home size={14} /> Exit to Hub
                    </NavLink>
                </div>

                <div className="mt-12 flex items-center justify-center gap-4 text-white/20 text-[10px] font-black uppercase tracking-widest">
                    <ShieldAlert size={14} /> Transaction Safety Protocols Engaged
                </div>
            </div>
        </div>
    );
};

export default Cancel;
