"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import LoginWithPasswordForm from "@/components/LoginWithPasswordForm";
import LoginWithPasskeyForm from "@/components/LoginWithPasskeyForm";

export default function Login() {
  const [loginWithPasskey, setLoginWIthPasskey] = useState(false);

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
            <LoginWithPasswordForm setLoginWIthPasskey={setLoginWIthPasskey}/>
          ) : (
            <LoginWithPasskeyForm setLoginWIthPasskey={setLoginWIthPasskey} />
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
