import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { apiClient } from "@/utils/api";
import { API_URL, REGISTER_URL } from "@/utils/constants";
import { FcGoogle } from "react-icons/fc";
import { registerSchema } from "../../../../types/auth/userauth";

const Register = ({ setAuthState }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setAuthState("Login");
  };

  const form = useForm({
    resolver: zodResolver(registerSchema),
  });

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/api/v1/auth/user/google`;
  };

  const { errors, isSubmitting, isValid } = form.formState;

  const onSubmit = async (values) => {
    try {
      setIsLoading(true);
      const response = await apiClient.post(REGISTER_URL, {
        email: values.email,
        password: values.password,
      });
      const data = response.data;

      if (data) {
        toast.success("User registration successful");
        setTimeout(() => {
          setAuthState("Login");
        }, 1000);
      }
    } catch (error) {
      toast.error("Error creating User");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex-1">
      <section className="mt-4 mb-3">
        <h1 className="text-center text-2xl font-semibold">Acquel</h1>
        <p className="text-center text-muted-foreground text-lg">A Online Learning Platform</p>
      </section>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-4/5 lg:px-10 sm:px-2 mx-auto space-y-2">
        <input
          id="email"
          placeholder="Email Address"
          className="w-full border py-3 px-2 outline-none rounded-md border-neutral-400"
          type="text"
          {...form.register("email")}
        />
        <label htmlFor="email">
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </label>

        <input
          id="password"
          placeholder="Password"
          className="border py-3 px-2 rounded-md outline-none border-neutral-400"
          type="password"
          {...form.register("password")}
        />
        <label htmlFor="password">
          {errors.password && <p className="text-xs text-red-500 mb-2">{errors.password.message}</p>}
        </label>

        <input
          id="confirmPassword"
          placeholder="Confirm Password"
          className="border py-3 px-2 rounded-md outline-none border-neutral-400"
          type="password"
          {...form.register("confirmPassword")}
        />
        <label htmlFor="confirmPassword">
          {errors.confirmPassword && <p className="text-xs text-red-500 mb-2">{errors.confirmPassword.message}</p>}
        </label>

        <button
          type="submit"
          disabled={!isValid || isSubmitting || isLoading}
          className={cn(
            "bg-gradient-to-r from-purple-500 to-purple-600 px-2 py-3 rounded-md text-white text-lg flex items-center justify-center",
            (!isValid || isSubmitting || isLoading) && "opacity-50 cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Registering...
            </>
          ) : (
            "Register"
          )}
        </button>
      </form>
      <button
        onClick={handleGoogleLogin}
        className="mx-auto mt-3 px-4 py-3 flex justify-center items-center gap-2 text-neutral-700 text-sm font-medium bg-white hover:bg-neutral-100 border border-neutral-300 rounded-lg shadow-sm transition-colors duration-200"
      >
        <FcGoogle className="flex-shrink-0" size={22} />
        Continue with Google
      </button>

      <p className="text-center mt-6 text-sm">
        Already a user?{" "}
        <span onClick={handleLogin} className="underline decoration-purple-600 text-purple-600 cursor-pointer">
          Login
        </span>
      </p>
    </section>
  );
};

export default Register;
