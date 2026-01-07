import React, { useState } from "react";
import Button from "./common/button";
import Toast from "./common/Toast";
import { SigninUser } from "../services/auth.service";
import { useNavigate } from "react-router-dom";

const TOTAL_STEPS = 3;

const MainSignup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [preview, setPreview] = useState(null);
  const [toast, setToast] = useState({
    show: false,
    type: "info",
    message: "",
  });

  const getStepMessage = () => {
    switch (step) {
      case 1:
        return "Create your Buy Cart account";
      case 2:
        return "Set up your login credentials";
      case 3:
        return "Add your address to continue";
      default:
        return "";
    }
  };

  const showToast = (message, type = "info", duration = 3000) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), duration);
  };

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    profile: null,

    email: "",
    userName: "",
    password: "",
    confirmPassword: "",

    role: "user",
    city: "",
    street: "",
    houseNo: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profile") {
      const file = files[0];
      setForm((prev) => ({ ...prev, profile: file }));
      setPreview(URL.createObjectURL(file));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    if (step === 1 && (!form.firstName || !form.lastName)) {
      showToast("First and Last Name are required", "error");
      return;
    }
    if (step === 2 && form.password !== form.confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
    showToast(`Moved to Step ${step + 1}`, "info");
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic Validation
    if (
      !form.email ||
      !form.userName ||
      !form.password ||
      !form.city ||
      !form.street ||
      !form.houseNo
    ) {
      showToast("Please fill all required fields", "error");
      return;
    }

        try {
          const res = await SigninUser(form);
          console.log("Signup Success:", res);

          showToast("Signup successful!", "success");

          setTimeout(() => navigate("/login"), 1000);
        } catch (error) {
          showToast(error.message || "Signup failed", "error");
        }
  }

  return (
    <div className="font-[var(--font-montserrat)] min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-primary/10 via-white to-accent/20 px-4">
      {toast.show && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ show: false, message: "", type: "info" })}
        />
      )}

      <div className="w-full max-w-md rounded-3xl bg-background/80 backdrop-blur-xl p-10 shadow-xl border border-white/40">
        {/* Logo */}
        <img src="/1.png" alt="Logo" className="w-28 mx-auto mb-4" />

        <h2 className="text-4xl font-bold text-center text-secondary">
          Create Account
        </h2>

        <p className="mt-3 text-center text-secondary/60">{getStepMessage()}</p>

        {/* Step Indicator */}
        <div className="flex justify-center gap-2 mb-6 mt-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-2 w-10 rounded-full ${
                step >= i ? "bg-primary" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {/* STEP 1 — Personal + Profile */}
          {step === 1 && (
            <>
              <input
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
                className="input"
              />
              <input
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
                className="input"
              />
              <div className="flex flex-col items-center gap-3">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    name="profile"
                    accept="image/*"
                    hidden
                    onChange={handleChange}
                  />
                  <div className="w-24 h-24 rounded-full border-2 border-dashed border-primary flex items-center justify-center overflow-hidden">
                    {preview ? (
                      <img
                        src={preview}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-primary text-sm">Upload</span>
                    )}
                  </div>
                </label>
              </div>
            </>
          )}

          {/* STEP 2 — Account */}
          {step === 2 && (
            <>
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="input"
              />
              <input
                name="userName"
                placeholder="Username"
                value={form.userName}
                onChange={handleChange}
                className="input"
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="input"
              />
              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="input"
              />
            </>
          )}

          {/* STEP 3 — Address */}
          {step === 3 && (
            <>
              <input
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
                className="input"
              />
              <input
                name="street"
                placeholder="Street"
                value={form.street}
                onChange={handleChange}
                className="input"
              />
              <input
                name="houseNo"
                placeholder="House No"
                value={form.houseNo}
                onChange={handleChange}
                className="input"
              />
            </>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            {step > 1 && (
              <Button
                type="button"
                content="Back"
                onClick={prevStep}
                style="w-full rounded-xl border border-primary text-primary py-3 hover:bg-primary/10 cursor-pointer"
              />
            )}

            {step < TOTAL_STEPS ? (
              <Button
                type="button"
                content="Next"
                onClick={nextStep}
                style="w-full rounded-xl bg-primary text-white py-3 hover:bg-primary/90 cursor-pointer"
              />
            ) : (
              <Button
                type="submit"
                content="Create Account"
                style="w-full rounded-xl bg-primary text-white py-3 hover:bg-primary/90 cursor-pointer"
              />
            )}
          </div>
        </form>

        <div className="border-b border-primary/30 mt-6"></div>

        <p className="mt-4 text-center text-sm text-secondary/60">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-primary font-semibold hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default MainSignup;
