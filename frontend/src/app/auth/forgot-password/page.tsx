"use client";

import { useState } from "react";
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
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import client from "@/api/client";
import { AxiosError } from "axios";
import { Spinner } from "@/components/Spinner";

interface DataProps {
  email: string;
}

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export default function ForgotPassword() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["forgot-password"],
    mutationFn: async (data: DataProps) => {
      const response = await client.post(
        "/auth/forgot-password",
        JSON.stringify(data)
      );
      return response.data;
    },
    onSuccess: () => {
      setSuccess(true);
    },
    onError: (e) => {
      const error = e as AxiosError;
      console.error(error);
      setError(error.response.data.message);
    },
  });

  const submit: SubmitHandler<DataProps> = async (data) => {
    setSuccess(false);
    await mutateAsync(data);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">
                Forgot Password
              </CardTitle>
              <Link
                href="/auth/login"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="h-4 w-4 inline mr-1" />
                Back to Login
              </Link>
            </div>
            <CardDescription>
              Enter your email address and we&apos;ll send you a link to reset
              your password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert variant={"default"} className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                  You will receive a password reset email shortly.
                </AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit(submit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email.message}</p>
                )}
              </div>
              <Button
                disabled={isPending}
                type="submit"
                className="w-full bg-[#1E90FF] hover:bg-blue-600"
              >
                {isPending ? (
                  <Spinner size={"medium"} className="text-white" />
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-center w-full">
              Remember your password?
              <Link
                href="/auth/login"
                className="text-[#1E90FF] hover:underline"
              >
                Log in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
