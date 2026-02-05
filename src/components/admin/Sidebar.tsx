import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  Settings,
  Tag,
  MessageSquare,
  FileText,
  ArrowLeft,
  Store,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Store, label: "Vendors", href: "/vendors" },
    { icon: ShoppingCart, label: "Orders", href: "/orders", badge: "5" },
    { icon: Package, label: "Products", href: "/products" },
    { icon: Users, label: "Customers", href: "/customers" },
    { icon: Tag, label: "Categories", href: "/categories" },
    { icon: BarChart3, label: "Analytics", href: "/analytics" },
    { icon: MessageSquare, label: "Reviews", href: "/reviews" },
    { icon: FileText, label: "Reports", href: "/reports" },
    { icon: Settings, label: "Settings", href: "/rsettings" },
  ];

  return (
    <>
      {/* Overlay (Mobile) */}
      {isOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md z-30 lg:hidden" />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static top-0 left-0 h-screen w-80 flex-shrink-0
          bg-[#0a0a0a] text-white z-50
          transform transition-transform duration-300 ease-in-out
          border-r border-white/5
          ${isOpen
            ? "translate-x-0 shadow-[0_0_100px_rgba(0,0,0,0.8)]"
            : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        <div className="flex flex-col h-full bg-gradient-to-b from-primary/[0.05] via-transparent to-transparent">
          {/* Logo */}
          <div className="flex items-center justify-center h-28 min-h-[7rem] border-b border-white/5">
            <img src="/1.png" alt="logo" className="size-32 object-contain filter grayscale brightness-200" />
          </div>

          {/* Menu */}
          <nav className="flex-1 overflow-y-auto px-6 pb-10 mt-8 custom-scrollbar">
            <ul className="space-y-2">
              {menuItems.map((item, index) => {
                const Icon = item.icon;

                return (
                  <li key={index}>
                    <NavLink
                      to={`/super${item.href}`}
                      className={({ isActive }) =>
                        `
                        relative flex items-center gap-4 px-5 py-4 rounded-[1.5rem]
                        transition-all duration-300 group
                        ${isActive
                          ? "bg-primary text-white shadow-[0_10px_20px_rgba(255,111,0,0.2)]"
                          : "text-gray-500 hover:text-white hover:bg-white/5"
                        }
                      `
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div
                            className={`
                              p-2.5 rounded-xl transition-all duration-300
                              ${isActive
                                ? "bg-white text-primary shadow-lg"
                                : "bg-white/5 group-hover:bg-white/10 group-hover:scale-110"
                              }
                            `}
                          >
                            <Icon className="w-5 h-5" />
                          </div>

                          <span className={`flex-1 text-[10px] font-black tracking-[0.2em] uppercase ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-white'}`}>
                            {item.label}
                          </span>

                          {item.badge && (
                            <span className={`px-2 py-0.5 text-[8px] font-black rounded-lg shadow-md uppercase ${isActive ? 'bg-secondary text-white' : 'bg-primary text-white'}`}>
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Back to Home */}
          <div className="p-8 border-t border-white/5">
            <button
              onClick={() => navigate("/")}
              className="
                group w-full flex items-center justify-center gap-3
                rounded-2xl border border-white/5
                px-5 py-4 text-[10px] font-black uppercase tracking-[0.3em]
                cursor-pointer
                text-gray-500 transition-all duration-300
                hover:text-primary
                hover:border-primary/30
                hover:bg-primary/5
                hover:shadow-[0_0_30px_rgba(255,111,0,0.1)]
              "
            >
              <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
              Terminal Exit
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
