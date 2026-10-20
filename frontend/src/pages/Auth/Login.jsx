import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [rememberMe, setRememberMe] = useState(() => {
    try {
      return Boolean(localStorage.getItem("expenseflow_remember_email"));
    } catch {
      return false;
    }
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Pre-fill remembered email if saved
  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem("expenseflow_remember_email");
      if (savedEmail) {
        setValue("email", savedEmail);
      }
    } catch (e) {
      console.error(e);
    }
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      // Handle remember me preference
      try {
        if (rememberMe) {
          localStorage.setItem("expenseflow_remember_email", data.email.trim());
        } else {
          localStorage.removeItem("expenseflow_remember_email");
        }
      } catch (e) {
        console.error(e);
      }

      const response = await loginUser({
        email: data.email.trim().toLowerCase(),
        password: data.password,
      });

      login(response.data, response.token);
      toast.success("Welcome back to ExpenseFlow 👋");
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed. Please verify your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordNotice = (e) => {
    e.preventDefault();
    toast(
      "Password recovery is managed by your system administrator. Please reach out to your team lead.",
      { icon: "ℹ️", duration: 5000 }
    );
  };

  return (
    <div className="w-full text-left" style={{ boxSizing: "border-box" }}>
      {/* 1. Header: Welcome Back Heading (40-44px desktop, ~1.15 line height) & Subtitle (18-19px, 1.5 line height) */}
      <div>
        <h1 className="text-[32px] sm:text-[38px] lg:text-[42px] font-extrabold tracking-tight text-[#102A2A] leading-[1.15]">
          Welcome Back
        </h1>
        <p className="mt-3 text-[17px] sm:text-[18px] lg:text-[19px] text-[#66736E] font-medium leading-[1.5]">
          Sign in to your ExpenseFlow account and continue managing your finances.
        </p>
      </div>

      {/* 2. Login Form: Vertical Flex with 18-20px gap, 24px space from description */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col"
        style={{ marginTop: "24px", gap: "20px" }}
      >
        {/* Email Address Field (64px height, 18-20px padding, 17-18px text, 16px corner radius) */}
        <div className="w-full flex flex-col">
          <div
            className={`relative flex items-center rounded-[16px] bg-[#F6F4ED] border transition-all duration-200 ${
              errors.email
                ? "border-[#D9573B] ring-2 ring-[#D9573B]/15"
                : "border-[#E5E2D4] hover:border-[#D5D2C2] focus-within:border-[#087F68] focus-within:ring-2 focus-within:ring-[#087F68]/15"
            }`}
            style={{
              height: "64px",
              paddingLeft: "20px",
              paddingRight: "20px",
              borderRadius: "16px",
              boxSizing: "border-box",
            }}
          >
            <Mail size={22} className="text-[#8E9B95] shrink-0 mr-3.5" />
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="Email Address"
              className="w-full bg-transparent text-[17px] sm:text-[18px] font-medium text-[#102A2A] placeholder:text-[#9AA6A0] focus:outline-none"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Enter a valid email address",
                },
              })}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-[#D9573B] font-medium mt-1.5 ml-1">
              • {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field (64px height, 18-20px padding, 17-18px text, 16px corner radius) */}
        <div className="w-full flex flex-col">
          <div
            className={`relative flex items-center rounded-[16px] bg-[#F6F4ED] border transition-all duration-200 ${
              errors.password
                ? "border-[#D9573B] ring-2 ring-[#D9573B]/15"
                : "border-[#E5E2D4] hover:border-[#D5D2C2] focus-within:border-[#087F68] focus-within:ring-2 focus-within:ring-[#087F68]/15"
            }`}
            style={{
              height: "64px",
              paddingLeft: "20px",
              paddingRight: "20px",
              borderRadius: "16px",
              boxSizing: "border-box",
            }}
          >
            <Lock size={22} className="text-[#8E9B95] shrink-0 mr-3.5" />
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Password"
              className="w-full bg-transparent text-[17px] sm:text-[18px] font-medium text-[#102A2A] placeholder:text-[#9AA6A0] focus:outline-none"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="p-1.5 text-[#8E9B95] hover:text-[#102A2A] transition-colors cursor-pointer shrink-0 ml-2"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-[#D9573B] font-medium mt-1.5 ml-1">
              • {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember Me & Forgot Password Row (20px below password, 20px above button, 15-16px text) */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="sr-only"
            />
            <div
              className={`flex h-5 w-5 items-center justify-center rounded-md border transition-all ${
                rememberMe
                  ? "border-[#104E42] bg-[#104E42] text-white shadow-xs"
                  : "border-[#D5D2C4] bg-white hover:border-[#BDB9AA]"
              }`}
            >
              {rememberMe && <Check size={13} strokeWidth={3} />}
            </div>
            <span className="text-[15px] sm:text-[16px] font-semibold text-[#102A2A]">
              Remember me
            </span>
          </label>

          <button
            type="button"
            onClick={handleForgotPasswordNotice}
            className="text-[15px] sm:text-[16px] font-bold text-[#087F68] hover:text-[#104E42] transition-colors cursor-pointer hover:underline"
          >
            Forgot password?
          </button>
        </div>

        {/* Primary Sign In Button (64-68px height, 16px corner radius, 17-18px text) */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2.5 bg-[#104E42] hover:bg-[#0D3F35] text-white font-bold shadow-sm transition-all duration-150 cursor-pointer active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            height: "66px",
            borderRadius: "16px",
            fontSize: "18px",
          }}
        >
          {loading ? (
            <div className="flex items-center gap-2.5">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Signing in...</span>
            </div>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </form>

      {/* Footer Navigation Link (24px space from button, 15-16px text) */}
      <div
        className="text-center border-t border-[#EFECE2]"
        style={{ marginTop: "24px", paddingTop: "20px" }}
      >
        <p className="text-[15px] sm:text-[16px] text-[#66736E] font-medium">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-bold text-[#087F68] hover:text-[#104E42] transition-colors ml-1 hover:underline"
          >
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;