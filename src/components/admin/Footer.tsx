import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="relative mt-auto border-t border-white/5 bg-[#0a0a0a]/80 backdrop-blur-3xl">
      {/* soft accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

      <div className="py-12 text-center">
        <div className="flex flex-col items-center gap-4">
            <div className="flex gap-1">
                <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1 h-1 bg-primary rounded-full animate-bounce" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500">
            Nexus Protocol © 2026 BuyMart <span className="text-primary/50 mx-2">|</span> Operational Intelligence
            </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
