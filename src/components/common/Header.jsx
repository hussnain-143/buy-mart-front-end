import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import {
  Menu,
  ShoppingCart,
  User,
  LogOut,
  Settings,
  Package,
} from "lucide-react";

import Button from "./button";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // 🔐 Replace with real auth later
  const isLoggedIn = true;
  const user = { name: "Hussnain Ahmed" };

  const profileRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setProfileOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const navLinkClass = ({ isActive }) =>
    `relative text-sm font-medium transition-colors duration-200 ${
      isActive ? "text-accent" : "text-white hover:text-accent"
    }`;

  const navItems = [
    { to: "/", label: "Home", end: true },
    { to: "/shop", label: "Shop" },
    { to: "/categories", label: "Categories" },
    { to: "/deals", label: "Deals" },
  ];

  const handleLogout = () => {
    // TODO: Add real logout logic
    console.log("Logged out");
    setProfileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-secondary shadow-lg">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center">
            <img src="/1.png" alt="Your Store Logo" className="h-25 w-auto" />
          </NavLink>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
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

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-6" ref={mobileMenuRef}>
            {/* Cart */}
            <NavLink
              to="/cart"
              className="relative text-white hover:text-accent transition"
              aria-label="Shopping cart with 2 items"
            >
              <ShoppingCart size={24} />
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                2
              </span>
            </NavLink>

            {/* Auth */}
            {!isLoggedIn ? (
              <Button
                content="Login"
                onClick={() => (window.location.href = "/login")} // or use navigate
                style="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary/90"
              />
            ) : (
              <>
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    aria-label="Open user menu"
                    aria-expanded={profileOpen}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-secondary text-lg font-semibold hover:ring-4 hover:ring-accent/30 transition"
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </button>

                  {/* Profile Dropdown */}
                  {profileOpen && (
                    <div className="absolute right-0 mt-3 w-56 origin-top-right rounded-lg bg-background shadow-2xl ring-1 ring-black ring-opacity-5">
                      <div className="py-2">
                        <NavLink
                          to="/profile"
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-accent/70 transition"
                          onClick={() => setProfileOpen(false)}
                        >
                          <User size={18} /> Profile
                        </NavLink>
                        <NavLink
                          to="/orders"
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-accent/70 transition"
                          onClick={() => setProfileOpen(false)}
                        >
                          <Package size={18} /> Orders
                        </NavLink>
                        <NavLink
                          to="/settings"
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-accent/70 transition"
                          onClick={() => setProfileOpen(false)}
                        >
                          <Settings size={18} /> Settings
                        </NavLink>
                        <hr className="my-1 border-gray-200" />
                        {/* Logout using your Button */}
                        <Button
                          type="button"
                          content={
                            <>
                              <LogOut size={18} className="inline mr-3" />
                              Logout
                            </>
                          }
                          onClick={handleLogout}
                          style="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
                        />
                      </div>
                    </div>
                  )}
                </div>
                <Button
                  content="Become a sellor"
                  onClick={() => (window.location.href = "/login")}
                  style="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary/90 cursor-pointer"
                />
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle mobile menu"
              aria-expanded={menuOpen}
              className="md:hidden text-white hover:text-accent transition"
            >
              <Menu size={28} />
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <>
            <nav className="md:hidden border-t border-white/10 py-8">
              <div className="flex flex-col space-y-5">
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
              </div>
            </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-6" ref={mobileMenuRef}>
            
            {/* Cart */}
            <NavLink
              to="/cart"
              className="relative text-white hover:text-accent transition"
              aria-label="Shopping cart with 2 items"
            >
              <ShoppingCart size={24} />
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                2
              </span>
            </NavLink>

            {/* Auth */}
            {!isLoggedIn ? (
              <Button
                content="Login"
                onClick={() => (window.location.href = "/login")} // or use navigate
                style="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary/90"
              />
            ) : (
              <>
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    aria-label="Open user menu"
                    aria-expanded={profileOpen}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-secondary text-lg font-semibold hover:ring-4 hover:ring-accent/30 transition"
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </button>

                  {/* Profile Dropdown */}
                  {profileOpen && (
                    <div className="absolute right-0 mt-3 w-56 origin-top-right rounded-lg bg-background shadow-2xl ring-1 ring-black ring-opacity-5">
                      <div className="py-2">
                        <NavLink
                          to="/profile"
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-accent/70 transition"
                          onClick={() => setProfileOpen(false)}
                        >
                          <User size={18} /> Profile
                        </NavLink>
                        <NavLink
                          to="/orders"
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-accent/70 transition"
                          onClick={() => setProfileOpen(false)}
                        >
                          <Package size={18} /> Orders
                        </NavLink>
                        <NavLink
                          to="/settings"
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-accent/70 transition"
                          onClick={() => setProfileOpen(false)}
                        >
                          <Settings size={18} /> Settings
                        </NavLink>
                        <hr className="my-1 border-gray-200" />
                        {/* Logout using your Button */}
                        <Button
                          type="button"
                          content={
                            <>
                              <LogOut size={18} className="inline mr-3" />
                              Logout
                            </>
                          }
                          onClick={handleLogout}
                          style="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
                        />
                      </div>
                    </div>
                  )}
                </div>
                <Button
                  content="Become a sellor"
                  onClick={() => (window.location.href = "/login")}
                  style="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary/90 cursor-pointer"
                />
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle mobile menu"
              aria-expanded={menuOpen}
              className="md:hidden text-white hover:text-accent transition"
            >
              <Menu size={28} />
            </button>
          </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
