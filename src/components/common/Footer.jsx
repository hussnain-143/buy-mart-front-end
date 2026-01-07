import React from "react";
import { NavLink } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { to: "/", label: "Home" },
    { to: "/shop", label: "Shop" },
    { to: "/categories", label: "Categories" },
    { to: "/deals", label: "Deals" },
  ];

  const supportLinks = [
    { to: "/contact", label: "Contact Us" },
    { to: "/faq", label: "FAQ" },
    { to: "/privacy", label: "Privacy Policy" },
    { to: "/terms", label: "Terms & Conditions" },
  ];

  const socialLinks = [
    { icon: Facebook, label: "Facebook", href: "#" },
    { icon: Twitter, label: "Twitter", href: "#" },
    { icon: Instagram, label: "Instagram", href: "#" },
    { icon: Linkedin, label: "LinkedIn", href: "#" },
  ];

  return (
    <footer className="bg-secondary text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
        {/* Upper Section - Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {/* Brand + Description + Social */}
          <div className="space-y-3">
            <NavLink to="/" className="inline-block">
              <img
                src="/1.png"
                alt="BuyMart Logo"
                className="h-20 w-auto"
              />
            </NavLink>
            <p className="text-sm text-white/70 leading-relaxed max-w-sm">
              BuyMart delivers premium quality products with fast shipping and exceptional customer service.
            </p>

            {/* Social Icons */}
            <div className="flex gap-5">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow us on ${social.label}`}
                    className="text-white/60 hover:text-accent transition-colors duration-200"
                  >
                    <Icon size={22} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links Columns */}
          <div className="grid grid-cols-2 gap-12 md:col-span-2 md:grid-cols-3">
            {/* Quick Links */}
            <div>
              <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-accent">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      className="text-sm text-white/70 hover:text-accent transition-colors duration-200"
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-accent">
                Support
              </h3>
              <ul className="space-y-3">
                {supportLinks.map((link) => (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      className="text-sm text-white/70 hover:text-accent transition-colors duration-200"
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter + Contact */}
            <div>
              <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-accent">
                Stay Connected
              </h3>

              <p className="text-sm text-white/70 mb-4">
                Subscribe for exclusive deals & updates
              </p>

              {/* Newsletter Form */}
              <form className="flex flex-col sm:flex-row gap-3 mb-8">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent transition"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-lg bg-accent text-secondary font-medium hover:opacity-90 transition"
                >
                  Subscribe
                </button>
              </form>

              {/* Contact Info */}
              <div className="space-y-3 text-sm text-white/70">
                <a
                  href="mailto:support@buymart.com"
                  className="flex items-center gap-3 hover:text-accent transition"
                >
                  <Mail size={18} className="text-accent" />
                  support@buymart.com
                </a>
                <a
                  href="tel:+923001234567"
                  className="flex items-center gap-3 hover:text-accent transition"
                >
                  <Phone size={18} className="text-accent" />
                  +92 300 1234567
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-white/60">
          © {currentYear} BuyMart. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;