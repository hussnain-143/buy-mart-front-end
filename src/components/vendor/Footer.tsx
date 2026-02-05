import React from "react";

const Footer: React.FC = () => {
    return (
        <footer className="relative mt-auto border-t border-gray-100 bg-white/70 backdrop-blur-xl">
            {/* soft accent line */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

            <div className="py-10 text-center">
                <p className="text-[12px] font-black uppercase tracking-[0.35em] text-primary/70">
                    © 2026 BuyMart Seller. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
