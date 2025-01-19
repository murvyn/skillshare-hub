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
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import client from "@/api/client";
import { useDispatch } from "react-redux";
import {
  setError,
  setInterests,
  setStatus,
} from "@/lib/features/interest/interestSlice";
import { useSelector } from "react-redux";
import { Checkbox } from "@/components/ui/checkbox";
import { getCookie, validateStep } from "@/helpers/helperFunctions";
import { RootState } from "@/store/store";
import { Spinner } from "@/components/Spinner";
import { jwtDecode } from "jwt-decode";
import { setUser } from "@/lib/features/user/userSlice";

export default function SignUp() {
  const dispatch = useDispatch();
  const { interests } = useSelector((state: RootState) => state.interests);
  const [currentStep, setCurrentStep] = useState(1);
  const [page, setPage] = useState(0);
  const [conditions, setContdition] = useState({
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    isLongEnough: false,
  });
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    interests: [] as string[],
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    interests: "",
  });

  const {
    mutateAsync,
    data,
    isPending: signUpLoading,
  } = useMutation({
    mutationFn: async () => {
      const response = await client.post(
        "/auth/register",
        JSON.stringify(formData)
      );
      return response.data;
    },
    onSuccess: () => {
      const token = getCookie("auth-x-token");
      if (token) {
        const decoded = jwtDecode(token);
        dispatch(setUser(decoded));
      }
    },
  });

  console.log(data);

  const validator = (value: string) => {
    setContdition({
      hasUpperCase: /[A-Z]/.test(value),
      hasLowerCase: /[a-z]/.test(value),
      hasNumber: /[0-9]/.test(value),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
      isLongEnough: value.length >= 8,
    });
  };

  const { isPending, mutate } = useMutation({
    mutationKey: ["interests"],
    mutationFn: async () => {
      const response = await client.get("/interests");
      return response.data;
    },
    onSuccess: (data) => {
      dispatch(setInterests(data));
      dispatch(setStatus("idle"));
    },
    onError: (error) => {
      dispatch(setError(error.message));
      dispatch(setStatus("error"));
    },
    onSettled: () => {
      dispatch(setStatus(isPending ? "loading" : "idle"));
    },
  });

  useEffect(() => {
    mutate();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleInterestChange = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
    setErrors((prev) => ({ ...prev, interests: "" }));
  };

  const handleNextStep = () => {
    if (validateStep(currentStep, formData, setErrors)) {
      setPage(page + 1);
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setPage(page - 1);
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(currentStep, formData, setErrors)) {
      await mutateAsync();
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Link href="/" className="text-2xl font-bold text-[#1E90FF]">
              SkillShare Hub
            </Link>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Create an account
          </CardTitle>
          <CardDescription className="text-center">
            Join our community of learners and experts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-sm font-medium text-gray-500 mb-4">
              Step {currentStep} of 3
            </div>
            {currentStep === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={errors.firstName ? "border-red-500" : ""}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm">{errors.firstName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={errors.lastName ? "border-red-500" : ""}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm">{errors.lastName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                  )}
                </div>
              </>
            )}
            {currentStep === 2 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div>
                    <Input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={(e) => {
                        handleInputChange(e);
                        validator(e.target.value);
                      }}
                      placeholder="••••••••"
                      style={{
                        padding: "10px",
                        width: "100%",
                        marginBottom: "10px",
                      }}
                    />
                    <ul
                      style={{ listStyleType: "none", padding: 0 }}
                      className="text-xs ms-3"
                    >
                      <li
                        style={{
                          color: conditions.hasUpperCase ? "green" : "red",
                        }}
                      >
                        {conditions.hasUpperCase ? "✔" : "✖"} At least one
                        uppercase letter
                      </li>
                      <li
                        style={{
                          color: conditions.hasLowerCase ? "green" : "red",
                        }}
                      >
                        {conditions.hasLowerCase ? "✔" : "✖"} At least one
                        lowercase letter
                      </li>
                      <li
                        style={{
                          color: conditions.hasNumber ? "green" : "red",
                        }}
                      >
                        {conditions.hasNumber ? "✔" : "✖"} At least one number
                      </li>
                      <li
                        style={{
                          color: conditions.hasSpecialChar ? "green" : "red",
                        }}
                      >
                        {conditions.hasSpecialChar ? "✔" : "✖"} At least one
                        special character
                      </li>
                      <li
                        style={{
                          color: conditions.isLongEnough ? "green" : "red",
                        }}
                      >
                        {conditions.isLongEnough ? "✔" : "✖"} At least 8
                        characters
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={errors.confirmPassword ? "border-red-500" : ""}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </>
            )}
            {currentStep === 3 && (
              <>
                <div className="space-y-2">
                  <Label>Interests (select at least one)</Label>
                  <div className="grid grid-cols-2 gap-2 ">
                    {interests.map((interest: { id: string; name: string }) => (
                      <div
                        key={interest.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={interest.id}
                          checked={formData.interests.includes(interest.id)}
                          onCheckedChange={() =>
                            handleInterestChange(interest.id)
                          }
                        />
                        <Label htmlFor={interest.id}>{interest.name}</Label>
                      </div>
                    ))}
                  </div>
                  {errors.interests && (
                    <p className="text-red-500 text-sm">{errors.interests}</p>
                  )}
                </div>
              </>
            )}

            <div className="flex justify-between pt-4">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevStep}
                >
                  Previous
                </Button>
              )}
              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="ml-auto"
                >
                  Next
                </Button>
              ) : (
                <Button type="submit" className="ml-auto min-w-[7rem]">
                  {signUpLoading ? (
                    <Spinner size={"medium"} className="text-white" />
                  ) : (
                    "Create Account"
                  )}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-[#1E90FF] hover:underline">
              Log in
            </Link>
          </p>
          <p className="mt-4 text-xs text-gray-500">
            By signing up, you agree to our{" "}
            <Link href="/terms" className="text-[#1E90FF] hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-[#1E90FF] hover:underline">
              Privacy Policy
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
