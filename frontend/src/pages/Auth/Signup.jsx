import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Check, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { signupUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
  });

  const password = watch("password") || "";

  // Password requirement checklist checks
  const passwordRequirements = [
    { label: "8+ characters", met: password.length >= 8 },
    { label: "Uppercase letter (A-Z)", met: /[A-Z]/.test(password) },
    { label: "Lowercase letter (a-z)", met: /[a-z]/.test(password) },
    { label: "Number (0-9)", met: /\d/.test(password) },
    {
      label: "Special symbol (@$!%*?&#^_-+~=)",
      met: /[@$!%*?&#^_\-+~=]/.test(password),
    },
  ];

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setServerError("");

      const userData = {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
      };

      const response = await signupUser(userData);
      login(response.data, response.token);
      toast.success("Account created successfully 🎉");
      navigate("/onboarding/welcome");
    } catch (error) {
      let errorMessage = "Signup failed. Please try again.";

      if (!error?.response) {
        errorMessage =
          "Cannot reach the server. Please verify your connection and ensure backend is running.";
      } else if (error.response.status === 409) {
        errorMessage =
          "This email is already registered. Please sign in or use a different email.";
      } else if (error.response.data?.message) {
        errorMessage = error.response.data.message;
      }

      setServerError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full text-left" style={{ boxSizing: "border-box" }}>
      {/* 1. Heading (40-44px desktop, ~1.15 line height) & Subtitle (18-19px, 1.5 line height) */}
      <div>
        <h1 className="text-[32px] sm:text-[38px] lg:text-[42px] font-extrabold tracking-tight text-[#102A2A] leading-[1.15]">
          Create an Account
        </h1>
        <p className="mt-3 text-[17px] sm:text-[18px] lg:text-[19px] text-[#66736E] font-medium leading-[1.5]">
          Start managing your money with clarity, confidence, and intelligent insights.
        </p>
      </div>

      {/* 2. Inline Server Error Alert */}
      {serverError && (
        <div
          role="alert"
          className="mt-4 flex items-start gap-2.5 rounded-[16px] border border-[#D9573B]/30 bg-[#D9573B]/10 p-4 text-xs sm:text-sm text-[#D9573B]"
        >
          <AlertCircle size={20} className="mt-0.5 shrink-0 text-[#D9573B]" />
          <div className="flex-1">
            <span className="font-bold text-[#D9573B]">Signup Notice: </span>
            <span>{serverError}</span>
          </div>
        </div>
      )}

      {/* 3. Signup Form: Vertical Flex with 20px gap, 24px space from description */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col"
        style={{ marginTop: "24px", gap: "20px" }}
      >
        {/* Full Name Field (64px height, 18-20px padding, 17-18px text, 16px corner radius) */}
        <div className="w-full flex flex-col">
          <div
            className={`relative flex items-center rounded-[16px] bg-[#F6F4ED] border transition-all duration-200 ${
              errors.name
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
            <User size={22} className="text-[#8E9B95] shrink-0 mr-3.5" />
            <input
              id="signup-name"
              type="text"
              autoComplete="name"
              placeholder="Full Name (e.g. Alex Morgan)"
              className="w-full bg-transparent text-[17px] sm:text-[18px] font-medium text-[#102A2A] placeholder:text-[#9AA6A0] focus:outline-none"
              {...register("name", {
                required: "Full name is required",
                minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters",
                },
                maxLength: {
                  value: 30,
                  message: "Name cannot exceed 30 characters",
                },
              })}
            />
          </div>
          {errors.name && (
            <p className="text-xs text-[#D9573B] font-medium mt-1.5 ml-1">
              • {errors.name.message}
            </p>
          )}
        </div>

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
              id="signup-email"
              type="email"
              autoComplete="email"
              placeholder="Email Address"
              className="w-full bg-transparent text-[17px] sm:text-[18px] font-medium text-[#102A2A] placeholder:text-[#9AA6A0] focus:outline-none"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Please enter a valid email address",
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
              id="signup-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Password (min 8 characters)"
              className="w-full bg-transparent text-[17px] sm:text-[18px] font-medium text-[#102A2A] placeholder:text-[#9AA6A0] focus:outline-none"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                validate: (value) =>
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^_\-+~=])/.test(
                    value
                  ) ||
                  "Must include uppercase, lowercase, number, and special character (@$!%*?&#^_-+~=)",
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

          {/* Interactive Password Requirements Checklist */}
          {password.length > 0 && (
            <div className="mt-2.5 rounded-[16px] border border-[#E5E2D4] bg-[#F6F4ED]/80 p-4 space-y-2 transition-all">
              <p className="text-xs font-bold uppercase tracking-wider text-[#66736E]">
                Password Strength Checklist
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {passwordRequirements.map((req, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-2 text-xs transition-colors ${
                      req.met
                        ? "text-[#087F68] font-bold"
                        : "text-[#66736E] font-medium"
                    }`}
                  >
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
                        req.met
                          ? "bg-[#087F68]/20 text-[#087F68]"
                          : "bg-[#E5E2D4] text-[#8E9B95]"
                      }`}
                    >
                      {req.met ? <Check size={11} strokeWidth={3} /> : "•"}
                    </span>
                    <span>{req.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password Field (64px height, 18-20px padding, 17-18px text, 16px corner radius) */}
        <div className="w-full flex flex-col">
          <div
            className={`relative flex items-center rounded-[16px] bg-[#F6F4ED] border transition-all duration-200 ${
              errors.confirmPassword
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
              id="signup-confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Confirm Password"
              className="w-full bg-transparent text-[17px] sm:text-[18px] font-medium text-[#102A2A] placeholder:text-[#9AA6A0] focus:outline-none"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              className="p-1.5 text-[#8E9B95] hover:text-[#102A2A] transition-colors cursor-pointer shrink-0 ml-2"
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-[#D9573B] font-medium mt-1.5 ml-1">
              • {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Primary Create Account Button (64-68px height, 16px corner radius, 17-18px text) */}
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
              <span>Creating your account...</span>
            </div>
          ) : (
            <>
              <span>Create Account</span>
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
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-[#087F68] hover:text-[#104E42] transition-colors ml-1 hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;