import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
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
import { jwtDecode } from "jwt-decode";
import { setUser } from "@/store/userSlice";
import { useDispatch } from "react-redux";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle, KeyRound } from "lucide-react";
import { Spinner } from "./Spinner";
import Cookies from "js-cookie";
import { useRouter, useSearchParams } from "next/navigation";
import { AxiosError } from "@/lib/types";
import { FcGoogle } from "react-icons/fc";

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

const LoginWithPasswordForm = ({
  setLoginWIthPasskey,
}: {
  setLoginWIthPasskey: Dispatch<SetStateAction<boolean>>;
}) => {
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const router = useRouter();
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

  useEffect(() => {
    const errorMsg = searchParams.get("error");
    if (errorMsg) {
      setError(decodeURIComponent(errorMsg));
    }
  }, [searchParams]);

  const handleGoogleLogin = () => {
    const baseUrl = "http://localhost:5000/api/auth/google";
    const authUrl = `${baseUrl}?isLogin=${true}`;
    window.location.href = authUrl;
  };

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: DataProps) => {
      const response = await client.post("/auth/login", JSON.stringify(data));
      return response.data;
    },
    onSuccess: () => {
      const token = Cookies.get("auth-x-token");
      if (token) {
        const decoded = jwtDecode(token as string);
        dispatch(setUser(decoded));
        router.push("/");
      }
    },
    onError: (e) => {
      setError(
        (e as unknown as AxiosError).response?.data?.message ||
          "Something went wrong."
      );
    },
  });

  const submit: SubmitHandler<DataProps> = async (data) => {
    await mutateAsync(data);
  };
  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
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
      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-[#1E90FF] hover:bg-blue-600"
      >
        {isPending ? (
          <Spinner size={"medium"} className="text-white" />
        ) : (
          " Log In"
        )}
      </Button>
      <div className="mt-4 space-y-2">
        <Button
          onClick={() => setLoginWIthPasskey(true)}
          type="button"
          variant="outline"
          className="w-full flex items-center justify-center"
        >
          <KeyRound className="mr-2 h-4 w-4" />
          Log in with Passkey
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center justify-center"
          onClick={handleGoogleLogin}
        >
          <FcGoogle className="mr-2" />
          Log in with Google
        </Button>
      </div>
    </form>
  );
};

export default LoginWithPasswordForm;
