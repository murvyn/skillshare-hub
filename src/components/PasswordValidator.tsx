"use client";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { UseFormRegister } from "react-hook-form";

const PasswordValidator = ({
  register,
}: {
  register: UseFormRegister<{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }>;
}) => {
  const [password, setPassword] = useState("");
  const [conditions, setContdition] = useState({
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    isLongEnough: false,
  });

  const validator = (value: string) => {
    setPassword(value);
    setContdition({
      hasUpperCase: /[A-Z]/.test(value),
      hasLowerCase: /[a-z]/.test(value),
      hasNumber: /[0-9]/.test(value),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
      isLongEnough: value.length >= 8,
    });
  };
  return (
    <div>
      <Input
        {...register("password")}
        type="password"
        value={password}
        onChange={(e) => validator(e.target.value)}
        placeholder="••••••••"
        style={{ padding: "10px", width: "100%", marginBottom: "10px" }}
      />
      <ul style={{ listStyleType: "none", padding: 0 }} className="text-xs ms-3">
        <li style={{ color: conditions.hasUpperCase ? "green" : "red" }}>
          {conditions.hasUpperCase ? "✔" : "✖"} At least one uppercase letter
        </li>
        <li style={{ color: conditions.hasLowerCase ? "green" : "red" }}>
          {conditions.hasLowerCase ? "✔" : "✖"} At least one lowercase letter
        </li>
        <li style={{ color: conditions.hasNumber ? "green" : "red" }}>
          {conditions.hasNumber ? "✔" : "✖"} At least one number
        </li>
        <li style={{ color: conditions.hasSpecialChar ? "green" : "red" }}>
          {conditions.hasSpecialChar ? "✔" : "✖"} At least one special character
        </li>
        <li style={{ color: conditions.isLongEnough ? "green" : "red" }}>
          {conditions.isLongEnough ? "✔" : "✖"} At least 8 characters
        </li>
      </ul>
    </div>
  );
};

export default PasswordValidator;
