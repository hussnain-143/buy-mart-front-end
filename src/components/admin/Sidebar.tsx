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
  ArrowLeft,
  Store,
  ShieldCheck,
  ClipboardList,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Store, label: "Vendors", href: "/vendors" },
    { icon: ShieldCheck, label: "Brand Requests", href: "/brand-requests" },
    { icon: Tag, label: "Categories", href: "/categories" },
    { icon: Users, label: "Users", href: "/users" },
    { icon: ShoppingCart, label: "Orders", href: "/orders", badge: "5" },
    { icon: ClipboardList, label: "Order Logs", href: "/order-logs" },
    { icon: Package, label: "Products", href: "/products" },
    { icon: MessageSquare, label: "Reviews", href: "/reviews" },
    { icon: BarChart3, label: "Analytics", href: "/analytics" },
    { icon: Settings, label: "Settings", href: "/settings" },
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
          fixed lg:static top-0 left-0 h-screen w-72 flex-shrink-0
          bg-secondary text-white z-50
          transform transition-transform duration-300 ease-in-out
          border-r border-white/[0.03]
          ${isOpen
            ? "translate-x-0 shadow-[0_0_100px_rgba(0,0,0,0.5)]"
            : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        <div className="flex flex-col h-full bg-gradient-to-b from-orange-500/[0.08] via-transparent to-transparent">
          {/* Logo */}
          <div className="flex items-center justify-center h-20 min-h-[5rem]">
            <img src="/1.png" alt="logo" className="size-28 object-contain" />
          </div>

          {/* Menu */}
          <nav className="flex-1 overflow-y-auto px-5 pb-10 mt-5 custom-scrollbar">
            <ul className="space-y-1 pt-3">
              {menuItems.map((item, index) => {
                const Icon = item.icon;

                return (
                  <li key={index}>
                    <NavLink
                      to={`/super${item.href}`}
                      className={({ isActive }) =>
                        `
                        relative flex items-center gap-4 px-4 py-3.5 rounded-2xl
                        transition-all duration-300 group
                        ${isActive
                          ? "bg-orange-500/10 text-orange-500 shadow-[inset_0_0_0_1px_rgba(249,115,22,0.3)]"
                          : "text-gray-500 hover:text-white hover:bg-white/5"
                        }
                      `
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <span className="absolute left-0 h-6 w-1 bg-orange-500 rounded-r-full shadow-[0_0_15px_rgba(249,115,22,0.8)]" />
                          )}

                          <div
                            className={`
                              p-2 rounded-xl transition-all duration-300
                              ${isActive
                                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30 rotate-3"
                                : "group-hover:bg-white/10 group-hover:scale-110 group-hover:-rotate-3"
                              }
                            `}
                          >
                            <Icon className="w-5 h-5" />
                          </div>

                          <span className="flex-1 text-xs font-black tracking-wider uppercase">
                            {item.label}
                          </span>

                          {item.badge && (
                            <span className="px-2 py-0.5 text-[9px] font-black bg-orange-500 text-white rounded-lg shadow-md uppercase">
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
          <div className="p-6">
            <button
              onClick={() => navigate("/")}
              className="
                group w-full flex items-center justify-center gap-2
                rounded-xl border border-white/10
                px-4 py-3 text-xs font-black uppercase tracking-wider
                cursor-pointer
                text-gray-400 transition-all duration-300
                hover:text-primary
                hover:border-primary/40
                hover:bg-primary/5
                hover:shadow-[0_0_25px_rgba(249,115,22,0.15)]
              "
            >
              <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
              Back to Home
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
