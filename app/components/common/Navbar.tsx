"use client";
import React, { useState } from "react";
import Image from "next/image";
import logo from '../../../public/logo.png'
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

export default function NavbarDemo() {
  return (
    <div className="relative w-full flex items-center justify-center">
      <Navbar className="" />
    </div>
  );
}

function Navbar({ className }: { className?: string }) {
  const router = useRouter();
  return (
    <div className="bg- flex items-center  px-4 justify-between w-full text-white">
      <div className="flex items-center gap-2">
        <Image src={logo} alt='logo' width={104} height={64} />
        
      </div>
       <header className="flex justify-end items-center p-4 gap-4 h-16">
            <SignedOut>
              <SignInButton>
                <button className="cursor-pointer bg-[#11224e] text-sm px-4 py-2 rounded-sm text-[#f87b1b] ">
                  Sign In
                </button>
                </SignInButton>
              <SignUpButton>
                <Button className="cursor-pointer">
                  Sign Up
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <button className="cursor-pointer bg-[#11224e] hover:bg-[#0e1b3e] text-white font-normal text-sm px-4 py-2 rounded-sm" onClick={() => {router.push('/report')}}>
                Track Report
              </button>
              <UserButton />
            </SignedIn>
          </header>      
    </div>
  );
}
