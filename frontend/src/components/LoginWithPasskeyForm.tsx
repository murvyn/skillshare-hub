import React, { Dispatch, SetStateAction, useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { z } from "zod";
import { setUser } from "@/store/userSlice";
import { jwtDecode } from "jwt-decode";
import { SubmitHandler, useForm } from "react-hook-form";
import client from "@/api/client";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { fido2Get, IWebAuthnLoginRequest } from "@ownid/webauthn";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, KeyRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import Cookies from "js-cookie";
import { AxiosError } from "@/lib/types";
import { FcGoogle } from "react-icons/fc";

interface DataProps {
  email: string;
}

const loginScheme = z.object({
  email: z.string().email(),
});

const LoginWithPasskeyForm = ({
  setLoginWIthPasskey,
}: {
  setLoginWIthPasskey: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const [passkeyStatus, setPasskeyStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [isVerifyingPasskey, setIsVerifyingPasskey] = useState(false);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DataProps>({
    resolver: zodResolver(loginScheme),
    defaultValues: {
      email: "",
    },
  });

  const handleGoogleLogin = () => {
    const baseUrl = "http://localhost:5000/api/auth/google";
    const authUrl = `${baseUrl}?isLogin=${true}`;
    window.location.href = authUrl;
  };

  const { mutateAsync: passkeyLoginFinish } = useMutation({
    mutationFn: async ({
      email,
      pubKey,
    }: {
      email: string;
      pubKey: IWebAuthnLoginRequest;
    }) => {
      const response = await client.post(
        "/auth/passkey-login/finish",
        JSON.stringify({ email, pubKey })
      );
      console.log(response);
      return response.data;
    },
    onSuccess: () => {
      setProgress(100);
      setPasskeyStatus("success");

      const token = Cookies.get("auth-x-token");
      if (token) {
        const decoded = jwtDecode(token as string);
        dispatch(setUser(decoded));
        router.push("/");
        setIsVerifyingPasskey(false);
      }
    },
    onError: (e) => {
      setPasskeyStatus("error");
      setIsVerifyingPasskey(false);
      setProgress(0);
      setErrorMessage(
        (e as unknown as AxiosError).response?.data?.message ||
          "Something went wrong."
      );
    },
  });

  const { mutateAsync: passkeyLoginStart } = useMutation({
    mutationFn: async (data: DataProps) => {
      const response = await client.post<{
        data: PublicKeyCredentialRequestOptions;
        email: string;
      }>("/auth/passkey-login/start", JSON.stringify(data));
      return response.data;
    },
    onSuccess: async ({
      data,
      email,
    }: {
      data: PublicKeyCredentialRequestOptions;
      email: string;
    }) => {
      setPasskeyStatus("success");
      setProgress(30);

      const assertion = await fido2Get(data, email);
      setProgress(50);

      await passkeyLoginFinish({
        pubKey: assertion,
        email: assertion.username,
      });
      setProgress(75);
    },
    onError: (e) => {
      setPasskeyStatus("error");
      setIsVerifyingPasskey(false);
      setProgress(0);
      setErrorMessage(
        (e as unknown as AxiosError).response?.data?.message ||
          "Something went wrong."
      );
    },
  });

  const submit: SubmitHandler<DataProps> = async (data) => {
    setIsVerifyingPasskey(true);
    setErrorMessage("");
    await passkeyLoginStart(data);
  };
  return (
    <>
      {errorMessage && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      {isVerifyingPasskey ? (
        <div className="flex flex-col items-center justify-center space-y-4">
          <AnimatePresence>
            <motion.div
              className="w-24 h-24 rounded-full border-4 border-[#1E90FF] flex items-center justify-center"
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              <KeyRound className="w-12 h-12 text-[#1E90FF]" />
            </motion.div>
            <p className="text-lg font-semibold">
              {passkeyStatus === "success"
                ? "Passkey Created Successfully!"
                : passkeyStatus === "error"
                ? errorMessage
                : "Creating your passkey..."}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <motion.div
                className="bg-[#1E90FF] h-2.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            {passkeyStatus === "idle" && (
              <p className="text-sm text-gray-500">
                This may take a few moments
              </p>
            )}
          </AnimatePresence>
        </div>
      ) : (
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
          <Button
            type="submit"
            className="w-full bg-[#1E90FF] hover:bg-blue-600"
          >
            Log In
          </Button>

          <div className="mt-4 space-y-2">
            <Button
              onClick={() => setLoginWIthPasskey(false)}
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center"
            >
              <KeyRound className="mr-2 h-4 w-4" />
              Log in with Password
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
      )}
    </>
  );
};

export default LoginWithPasskeyForm;
