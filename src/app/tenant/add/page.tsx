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
  const [formData, setFormData] = useState({
    adminName: "",
    tenantName: "",
    adminEmail: "",
    adminPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading("Logging in...");
    try {
      const res = await (
        await fetch("/api/tenants/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
      ).json();

      if (res.success) {
        toast.success("Tenant creation successful", {
          id: toastId,
        });
        router.push("/login");
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
  const [isPageLoading, setIsPageLoading] = useState(true);
  useEffect(() => {
    getUser().then((data) => {
      if (!data.user) {
        return;
      }
      router.push("/");
      setIsPageLoading(false);
    });
  }, []);

  if (isPageLoading)
    return (
      <Loader2 className="animate-spin fixed top-[50%] left-[50%] translate-[-50%]" />
    );

  return (
    <form
      onSubmit={handleCreateTenant}
      className="flex flex-col max-w-[400px] w-full p-2 gap-4 rounded-4xl fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="tenantName">Tenant Name</label>
        <input
          type="text"
          className="p-2 border border-neutral-500/50 rounded-lg text-sm"
          placeholder="Enter the tenant name"
          value={formData.tenantName}
          onChange={(e) =>
            setFormData({
              ...formData,
              tenantName: e.target.value,
            })
          }
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="adminName">Admin Name</label>
        <input
          type="text"
          className="p-2 border border-neutral-500/50 rounded-lg text-sm"
          placeholder="Enter Admin Name"
          value={formData.adminName}
          onChange={(e) =>
            setFormData({
              ...formData,
              adminName: e.target.value,
            })
          }
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="adminEmail">Admin Email</label>
        <input
          type="email"
          className="p-2 border border-neutral-500/50 rounded-lg text-sm"
          placeholder="Enter Admin Email"
          value={formData.adminEmail}
          onChange={(e) =>
            setFormData({
              ...formData,
              adminEmail: e.target.value,
            })
          }
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="adminPassword">Admin Password</label>
        <input
          type="password"
          className="p-2 border border-neutral-500/50 rounded-lg text-sm"
          placeholder="Enter Admin Password"
          value={formData.adminPassword}
          onChange={(e) =>
            setFormData({
              ...formData,
              adminPassword: e.target.value,
            })
          }
        />
      </div>
      <button
        type="submit"
        className={cn(
          "border p-2 rounded-lg hover:bg-neutral-900 border-neutral-500/50 transition-colors cursor-pointer",
          isLoading && "cursor-not-allowed bg-neutral-900/50"
        )}
      >
        {isLoading ? "Creating..." : "Create"}
      </button>
      <Link className="text-right underline text-blue-600" href="/login">
        Go to the Login Page
      </Link>
    </form>
  );
};

export default page;
