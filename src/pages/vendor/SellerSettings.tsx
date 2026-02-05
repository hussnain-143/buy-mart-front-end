import React from "react";
import { Settings, User, Bell, Shield, CreditCard, HelpCircle, LogOut, ChevronRight } from "lucide-react";

const SellerSettings: React.FC = () => {
    const sections = [
        {
            title: "Store Configuration",
            items: [
                { icon: User, label: "Account Information", sub: "Manage your personal and store contact details", active: true },
                { icon: Bell, label: "Notification Preferences", sub: "Control how you receive order and system alerts", active: false },
                { icon: Shield, label: "Login & Security", sub: "Two-factor authentication and password management", active: false },
            ]
        },
        {
            title: "Business & Payments",
            items: [
                { icon: CreditCard, label: "Payout Settings", sub: "Configure your bank account and payout schedule", active: false },
                { icon: HelpCircle, label: "Seller Support", sub: "Get help with your store or orders", active: false },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 font-sans text-secondary pb-20">
            <div className="max-w-[1000px] mx-auto px-6 lg:px-10 py-8 space-y-8">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
                            <Settings className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-secondary tracking-tight">System Settings</h1>
                            <p className="text-sm font-medium text-secondary/70">Configure your seller experience and store behavior</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {/* TOGGLE OPTIONS */}
                    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-8">
                        <div>
                            <h3 className="text-xs font-black text-secondary/30 uppercase tracking-[0.2em] mb-6">Store Status</h3>
                            <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="space-y-1">
                                    <p className="font-bold text-secondary text-sm">Vacation Mode</p>
                                    <p className="text-[10px] text-secondary/40 font-bold uppercase tracking-tight">Temporarily hide your products from the shop</p>
                                </div>
                                <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer hover:bg-gray-300 transition-colors">
                                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                                </div>
                            </div>
                        </div>

                        {sections.map((section, idx) => (
                            <div key={idx} className="space-y-4 pt-4 border-t border-gray-50">
                                <h3 className="text-xs font-black text-secondary/30 uppercase tracking-[0.2em]">{section.title}</h3>
                                <div className="space-y-3">
                                    {section.items.map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 hover:border-primary/20 cursor-pointer transition-all group">
                                            <div className="flex items-center gap-5">
                                                <div className="p-3 bg-gray-50 text-secondary/40 rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                    <item.icon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-secondary text-sm">{item.label}</p>
                                                    <p className="text-[10px] text-secondary/40 font-bold uppercase tracking-tight">{item.sub}</p>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <div className="pt-8 mt-8 border-t border-red-50">
                            <button className="w-full flex items-center justify-center gap-3 p-6 bg-red-50 text-red-600 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-red-100 transition-colors">
                                <LogOut className="w-5 h-5" />
                                Sign Out of Seller Portal
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SellerSettings;
