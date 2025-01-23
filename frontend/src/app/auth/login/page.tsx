"use client";

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
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import client from "@/api/client";
import { getCookie } from "@/helpers/helperFunctions";
import { useDispatch } from "react-redux";
import { setUser } from "@/lib/features/user/userSlice";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import LoginWithPasswordForm from "@/components/LoginWithPasswordForm";
import LoginWithPasskeyForm from "@/components/LoginWithPasskeyForm";

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

export default function Login() {
  const [loginWithPasskey, setLoginWIthPasskey] = useState(false);
  const dispatch = useDispatch();

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
            Log in to your account
          </CardTitle>
          {!loginWithPasskey ? (
            <CardDescription className="text-center">
              Enter your email and password to access your account
            </CardDescription>
          ) : (
            <CardDescription className="text-center">
              Enter your email to access your account
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {!loginWithPasskey ? (
            <LoginWithPasswordForm />
          ) : (
            <LoginWithPasskeyForm />
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            {"Don't have an account?"}
            <Link
              href="/auth/signup"
              className="text-[#1E90FF] hover:underline"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
