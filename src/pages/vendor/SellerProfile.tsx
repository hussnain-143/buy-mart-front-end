import React from "react";
import { Store, Camera, Mail, Phone, MapPin, Save, ShieldCheck } from "lucide-react";

const SellerProfile: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50/50 font-sans text-secondary pb-20">
            <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-8 space-y-8">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
                            <Store className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-secondary tracking-tight">Store Profile</h1>
                            <p className="text-sm font-medium text-secondary/70">Manage your public storefront identity</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 rounded-xl border border-green-100">
                            <ShieldCheck className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">VERIFIED SELLER</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* LEFT COLUMN: Visuals */}
                    <div className="space-y-8">
                        {/* LOGO CARD */}
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center">
                            <h3 className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.2em] mb-6">Store Logo</h3>
                            <div className="relative inline-block group">
                                <div className="w-32 h-32 rounded-3xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-primary/50">
                                    <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop" alt="logo" className="w-full h-full object-cover opacity-80 group-hover:opacity-40 transition-opacity" />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <Camera className="w-8 h-8 text-primary shadow-sm" />
                                    </div>
                                </div>
                                <button className="absolute -bottom-2 -right-2 p-2 bg-white border border-gray-100 rounded-xl shadow-lg text-primary hover:scale-110 transition-transform">
                                    <Camera className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="mt-6 text-[10px] text-secondary/40 font-bold leading-relaxed px-4 uppercase tracking-tighter">
                                Recommended size: 512x512px. JPG or PNG.
                            </p>
                        </div>

                        {/* BANNER CARD */}
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.2em] mb-4">Store Banner</h3>
                            <div className="relative group rounded-2xl overflow-hidden aspect-video bg-gray-50 border border-gray-100">
                                <img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=225&fit=crop" alt="banner" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-secondary/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <div className="px-4 py-2 bg-white/90 backdrop-blur rounded-xl text-[10px] font-black uppercase tracking-widest text-primary shadow-xl">Update Banner</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Info */}
                    <div className="xl:col-span-2 space-y-8">
                        <div className="bg-white p-8 md:p-10 rounded-2xl border border-gray-100 shadow-sm space-y-8">
                            <div>
                                <h3 className="text-sm font-bold text-secondary mb-6 flex items-center gap-2">
                                    <Store className="w-4 h-4 text-primary" />
                                    General Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.1em] ml-1">Shop Name</label>
                                        <input type="text" defaultValue="TechNova Solutions" className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:ring-1 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all shadow-inner" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.1em] ml-1">Store URL</label>
                                        <div className="relative flex items-center">
                                            <span className="absolute left-5 text-[10px] font-black text-secondary/20">buymart.com/</span>
                                            <input type="text" defaultValue="technova" className="w-full pl-28 pr-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:ring-1 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all shadow-inner" />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.1em] ml-1">Store Description</label>
                                        <textarea rows={4} className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:ring-1 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all shadow-inner resize-none">Providing the latest and most advanced technology solutions for modern lives. We specialize in high-end computing and consumer electronics.</textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-gray-100">
                                <h3 className="text-sm font-bold text-secondary mb-6 flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-primary" />
                                    Contact & Support
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.1em] ml-1">Support Email</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                                            <input type="email" defaultValue="support@technova.com" className="w-full pl-12 pr-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:ring-1 focus:ring-primary/50 outline-none transition-all shadow-inner" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.1em] ml-1">Support Phone</label>
                                        <div className="relative group">
                                            <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                                            <input type="tel" defaultValue="+1 (555) 123-4567" className="w-full pl-12 pr-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:ring-1 focus:ring-primary/50 outline-none transition-all shadow-inner" />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.1em] ml-1">Office Address</label>
                                        <div className="relative group">
                                            <MapPin className="absolute left-5 top-4 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                                            <textarea rows={2} className="w-full pl-12 pr-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:ring-1 focus:ring-primary/50 outline-none transition-all shadow-inner resize-none">123 Tech Avenue, Silicon Valley, CA 94025, United States</textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-10 flex items-center justify-end gap-4">
                                <button className="px-8 py-4 bg-gray-50 text-secondary/40 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all">Discard Changes</button>
                                <button className="flex items-center gap-3 px-10 py-4 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/30 hover:shadow-primary/40 active:scale-95 transition-all">
                                    <Save className="w-4 h-4" />
                                    Publish Updates
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SellerProfile;
