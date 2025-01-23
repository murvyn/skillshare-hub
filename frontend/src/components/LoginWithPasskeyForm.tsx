import React, { Dispatch, SetStateAction } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { z } from "zod";
import { setUser } from "@/lib/features/user/userSlice";
import { jwtDecode } from "jwt-decode";
import { getCookie } from "@/helpers/helperFunctions";
import { SubmitHandler, useForm } from "react-hook-form";
import client from "@/api/client";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { fido2Get, IWebAuthnLoginRequest, IWebAuthnRegisterRequest } from "@ownid/webauthn";

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
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginScheme),
    defaultValues: {
      email: "",
    },
  });

  const { mutateAsync: passkeyFinish } =
  useMutation({
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
      console.log(response)
      return response.data;
    },
    onSuccess: () => {
    //   setProgress(100);
    //   setIsCreatingPasskey(false);
    //   setPasskeyStatus("success");
    },
    onError: (e) => {
    //   setProgress(0);
    //   setIsCreatingPasskey(false);
    //   setPasskeyStatus("error");
    //   setErrorMessage(
    //     (e as AxiosError).response?.data?.message || "Something went wrong."
    //   );
    },
  });

  const { mutateAsync } = useMutation({
    mutationFn: async (data: DataProps) => {
      const response = await client.post(
        "/auth/passkey-login/start",
        JSON.stringify(data)
      );
      return response.data;
    },
    onSuccess: async ({data, email}: {data: PublicKeyCredentialRequestOptions, email: string }) => {
        const options = data;
        const assertion = await fido2Get(options, email);
        console.log("assertion", assertion)
    await passkeyFinish({pubKey: assertion, email: assertion.username})
    //   const token = getCookie("auth-x-token");
    //   const decoded = jwtDecode(token as string);
    //   dispatch(setUser(decoded));
    },
  });

  const submit: SubmitHandler<DataProps> = async (data) => {
    await mutateAsync(data);
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
      <Button type="submit" className="w-full bg-[#1E90FF] hover:bg-blue-600">
        Log In
      </Button>
      <Button
        type="submit"
        onClick={() => setLoginWIthPasskey(false)}
        className="w-full"
      >
        Use Password
      </Button>
    </form>
  );
};

export default LoginWithPasskeyForm;
