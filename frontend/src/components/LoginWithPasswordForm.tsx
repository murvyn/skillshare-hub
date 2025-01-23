import React, { Dispatch, SetStateAction } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import Link from "next/link";
import { Button } from "./ui/button";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import client from "@/api/client";
import { getCookie } from "@/helpers/helperFunctions";
import { jwtDecode } from "jwt-decode";
import { setUser } from "@/lib/features/user/userSlice";
import { useDispatch } from "react-redux";

interface DataProps {
  email: string;
  password: string;
  rememberMe?: boolean;
}

const loginScheme = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must contain at least 8 character(s)" }),
  rememberMe: z.boolean().optional(),
});

const LoginWithPasswordForm = ({setLoginWIthPasskey}: {setLoginWIthPasskey: Dispatch<SetStateAction<boolean>>}) => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginScheme),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const { mutateAsync } = useMutation({
    mutationFn: async (data: DataProps) => {
      const response = await client.post("/auth/login", JSON.stringify(data));
      return response.data;
    },
    onSuccess: (data) => {
      console.log(data);
      const token = getCookie("auth-x-token");
      const decoded = jwtDecode(token as string);
      dispatch(setUser(decoded));
    },
  });

  const submit: SubmitHandler<DataProps> = async (data) => {
    try {
      await mutateAsync(data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="john@example.com"
          className={errors.email ? "border-red-500" : ""}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-red-500 text-xs">{errors.email.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register("password")}
            className={errors.password ? "border-red-500" : ""}
          />
        </div>
        {errors.password && (
          <p className="text-red-500 text-xs">{errors.password.message}</p>
        )}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox id="rememberMe" {...register("rememberMe")} />
          <Label
            htmlFor="rememberMe"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Remember me
          </Label>
        </div>
        <Link
          href="/auth/forgot-password"
          className="text-sm text-[#1E90FF] hover:underline"
        >
          Forgot password?
        </Link>
      </div>
      <Button type="submit" className="w-full bg-[#1E90FF] hover:bg-blue-600">
        Log In
      </Button>
      <Button type="submit" onClick={() => setLoginWIthPasskey(true)} className="w-full">
        Use Passkey
      </Button>
    </form>
  );
};

export default LoginWithPasswordForm;
