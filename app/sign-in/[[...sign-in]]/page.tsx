"use client";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex bg-white justify-center items-center min-h-screen">
      <SignIn/>
    </div>
  );
}
