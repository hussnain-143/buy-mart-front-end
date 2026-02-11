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
    <footer className="relative bg-secondary text-white pt-24 pb-12 overflow-hidden">
      {/* Background Decorative Gradient */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/5 blur-[120px] rounded-full" />

      <div className="relative mx-auto max-w-7xl px-8 lg:px-12">
        {/* Upper Section - Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 pb-20 border-b border-white/5">
          {/* Brand Area */}
          <div className="lg:col-span-5 space-y-10">
            <NavLink to="/" className="inline-block group">
              <img src="/1.png" alt="BuyMart Logo" className="h-20 w-auto brightness-125 transition-transform group-hover:scale-105" />
            </NavLink>
            <p className="text-lg text-white/50 leading-relaxed font-medium max-w-md">
              Redefining the premium shopping experience with curated collections, seamless commerce, and uncompromising quality.
            </p>

            <div className="flex gap-6">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="p-3 rounded-full bg-white/5 border border-white/5 text-white/40 hover:text-accent hover:border-accent/30 hover:-translate-y-1 transition-all duration-300"
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-accent mb-8">Navigation</h3>
              <ul className="space-y-4">
                {quickLinks.map((link) => (
                  <li key={link.to}>
                    <NavLink to={link.to} className="text-sm font-bold text-white/40 hover:text-white transition-colors">
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-accent mb-8">Resources</h3>
              <ul className="space-y-4">
                {supportLinks.map((link) => (
                  <li key={link.to}>
                    <NavLink to={link.to} className="text-sm font-bold text-white/40 hover:text-white transition-colors">
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1 border-t md:border-t-0 md:border-l border-white/5 pt-12 md:pt-0 md:pl-12">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white mb-8">Contact Info</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4 group cursor-pointer">
                  <div className="p-2 rounded-lg bg-accent/10 text-accent"><Mail size={16} /></div>
                  <span className="text-sm font-bold text-white/60 group-hover:text-white transition-colors">hello@buymart.com</span>
                </div>
                <div className="flex items-center gap-4 group cursor-pointer">
                  <div className="p-2 rounded-lg bg-accent/10 text-accent"><Phone size={16} /></div>
                  <span className="text-sm font-bold text-white/60 group-hover:text-white transition-colors">+1 (234) 567 890</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
          <p>© {currentYear} BuyMart Commerce. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Sitemap</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;