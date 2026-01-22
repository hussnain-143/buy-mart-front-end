import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  ShoppingCart,
  User,
  LogOut,
  Settings,
  Package,
} from "lucide-react";
import Toast from "./Toast";
import Button from "./button";
import { LogoutUser } from "../../services/auth.service";

const Header = () => {
  const navigate = useNavigate();

  // ================= STATE =================
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  type User = {
    name?: string;
    profileUrl?: string;
    // add other user properties as needed
  };

  const [user, setUser] = useState<User | null>(null);
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
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ================= AUTH INIT =================
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    setIsLoggedIn(!!token);
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, []);

  // ================= NAV ITEMS =================
  const navItems = [
    { to: "/", label: "Home", end: true },
    { to: "/shop", label: "Shop" },
    { to: "/categories", label: "Categories" },
    { to: "/deals", label: "Deals" },
  ];

  const navLinkClass = ({ isActive } : { isActive: boolean }) =>
    `relative text-sm font-medium transition-colors duration-200 ${
      isActive ? "text-accent" : "text-white hover:text-accent"
    }`;

  // ================= TOAST =================
  const showToast = (message : string , type = "info", duration = 3000) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);

    setToast({ show: true, message, type });

    toastTimeoutRef.current = setTimeout(() => {
      setToast({ show: false, message: "", type: "info" });
    }, duration);
  };

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  // ================= CLICK OUTSIDE =================
  useEffect(() => {
    const handleClickOutside = (event : MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }

      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ================= ESC KEY =================
  useEffect(() => {
    const handleEscape = (e : KeyboardEvent) => {
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

      showToast("Logged out successfully", "success");
      navigate("/login");
    } catch (error : any) {
      showToast(error?.message || "Logout failed", "error");
    }
  };

  const cartCount = 2; // Replace with real count later

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
                <span className="uppercase">
                  {(user?.name || "U").charAt(0)}
                </span>
              )}
            </button>

            {profileOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-3 w-56 rounded-lg bg-background shadow-2xl ring-1 ring-black/5"
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

                <NavLink
                  to="/settings"
                  className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-accent/70"
                  onClick={() => setProfileOpen(false)}
                >
                  <Settings size={18} /> Settings
                </NavLink>

                <hr />

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

          <Button
            content="Become a Seller"
            onClick={() => navigate("/login")}
            style="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary/90"
          />
        </>
      )}
    </>
  );

  // ================= RENDER =================
  return (
    <header className="sticky top-0 z-50 bg-secondary shadow-lg">
      {toast.show && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ show: false, message: "", type: "info" })}
        />
      )}

      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center">
            <img src="/1.png" alt="Logo" className="h-25 w-auto" />
          </NavLink>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-10">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={navLinkClass}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink
              to="/cart"
              className="relative text-white hover:text-accent"
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-xs flex items-center justify-center text-white">
                  {cartCount}
                </span>
              )}
            </NavLink>

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