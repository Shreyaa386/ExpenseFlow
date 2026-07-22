import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";

import { signupUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const { confirmPassword, ...userData } = data;

      console.log("========== SIGNUP START ==========");

      const response = await signupUser(userData);

      console.log("Signup Response:", response);
      console.log("Response User:", response.data);
      console.log("Response Token:", response.token);

      login(response.data, response.token);

      console.log("========== AFTER LOGIN ==========");
      console.log("Stored Token:", localStorage.getItem("token"));
      console.log(
        "Stored User:",
        JSON.parse(localStorage.getItem("user"))
      );

      toast.success("Account created successfully 🎉");

      console.log("Before Navigate:", window.location.pathname);
      console.log("Navigating to /onboarding/welcome");

      navigate("/onboarding/welcome");

      setTimeout(() => {
        console.log(
          "Current Path After 500ms:",
          window.location.pathname
        );
      }, 500);

      setTimeout(() => {
        console.log(
          "Current Path After 2000ms:",
          window.location.pathname
        );
      }, 2000);
    } catch (error) {
      console.error("Signup Error:", error);

      toast.error(
        error?.response?.data?.message || "Signup Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-[#081B33]">
          Create Account
        </h1>

        <p className="mt-3 text-slate-500">
          Start tracking your finances today.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <Input
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          icon={User}
          error={errors.name?.message}
          {...register("name", {
            required: "Name is required",
            minLength: {
              value: 3,
              message: "Minimum 3 characters",
            },
          })}
        />

        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          icon={Mail}
          error={errors.email?.message}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Enter a valid email address",
            },
          })}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Create a password"
          icon={Lock}
          error={errors.password?.message}
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          })}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          icon={Lock}
          error={errors.confirmPassword?.message}
          {...register("confirmPassword", {
            required: "Confirm Password is required",
            validate: (value) =>
              value === password || "Passwords do not match",
          })}
        />

        <Button
          type="submit"
          loading={loading}
        >
          Create Account
        </Button>
      </form>

      <div className="mt-8 border-t border-slate-200 pt-6 text-center">
        <p className="text-slate-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-[#12C29D] transition-colors hover:text-[#0E9F82]"
          >
            Login
          </Link>
        </p>
      </div>
    </Card>
  );
}

export default Signup;