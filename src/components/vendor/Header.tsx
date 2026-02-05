import React from "react";
import { Search, Menu } from "lucide-react";

interface HeaderProps {
    onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
    return (
        <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-2xl border-b border-gray-100 h-20 flex-shrink-0">
            <div className="flex items-center justify-between px-6 lg:px-10 h-full gap-4">

                {/* Menu Button (Mobile) */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 -ml-2 text-gray-400 hover:text-secondary rounded-xl hover:bg-gray-100 transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>

                {/* Search */}
                <div className="flex-1 max-w-2xl">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                            <Search className="w-4 h-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search store and orders..."
                            className="
                w-full pl-12 pr-6 py-3.5
                bg-gray-50 rounded-2xl
                text-xs font-black text-gray-900
                placeholder:text-gray-400
                focus:ring-1 focus:ring-primary/50
                focus:bg-white transition-all
                shadow-inner uppercase tracking-wider
                outline-none
              "
                        />
                    </div>
                </div>

                {/* Vendor Text Badge */}
                <div className="hidden sm:block ml-10">
                    <div className="
            flex items-center gap-3
            px-6 py-3
            rounded-full
            bg-orange-500/5
            border border-orange-500/20
            text-orange-600
            shadow-sm
          ">
                        <span className="text-xs font-black uppercase tracking-widest">
                            Seller
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                        <span className="text-[10px] font-black uppercase tracking-wider text-orange-400">
                            Partner Portal
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
