'use client';

import React, { useState, useEffect } from 'react';
import { signIn } from "next-auth/react";
import success from '../../../public/success-check.svg';
import Image from 'next/image';
import { CircleX } from 'lucide-react';

function MagicLink() {
  const [email, setEmail] = useState("");
  const [send, setSend] = useState(false);
  const [sent, setSent] = useState(false);

  const [secondsLeft, setSecondsLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);

 // ⏱️ Countdown timer
useEffect(() => {
  if (sent && secondsLeft > 0) {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }
}, [sent, secondsLeft]);

// ✅ Allow resend when countdown reaches 0
useEffect(() => {
  if (sent && secondsLeft === 0) {
    setCanResend(true);
  }
}, [secondsLeft, sent]);

  const initialSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSend(true);

    await signIn("email", {
      email,
      callbackUrl: '/',
      redirect: false,
    });

    setSent(true);
    setSend(false);
    setCanResend(false);
    setSecondsLeft(60);
  };

  const handleResend = async () => {
    if (!canResend) return;

    setCanResend(false);
    setSecondsLeft(60);

    await signIn("email", {
      email,
      callbackUrl: '/',
      redirect: false,
    });
  };

  return (
    <>
      <form className="flex flex-col gap-2" onSubmit={initialSend}>
        <div className="grid w-full gap-2">
          <div className="grid gap-2">
            <div className="relative">
              <input
                type="email"
                id="email-resend"
                name="email"
                className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-md border border-solid border-input bg-background px-3 py-2 text-sm font-normal h-10"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <input
            type="submit"
            value={send ? "Sending..." : "Get magic link"}
            className="px-6 cursor-pointer my-3 py-3 rounded-lg text-sm font-semibold bg-blue-800 text-white"
          />
        </div>
      </form>

      {sent && (
        <div className="absolute top-0 left-0 w-full h-screen flex justify-center items-center bg-[#00000073]">
          <div className="w-[28%] pb-18 text-black mx-auto bg-gray-50 rounded-2xl">
            <div className="flex justify-end pt-5 px-5 items-center w-full cursor-pointer">
              <CircleX className="text-black mb-4" onClick={() => setSent(false)} />
            </div>
            <div className="text-center px-10">
              <Image alt="success-image" className="w-12 pb-2 mx-auto" src={success} />
              <p className="font-semibold py-2">Magic link sent</p>
              <p className="font-normal text-sm">
                We have emailed a one-time login link to <b>{email}</b>. It will expire in 20 mins.
              </p>
              <div className="font-semibold pt-7 pb-2 text-sm">Didn't receive email?</div>
              <div
                className={`text-sm font-semibold ${
                  canResend ? 'text-blue-700 cursor-pointer' : 'text-gray-600'
                }`}
                onClick={handleResend}
              >
                {canResend ? 'Resend' : `Resend in ${secondsLeft} sec`}
              </div>
            </div>
          </div>
        </div>
       )} 
    </>
  );
}

export default MagicLink;
