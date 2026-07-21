import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";

import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await loginUser(data);

      login(response.user, response.token);

      navigate("/");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Login Failed"
      );
    }
  };

  return (
    <Card>
      <h2 className="mb-2 text-center text-3xl font-bold text-slate-800">
        Welcome Back
      </h2>

      <p className="mb-8 text-center text-slate-500">
        Login to continue to your account
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
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

        <div>
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            icon={Lock}
            {...register("password", {
              required: "Password is required",
            })}
          />

          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button type="submit">
          Login
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="font-semibold text-blue-600 hover:underline"
        >
          Sign Up
        </Link>
      </p>
    </Card>
  );
}

export default Login;