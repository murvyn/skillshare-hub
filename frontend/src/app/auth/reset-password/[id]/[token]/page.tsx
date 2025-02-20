"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import client from "@/api/client";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CircleCheck } from "lucide-react";
import { AxiosError } from "@/lib/types";

interface DataProps {
  password: string;
}

const schema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." })
      .regex(/^(?=.*[A-Z])/, {
        message: "Password must contain at least one uppercase letter.",
      })
      .regex(/^(?=.*[a-z])/, {
        message: "Password must contain at least one lowercase letter.",
      })
      .regex(/^(?=.*\d)/, {
        message: "Password must contain at least one number.",
      })
      .regex(/^(?=.*[!@#$%^&*])/, {
        message: "Password must contain at least one special character.",
      }),
    confirmPassword: z.string().min(8, {
      message: "Confirm password must be at least 8 characters long.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export default function ResetPassword() {
  const { id, token } = useParams();
  const { toast } = useToast();
  const [error, setError] = useState("");
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
  });
  const router = useRouter();

  useEffect(() => {
    const validateToken = async () => {
      if (!id || !token) {
        router.push("/auth/login");
        return;
      }
      try {
        await client.get(`/auth/reset-password/${id}/${token}`);
      } catch (e) {
        router.push("/auth/login");
        const error = e as unknown as AxiosError;
        toast({
          description: error.response?.data.message,
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          duration: 2000,
        });
      }
    };
    validateToken();
  }, [id, token, router]);

  const { mutateAsync, isSuccess } = useMutation({
    mutationFn: async (data: string) => {
      console.log(data);
      const response = await client.post(
        `/auth/reset-password/${id}/${token}`,
        JSON.stringify({ password: data })
      );
      return response.data;
    },
    onError: (e) => {
      setError(
        (e as unknown as AxiosError).response?.data?.message || "Something went wrong."
      );
    },
  });

  const submit: SubmitHandler<DataProps> = async (data) => {
    await mutateAsync(data.password);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Link href="/" className="text-2xl font-bold text-[#1E90FF]">
              SkillShare Hub
            </Link>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Reset Your Password
          </CardTitle>
          {isSuccess ? (
            <></>
          ) : (
            <CardDescription className="text-center">
              Enter your new password below
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center">
              <CircleCheck className="w-28 h-28 text-[#1E90FF]" />
              <p className="mt-2 text-center">
                You have successfully reset your password. Now you can log in
                with your new credentials.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(submit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    {...register("password")}
                    id="password"
                    type={"password"}
                    placeholder="••••••••"
                    className={errors.password ? "border-red-500" : ""}
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  {...register("confirmPassword")}
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className={errors.confirmPassword ? "border-red-500" : ""}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-[#1E90FF] hover:bg-blue-600"
              >
                Reset Password
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {isSuccess ? (
            <Button
              className="bg-[#1E90FF] hover:bg-blue-600"
              size={"lg"}
              onClick={() => router.push("/auth/login")}
            >
              Log in
            </Button>
          ) : (
            <p className="text-sm text-gray-600">
              Remember your password?{" "}
              <Link
                href="/auth/login"
                className="text-[#1E90FF] hover:underline"
              >
                Log in
              </Link>
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
