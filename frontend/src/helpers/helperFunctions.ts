import { Dispatch, SetStateAction } from "react";

export const validateStep = (
  step: number,
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
    interests: string[];
  },
  setErrors: Dispatch<
    SetStateAction<{
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      confirmPassword: string;
      role: string;
      interests: string;
    }>
  >
) => {
  let isValid = true;
  const newErrors = {} as {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
    interests: string;
  };

  if (step === 1) {
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
      isValid = false;
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }
  } else if (step === 2) {
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    } else if (
      !/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)
    ) {
      newErrors.password =
        "Password must include uppercase, lowercase, number, and special character";
      isValid = false;
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }
  } else if (step === 3 && formData.interests.length === 0) {
    newErrors.interests = "Please select at least one interest";
    isValid = false;
  }

  setErrors(newErrors);
  return isValid;
};


export const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift();
  }
}