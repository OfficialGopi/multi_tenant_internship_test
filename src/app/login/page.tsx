"use client";

import { useUser } from "@/contexts/UserContext";
import { cn } from "@/utils/cn";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Navigate = ({ to }: { to: string }) => {
  const router = useRouter();
  useEffect(() => {
    router.push(to);
  }, []);
  return <></>;
};

const page = () => {
  const { user, getUser, loginUser, isUserLoading, isUserLoggingIn } =
    useUser();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  useEffect(() => {
    getUser();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await loginUser({
      email: formData.email,
      password: formData.password,
    });
  };

  if (isUserLoading)
    return (
      <Loader2 className="animate-spin fixed left-[50%] top-[50%] translate-[-50%]" />
    );
  if (user) {
    return <Navigate to="/" />;
  } else
    return (
      <form
        onSubmit={handleLogin}
        className="flex flex-col max-w-[400px] w-full p-2 gap-4 rounded-4xl fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="p-2 border border-neutral-500/50 rounded-lg text-sm"
            placeholder="johndoe@example.com"
            value={formData.email}
            onChange={(e) => {
              setFormData({
                ...formData,
                email: e.target.value,
              });
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="p-2 border border-neutral-500/50 rounded-lg text-sm"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => {
              setFormData({
                ...formData,
                password: e.target.value,
              });
            }}
          />
        </div>
        <button
          type="submit"
          disabled={isUserLoggingIn}
          className={cn(
            "border p-2 rounded-lg hover:bg-neutral-900 border-neutral-500/50 transition-colors cursor-pointer",
            isUserLoggingIn && "cursor-not-allowed bg-neutral-900/50"
          )}
        >
          {isUserLoggingIn ? "Logging in..." : "Login"}
        </button>
        <Link className="text-right underline text-blue-600" href="/tenant/add">
          Create a tenant
        </Link>
      </form>
    );
};

export default page;
