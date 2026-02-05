import React from "react";
import { Search, Menu } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 z-30 bg-secondary/80 backdrop-blur-3xl border-b border-white/5 h-20 flex-shrink-0">
      <div className="flex items-center justify-between px-6 lg:px-10 h-full gap-4">

        {/* Menu Button (Mobile) */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-primary rounded-xl hover:bg-white/5 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Search */}
        <div className="flex-1 max-w-2xl">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Si wearch className="w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search intelligence feed..."
              className="
                w-full pl-12 pr-6 py-3.5
                bg-white/[0.03] rounded-2xl
                text-xs font-black text-white
                placeholder:text-gray-600
                focus:ring-1 focus:ring-primary/50
                focus:bg-white/[0.05] transition-all
                shadow-inner uppercase tracking-wider
                outline-none border border-white/5
              "
            />
          </div>
        </div>

        {/* Admin Text Badge */}
        <div className="hidden sm:block ml-10">
          <div className="
            flex items-center gap-3
            px-6 py-3
            rounded-full
            bg-primary/10
            border border-primary/20
            text-primary
            shadow-sm
          ">
            <span className="text-xs font-black uppercase tracking-widest">
              Admin
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-wider text-primary/70">
              Nexus Master
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
