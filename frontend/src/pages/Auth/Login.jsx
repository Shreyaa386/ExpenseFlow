import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";

import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const response = await loginUser(data);

      console.log("Login Response:", response);

      login(response.data, response.token);

      toast.success("Login Successful");

      navigate("/", { replace: true });
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message || "Login Failed"
      );
    } finally {
      setLoading(false);
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
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          icon={Mail}
          error={errors.email?.message}
          {...register("email", {
            required: "Email is required",
          })}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          icon={Lock}
          error={errors.password?.message}
          {...register("password", {
            required: "Password is required",
          })}
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
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