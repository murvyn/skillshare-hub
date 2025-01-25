"use client";
import SIgnUpCard from "@/components/SIgnUpCard";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <SIgnUpCard router={router} />
    </div>
  );
}
