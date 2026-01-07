import React, { useState } from "react";
import Button from "./common/button";
import Toast from "./common/Toast";
import { LoginUser } from "../services/auth.service";
import { useNavigate } from "react-router-dom";

const MainLogin = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    userName: "",
    password: "",
  });

  const [toast, setToast] = useState({
    show: false,
    type: "info",
    message: "",
  });

  const showToast = (message, type = "info", duration = 3000) => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type }),
      duration
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.userName || !form.password) {
      showToast("Username and Password are required", "error");
      return;
    }

    try {
      const res = await LoginUser(form);
      
      console.log("Login Success:", res);
      console.log("User Data:", res.user);

      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      showToast("Login successful!", "success");

      setTimeout(() => navigate("/home"), 1000);
    } catch (error) {
      showToast(error.message || "Invalid credentials", "error");
    }
  };

  return (
    <div className="font-[var(--font-montserrat)] min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-primary/10 via-white to-accent/20 px-4">
      
      {/* Toast */}
      {toast.show && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() =>
            setToast({ show: false, message: "", type: "info" })
          }
        />
      )}

      <div className="w-full max-w-md rounded-3xl bg-background/80 backdrop-blur-xl p-10 shadow-xl border border-white/40">
        
        <img src="/1.png" alt="Logo" className="w-32 mx-auto mb-6" />

        <h2 className="text-4xl font-bold text-center text-secondary">
          Welcome Back
        </h2>

        <p className="mt-3 text-center text-secondary/60">
          Login to continue to{" "}
          <span className="text-primary font-semibold">Buy Cart</span>
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <input
            type="text"
            name="userName"
            value={form.userName}
            onChange={handleChange}
            placeholder="Username"
            className="input"
          />

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="input"
          />

          <div className="flex justify-end text-sm">
            <a href="#" className="text-primary hover:underline">
              Forgot password?
            </a>
          </div>

          <Button
            type="submit"
            content="Sign In"
            style="w-full rounded-xl bg-primary py-3 text-white font-semibold hover:bg-primary/90 transition"
          />
        </form>

        <div className="border-b border-primary/30 mt-6"></div>

        <p className="mt-4 text-center text-sm text-secondary/60">
          Don’t have an account?{" "}
          <a href="/signup" className="text-primary font-semibold hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default MainLogin;
