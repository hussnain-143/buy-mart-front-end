import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, ShoppingCart, User, LogOut, Ban, Package } from "lucide-react";
import Toast from "./Toast";
import Button from "./button";
import { LogoutUser } from "../../services/auth.service";
import { useCart } from "../../context/CartContext";

// ================= TYPES =================
type UserType = {
  name?: string;
  profileUrl?: string;
  role?: string;
  vendor_subscription?: SubscriptionStatus;
};

type SubscriptionStatus = {
  status: "active" | "inactive" | "canceled",
  vendor?: VendorType;
};

type VendorType = {
  is_active: boolean;
};

// ================= COMPONENT =================
const Header = () => {
  const navigate = useNavigate();

  // ================= STATE =================
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [subStatus, setSubStatus] = useState<SubscriptionStatus | null>(null);
  const [vendor, setVendor] = useState<VendorType | null>(null);
  const { cartCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    type: "info",
    message: "",
  });

  // ================= REFS =================
  const profileRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ================= AUTH INIT =================
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    setIsLoggedIn(!!token);

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setSubStatus(parsedUser.vendor_subscription || null);
      setVendor(parsedUser.vendor_subscription?.vendor || null);
    }

    if (!token) {
      setUser(null);
      setSubStatus(null);
      setVendor(null);
    }
  }, []);

  // ================= NAV ITEMS =================
  const navItems = [
    { to: "/", label: "Home", end: true },
    { to: "/shop", label: "Shop" },
    { to: "/categories", label: "Categories" },
    { to: "/deals", label: "Deals" },
  ];

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative text-[13px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${isActive ? "text-accent" : "text-white/60 hover:text-white"
    }`;

  // ================= TOAST =================
  const showToast = (message: string, type = "info", duration = 3000) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);

    setToast({ show: true, message, type });

    toastTimeoutRef.current = setTimeout(() => {
      setToast({ show: false, message: "", type: "info" });
    }, duration);
  };

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  // ================= CLICK OUTSIDE =================
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ================= ESC KEY =================
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setProfileOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // ================= LOGOUT =================
  const handleLogout = async () => {
    try {
      await LogoutUser();

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setIsLoggedIn(false);
      setUser(null);
      setProfileOpen(false);

      showToast("Logged out successfully", "success");
      navigate("/home");
    } catch (error: any) {
      showToast(error?.message || "Logout failed", "error");
    }
  };

  // ================= CART COUNT =================

  // ================= RIGHT AREA =================
  const RightArea = () => (
    <>
      {!isLoggedIn ? (
        <Button
          content="Login"
          onClick={() => navigate("/login")}
          style="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary/90"
        />
      ) : (
        <>
          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((prev) => !prev)}
              aria-haspopup="true"
              aria-expanded={profileOpen}
              className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-accent text-secondary text-lg font-semibold hover:ring-4 hover:ring-accent/30 transition"
            >
              {user?.profileUrl ? (
                <img
                  src={user.profileUrl}
                  alt={user?.name || "User"}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/avatar-placeholder.png";
                  }}
                />
              ) : (
                <span className="uppercase">{(user?.name || "U").charAt(0)}</span>
              )}
            </button>

            {profileOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-3 w-56 rounded-lg bg-background shadow-2xl ring-1 ring-black/5 overflow-hidden z-50"
              >
                <NavLink
                  to="/profile"
                  className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-accent/70"
                  onClick={() => setProfileOpen(false)}
                >
                  <User size={18} /> Profile
                </NavLink>

                <NavLink
                  to="/orders"
                  className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-accent/70"
                  onClick={() => setProfileOpen(false)}
                >
                  <Package size={18} /> Orders
                </NavLink>

                <hr />

                {subStatus?.status === "active" && (
                  <Button
                    content={
                      <>
                        <Ban size={18} className="mr-2 inline" />
                        Cancel Subscription
                      </>
                    }
                    onClick={() => showToast("Cancel subscription clicked", "info")}
                    style="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                  />
                )}

                <Button
                  content={
                    <>
                      <LogOut size={18} className="mr-2 inline" />
                      Logout
                    </>
                  }
                  onClick={handleLogout}
                  style="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                />
              </div>
            )}
          </div>
          {vendor?.is_active ? (
            <Button
              content="Seller Dashboard"
              onClick={() => navigate("/seller/dashboard")}
              style="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary/90 cursor-pointer"
            />
          ) : subStatus?.status !== "active" ? (
            <Button
              content="Become a Reseller"
              onClick={() => navigate("/subscription")}
              style="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary/90 cursor-pointer"
            />
          ) : null}
          {user?.role === "admin" && (
            <Button
              content="Go to Admin Panel"
              onClick={() => navigate("/super/dashboard")}
              style="rounded-md  px-5 py-2.5 text-sm font-medium text-primary border border-primary hover:bg-primary/10 cursor-pointer"
            />
          )
          }
        </>
      )}
    </>
  );

  // ================= RENDER =================
  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Glassmorphism Background Layer */}
      <div className="absolute inset-0 bg-secondary/80 backdrop-blur-xl border-b border-white/5" />

      {toast.show && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ show: false, message: "", type: "info" })}
        />
      )}

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center group transition-transform hover:scale-105">
            <img src="/1.png" alt="Logo" className="h-24 w-auto brightness-110 contrast-125" />
          </NavLink>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-10">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `relative text-[13px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${isActive
                    ? "text-accent"
                    : "text-white/60 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-accent rounded-full" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink
              to="/cart"
              className="relative text-white/70 hover:text-white transition-colors group"
            >
              <ShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-2.5 -right-2.5 h-5 w-5 rounded-full bg-accent text-[10px] font-black flex items-center justify-center text-secondary border-2 border-secondary/80">
                  {cartCount}
                </span>
              )}
            </NavLink>

            <div className="h-6 w-[1px] bg-white/10 mx-2" />

            <RightArea />
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className="md:hidden text-white"
          >
            <Menu size={28} />
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div
            ref={mobileMenuRef}
            className="md:hidden border-t border-white/10 py-6"
          >
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={navLinkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}

              <RightArea />
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;