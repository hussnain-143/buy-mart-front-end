import React, { useState } from "react";
import Button from "./common/button";
import Toast from "./common/Toast";
import { CreateVendor } from "../services/vendor.service"
import { useNavigate } from "react-router-dom";

const VendorRegisterForm = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    shop_name: "",
    description: "",
    profile_image: null as File | null,
    cover_image: null as File | null,
  });

  const [preview, setPreview] = useState({
    profile: "",
    cover: "",
  });

  const [toast, setToast] = useState({
    show: false,
    type: "info",
    message: "",
  });

  const showToast = (message: string, type = "info", duration = 3000) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), duration);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      setForm((prev) => ({ ...prev, [name]: file }));
      setPreview((prev) => ({
        ...prev,
        [name === "profile_image" ? "profile" : "cover"]:
          URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.shop_name || !form.description) {
      showToast("Please complete all required fields", "error");
      return;
    }

    const formData = new FormData();
    formData.append("shop_name", form.shop_name);
    formData.append("description", form.description);
    if (form.profile_image) formData.append("profile_image", form.profile_image);
    if (form.cover_image) formData.append("cover_image", form.cover_image);

    try {
      await CreateVendor(formData)
      showToast("Your store has been created successfully!", "success");
      setTimeout(() => navigate("/home"), 1000);
    } catch (error: any) {
      showToast(error.message || "Something went wrong", "error");
    }
  };

  return (
    <div className="min-h-screen py-20 flex items-center justify-center bg-gradient-to-br from-primary/5 via-white to-accent/10 px-4">

      {toast.show && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() =>
            setToast({ show: false, message: "", type: "info" })
          }
        />
      )}

      <div className="w-full max-w-lg rounded-3xl bg-white/80 backdrop-blur-xl p-12 shadow-2xl border border-white/50">

        <h2 className="text-4xl text-center font-semibold text-secondary">
          Launch Your <span className="text-primary">Mart</span>
        </h2>

        <p className="mt-3 text-center text-sm text-secondary/60">
          Create your vendor space and start selling in minutes
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-8">

          <input
            type="text"
            name="shop_name"
            value={form.shop_name}
            onChange={handleChange}
            placeholder="Your shop name as customers will see it"
            className="input h-12"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Tell customers what makes your store special"
            className="input min-h-[120px]"
          />

          {/* Store Logo */}
          <div>
            <label className="text-sm font-medium text-secondary">
              Store Logo
            </label>
            <div className="mt-3 border border-dashed border-primary/60 rounded-2xl p-6 bg-white hover:bg-primary/5 transition">
              <div className="w-28 h-28 mx-auto rounded-xl overflow-hidden mb-4 border bg-gray-50 flex items-center justify-center">
                {preview.profile ? (
                  <img
                    src={preview.profile}
                    alt="Logo Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-secondary/60">
                    Logo Preview
                  </span>
                )}
              </div>
              <input
                type="file"
                name="profile_image"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-xs text-center"
              />
            </div>
          </div>

          {/* Store Banner */}
          <div>
            <label className="text-sm font-medium text-secondary">
              Store Banner
            </label>
            <div className="mt-3 border border-dashed border-primary/60 rounded-2xl p-6 bg-white hover:bg-primary/5 transition">
              <div className="w-full h-36 rounded-xl overflow-hidden mb-4 border bg-gray-50 flex items-center justify-center">
                {preview.cover ? (
                  <img
                    src={preview.cover}
                    alt="Banner Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-secondary/60">
                    Banner Preview
                  </span>
                )}
              </div>
              <input
                type="file"
                name="cover_image"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-xs text-center"
              />
            </div>
          </div>

          <Button
            type="submit"
            content="Create My Store"
            style="w-full rounded-xl bg-primary py-3 text-white font-semibold hover:bg-primary/90 shadow-lg transition"
          />
        </form>
      </div>
    </div>
  );
};

export default VendorRegisterForm;
