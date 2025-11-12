"use client";

import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import NavbarDemo from "./common/Navbar";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const dropdownOptions = [
  { value: "fasting", label: "Fasting" },
  { value: "before_breakfast", label: "Before Breakfast" },
  { value: "after_breakfast", label: "After Breakfast" },
  { value: "before_lunch", label: "Before Lunch" },
  { value: "after_lunch", label: "After Lunch" },
  { value: "before_dinner", label: "Before Dinner" },
  { value: "after_dinner", label: "After Dinner" },
  { value: "bedtime", label: "Bedtime" },
  { value: "random", label: "Random" },
  { value: "afternoon", label: "Afternoon" },
];

function Hero() {
  const router = useRouter();
  const { isSignedIn, user, isLoaded } = useUser(); // ✅ from Clerk

  const [level, setLevel] = useState<number | "">("");
  const [context, setContext] = useState<string>("random");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");

  // wait for Clerk to load before rendering UI
  if (!isLoaded) {
    return (
      <div className="h-screen flex justify-center items-center text-gray-600">
        Loading user info...
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!level) {
      setMessage("Please enter a valid reading!");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await fetch("/api/readings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level: Number(level), context }),
      });

      if (res.ok) {
        setMessage("✅ Reading recorded successfully!");
        setLevel("");
        setContext("random");
      } else {
        const data = await res.json();
        setMessage(`⚠️ Failed: ${data.error || "Something went wrong"}`);
      }
    } catch (error) {
      console.error("Error adding reading:", error);
      setMessage("❌ Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavbarDemo />

      {isSignedIn ? (
        // ✅ Signed-in user view
        <div className="text-center pt-10">
          <p className="text-4xl font-bold my-8">
            Hi {user?.firstName || "there"}, please enter your blood sugar level
          </p>

          <form
            className="w-[45%] border border-gray-500 rounded-3xl px-6 py-4 text-start mx-auto space-y-8"
            onSubmit={handleSubmit}
          >
            <div className="space-y-2">
              <h3 className="text-md font-bold">Enter your readings</h3>
              <Input
                placeholder="Type reading..."
                value={level}
                onChange={(e) => {
                  const val = e.target.value;
                  const num = parseFloat(val);
                  if (isNaN(num)) setLevel("");
                  else setLevel(num);
                }}
              />
            </div>

            <div className="space-y-2 w-full">
              <h3 className="text-md font-bold">Enter the time of the day</h3>
              <select
                className="border rounded p-2 w-full"
                onChange={(e) => setContext(e.target.value)}
                value={context}
              >
                {dropdownOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-center">
              <Button type="submit">
                {loading ? "Recording..." : "Record It"}
              </Button>
            </div>

            {message && (
              <p className="text-center text-sm text-gray-600 mt-3">{message}</p>
            )}
          </form>
        </div>
      ) : (
        // 🚫 Not signed-in user view
        <div className="text-center my-30">
          <p className="text-3xl font-bold">Welcome to the Health Diary</p>
          <p className="text-sm mb-4 max-w-md mx-auto mt-4 text-gray-600">
            Health Diary helps you track and manage your blood sugar levels
            effectively. Get started by signing in to record your readings and monitor
            your health over time.
          </p>
          <Button onClick={() => router.push("/sign-in")}>Get Started</Button>
        </div>
      )}
    </>
  );
}

export default Hero;
