import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";

import { signupUser } from "../../services/authService";

function Signup() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

      await signupUser(userData);

      toast.success("Account created successfully");

      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Signup Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h2 className="mb-2 text-center text-3xl font-bold text-slate-800">
        Create Account
      </h2>

      <p className="mb-8 text-center text-slate-500">
        Create your ExpenseFlow account
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <div>
          <Input
            label="Name"
            type="text"
            placeholder="Enter your name"
            icon={User}
            {...register("name", {
              required: "Name is required",
              minLength: {
                value: 3,
                message: "Minimum 3 characters",
              },
            })}
          />

          {errors.name && (
            <p className="mt-1 text-sm text-red-500">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            icon={Mail}
            {...register("email", {
              required: "Email is required",
            })}
          />

          {errors.email && (
            <p className="mt-1 text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            icon={Lock}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Minimum 8 characters",
              },
            })}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-10"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>

          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="relative">
          <Input
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm password"
            icon={Lock}
            {...register("confirmPassword", {
              required: "Confirm Password is required",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
            className="absolute right-3 top-10"
          >
            {showConfirmPassword ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )}
          </button>

          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Creating Account..." : "Sign Up"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-blue-600 hover:underline"
        >
          Login
        </Link>
      </p>
    </Card>
  );
}

export default Signup;