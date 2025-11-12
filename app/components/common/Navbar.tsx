"use client";
import React, { useState } from "react";
import Image from "next/image";
import logo from '../../../public/logo.png'
import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";
import credit from '../../../public/credit.png'
import king from '../../../public/king.png'
import avatar from '../../../public/user.svg'
import { signOut } from "next-auth/react";
import { Sidebar } from "lucide-react";
import Dropdown from "./Dropdown";
import { Button } from "../ui/button";
import {
  ClerkProvider,
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
  const router = useRouter()

  const [showMenu, setShowMenu] = useState(false);
  const [open, setOpen] = useState(false);

  // const { data: session, status } = useSession();
  // console.log(session)
  // const email = session?.user?.email
  // const image = session?.user?.image

  const isAuthenticated = status === "authenticated";
  const isPremium = false;
  // console.log("image source -> ", image)




  return (
    <div className="bg- flex items-center  px-4 justify-between w-full text-white">
      <div className="flex items-center gap-2">
        <Image src={logo} alt='logo' width={104} height={64} />
        
      </div>
       <header className="flex justify-end items-center p-4 gap-4 h-16">
            <SignedOut>
              <SignInButton />
              <SignUpButton>
                <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
      {/* <div className="md:flex hidden items-center gap-2">
        {isAuthenticated ? (
          <>
              <div className="rounded-sm bg-green-600 px-4 cursor-pointer  py-2 text-xs font-bold flex justify-center items-center gap-2">
                <p className="">View Trend</p>
              </div>
            
               
            <Image src={image ? image : avatar} width={12} height={12} className="cursor-pointer rounded-full w-8" onClick={() => setShowMenu(!showMenu)} alt="avatar" />
            {!showMenu && <Dropdown email={email} />}
          </>
        ) : (
          <>
            <Button
              className="border cursor-pointer border-gray-500 px-4 py-2 rounded-sm text-sm"
              onClick={() => {
                router.push("/auth/login");
              }}
            >
              Log In / Sign Up
            </Button>
           
          </>
        )}
      </div> */}

      <div className="md:hidden block" onClick={() => { setOpen(!open) }}>
        <Sidebar />
      </div>
      {open && (
  <div className="absolute top-0 left-0 w-full h-screen bg-black z-50 flex flex-col justify-start items-start p-6 gap-4">
    {/* Close Button */}
    <button onClick={() => setOpen(false)} className="text-white self-end text-xl mb-4">✕</button>


{/*   
    <div className="mt-6 flex flex-col gap-4 w-full">
      {isAuthenticated ? (
        <>
         
          <Image src={image ? image : avatar} width={32} height={32} className="rounded-full cursor-pointer" alt="avatar" onClick={() => setShowMenu(!showMenu)} />
          {!showMenu && <Dropdown email={email} />}
        </>
      ) : (
        <>
          <button
            className="border border-gray-500 px-4 py-2 rounded text-sm text-white"
            onClick={() => { router.push("/auth/login"); setOpen(false); }}
          >
            Sign In
          </button>
          <button
            className="px-4 py-2 rounded text-sm font-semibold bg-blue-600 text-white"
            onClick={() => { router.push("/auth/signup"); setOpen(false); }}
          >
            Get Started
          </button>
        </>
      )}
    </div> */}
  </div>
)}
    </div>
  );
}
