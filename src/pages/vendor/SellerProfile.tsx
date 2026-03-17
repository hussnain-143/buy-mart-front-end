import React, { useEffect, useState } from "react";
import { Store, Camera, Mail, Phone, MapPin, Save, ShieldCheck, Loader, RefreshCcw } from "lucide-react";
import { GetMyVendor, UpdateVendorProfile } from "../../services/vendor.service";
import Toast from "../../components/common/Toast";

const SellerProfile: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [vendor, setVendor] = useState<any>(null);
    const [formData, setFormData] = useState({
        shop_name: "",
        slug: "",
        desc: "",
        support_email: "",
        support_phone: "",
        shop_address: "",
    });
    const [images, setImages] = useState({
        profile_image: null as File | null,
        cover_image: null as File | null,
    });
    const [previews, setPreviews] = useState({
        profile: "",
        cover: "",
    });
    const [toast, setToast] = useState({ show: false, message: "", type: "info" as "info" | "success" | "error" });

    const showToast = (message: string, type: "info" | "success" | "error" = "info") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type: "info" }), 3000);
    };

    useEffect(() => {
        const fetchVendor = async () => {
            try {
                const res = await GetMyVendor();
                if (res.success) {
                    setVendor(res.data);
                    setFormData({
                        shop_name: res.data.shop_name || "",
                        slug: res.data.slug || "",
                        desc: res.data.desc || "",
                        support_email: res.data.support_email || "",
                        support_phone: res.data.support_phone || "",
                        shop_address: res.data.shop_address || "",
                    });
                    setPreviews({
                        profile: res.data.profile_image || "",
                        cover: res.data.cover_image || "",
                    });
                }
            } catch (error: any) {
                console.error("Error fetching vendor:", error);
                showToast(error.message || "Failed to load store profile", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchVendor();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'profile_image' | 'cover_image') => {
        const file = e.target.files?.[0];
        if (file) {
            setImages(prev => ({ ...prev, [type]: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews(prev => ({ ...prev, [type === 'profile_image' ? 'profile' : 'cover']: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                data.append(key, value);
            });
            if (images.profile_image) data.append("profile_image", images.profile_image);
            if (images.cover_image) data.append("cover_image", images.cover_image);

            const res = await UpdateVendorProfile(data);
            if (res.success) {
                showToast("Store profile updated successfully", "success");
                setVendor(res.data);
            }
        } catch (error: any) {
            console.error("Error updating vendor:", error);
            showToast(error.message || "Update failed", "error");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
                <Loader className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 font-sans text-secondary pb-20">
            {toast.show && <Toast type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />}
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
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 ${vendor?.is_active ? 'bg-green-50 text-green-600 border-green-100' : 'bg-yellow-50 text-yellow-600 border-yellow-100'} rounded-xl border`}>
                            <ShieldCheck className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">{vendor?.is_active ? 'VERIFIED SELLER' : 'PENDING VERIFICATION'}</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* LEFT COLUMN: Visuals */}
                    <div className="space-y-8">
                        {/* LOGO CARD */}
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center">
                            <h3 className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.2em] mb-6">Store Logo</h3>
                            <div className="relative inline-block group">
                                <div className="w-32 h-32 rounded-3xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-primary/50">
                                    {previews.profile ? (
                                        <img src={previews.profile} alt="logo" className="w-full h-full object-cover group-hover:opacity-40 transition-opacity" />
                                    ) : (
                                        <Store className="w-10 h-10 text-gray-200" />
                                    )}
                                    <label className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <Camera className="w-8 h-8 text-primary shadow-sm" />
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'profile_image')} />
                                    </label>
                                </div>
                                <div className="absolute -bottom-2 -right-2 p-2 bg-white border border-gray-100 rounded-xl shadow-lg text-primary">
                                    <Camera className="w-4 h-4" />
                                </div>
                            </div>
                            <p className="mt-6 text-[10px] text-secondary/40 font-bold leading-relaxed px-4 uppercase tracking-tighter">
                                Recommended size: 512x512px. JPG or PNG.
                            </p>
                        </div>

                        {/* BANNER CARD */}
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.2em] mb-4">Store Banner</h3>
                            <div className="relative group rounded-2xl overflow-hidden aspect-video bg-gray-50 border border-gray-100">
                                {previews.cover ? (
                                    <img src={previews.cover} alt="banner" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Camera className="w-10 h-10 text-gray-200" />
                                    </div>
                                )}
                                <label className="absolute inset-0 bg-secondary/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <div className="px-4 py-2 bg-white/90 backdrop-blur rounded-xl text-[10px] font-black uppercase tracking-widest text-primary shadow-xl">Update Banner</div>
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'cover_image')} />
                                </label>
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
                                        <input type="text" name="shop_name" value={formData.shop_name} onChange={handleChange} className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:ring-1 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all shadow-inner" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.1em] ml-1">Store URL Slug</label>
                                        <div className="relative flex items-center">
                                            <span className="absolute left-5 text-[10px] font-black text-secondary/20 uppercase tracking-tighter">buymart.com/</span>
                                            <input type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full pl-24 pr-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:ring-1 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all shadow-inner" placeholder="store-name" />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.1em] ml-1">Store Description</label>
                                        <textarea name="desc" value={formData.desc} onChange={handleChange} rows={4} className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:ring-1 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all shadow-inner resize-none" placeholder="Tell customers about your store..."></textarea>
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
                                            <input type="email" name="support_email" value={formData.support_email} onChange={handleChange} className="w-full pl-12 pr-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:ring-1 focus:ring-primary/50 outline-none transition-all shadow-inner" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.1em] ml-1">Support Phone</label>
                                        <div className="relative group">
                                            <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                                            <input type="tel" name="support_phone" value={formData.support_phone} onChange={handleChange} className="w-full pl-12 pr-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:ring-1 focus:ring-primary/50 outline-none transition-all shadow-inner" />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.1em] ml-1">Office Address</label>
                                        <div className="relative group">
                                            <MapPin className="absolute left-5 top-4 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                                            <textarea name="shop_address" value={formData.shop_address} onChange={handleChange} rows={2} className="w-full pl-12 pr-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:ring-1 focus:ring-primary/50 outline-none transition-all shadow-inner resize-none" placeholder="Full business address..."></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-10 flex items-center justify-end gap-4">
                                <button type="button" onClick={() => window.location.reload()} className="px-8 py-4 bg-gray-50 text-secondary/40 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all flex items-center gap-2">
                                    <RefreshCcw className="w-3 h-3" /> Discard
                                </button>
                                <button type="submit" disabled={saving} className="flex items-center gap-3 px-10 py-4 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/30 hover:shadow-primary/40 active:scale-95 transition-all disabled:opacity-50">
                                    {saving ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    {saving ? "SAVING..." : "Publish Updates"}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default SellerProfile;
