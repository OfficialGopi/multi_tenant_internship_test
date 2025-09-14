"use client";

import { getUser } from "@/services/api.services";
import { cn } from "@/utils/cn";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const page = () => {
  const router = useRouter();
  const [isPageLoading, setIsPageLoading] = useState(true); //
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  useEffect(() => {
    getUser()
      .then((data) => {
        if (data.user) {
          router.push("/");
        } else {
          setIsPageLoading(false);
        }
      })
      .catch(() => {
        setIsPageLoading(false);
      });
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading("Logging in...");
    try {
      const res = await (
        await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
      ).json();

      if (res.success) {
        toast.success("Login successful", {
          id: toastId,
        });

        router.push("/");
      } else {
        toast.error(res.message, {
          id: toastId,
        });
      }
    } catch (error) {
      toast.error("Something went wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isPageLoading)
    return (
      <Loader2 className="animate-spin fixed left-[50%] top-[50%] translate-[-50%]" />
    );

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
        disabled={isLoading}
        className={cn(
          "border p-2 rounded-lg hover:bg-neutral-900 border-neutral-500/50 transition-colors cursor-pointer",
          isLoading && "cursor-not-allowed bg-neutral-900/50"
        )}
      >
        {isLoading ? "Logging in..." : "Login"}
      </button>
      <Link className="text-right underline text-blue-600" href="/tenant/add">
        Create a tenant
      </Link>
    </form>
  );
};

export default page;
