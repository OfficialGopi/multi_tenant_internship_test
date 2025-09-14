"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
const UserContext = createContext<{
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    tenantId: string;
  };
  getUser: () => Promise<void>;
  isUserLoading: boolean;
  isTenantLoading: boolean;
  tenant?: {
    id: string;
    name: string;
    isPro: boolean;
    slug: string;
    totalNotes: number;
  };
  isUserLoggingIn: boolean;
  loginUser: (data: { email: string; password: string }) => Promise<void>;
  getTenant: () => Promise<void>;
  logoutUser: () => Promise<void>;
}>({
  user: undefined,
  getUser: async () => {},
  isUserLoading: true,
  isTenantLoading: true,
  tenant: undefined,
  loginUser: async () => {},
  getTenant: async () => {},
  isUserLoggingIn: true,
  logoutUser: async () => {},
});

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const [user, setUser] = useState<
    | {
        id: string;
        name: string;
        email: string;
        role: string;
        tenantId: string;
      }
    | undefined
  >();

  const [isUserLoading, setIsUserLoading] = useState(true);
  const [isUserLoggingIn, setIsUserLoggingIn] = useState(false);
  const [isTenantLoading, setIsTenantLoading] = useState(true);
  const [tenant, setTenant] = useState<
    | {
        id: string;
        name: string;
        isPro: boolean;
        slug: string;
        totalNotes: number;
      }
    | undefined
  >();

  const getUser = async () => {
    if (user) return;
    setIsUserLoading(true);
    try {
      let res = await (
        await fetch(`/api/auth/me`, {
          credentials: "include",
          method: "POST",
        })
      ).json();

      if (res.success) {
        setUser(res.data.user);
        return;
      }

      let refreshAccessTokenResponse = await (
        await fetch(`/api/auth/refresh-access-token`, {
          method: "PUT",
        })
      ).json();

      if (refreshAccessTokenResponse.success) {
        res = await (
          await fetch(`/api/auth/me`, {
            credentials: "include",
            method: "POST",
          })
        ).json();

        if (res.success) {
          setUser(res.data.user);
          return;
        } else {
          setUser(undefined);
        }
      } else {
        setUser(undefined);
      }
    } catch (error) {
      setUser(undefined);
    } finally {
      setIsUserLoading(false);
    }
  };

  const getTenant = async () => {
    if (tenant) return;
    setIsTenantLoading(true);
    try {
      const res = await (
        await fetch(`/api/tenants`, {
          method: "GET",
        })
      ).json();

      if (res.success) {
        setTenant(res.data.tenant);
      } else {
        setTenant(undefined);
      }
    } catch (error) {
      setTenant(undefined);
    } finally {
      setIsTenantLoading(false);
    }
  };

  const loginUser = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    setIsUserLoggingIn(true);
    const toastId = toast.loading("Logging in...");
    try {
      const res = await (
        await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
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
      setIsUserLoggingIn(false);
    }
  };

  const logoutUser = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "DELETE",
      });
      setUser(undefined);
      setTenant(undefined);
      router.replace("/login");
    } catch (e) {
      router.replace("/login");
    } finally {
      toast.success("Logout successful");
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isUserLoading,
        isTenantLoading,
        tenant,
        getTenant,
        logoutUser,
        getUser,
        loginUser,
        isUserLoggingIn,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider };
export const useUser = (): {
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    tenantId: string;
  };
  getUser: () => Promise<void>;
  isUserLoading: boolean;
  isTenantLoading: boolean;
  isUserLoggingIn: boolean;
  logoutUser: () => Promise<void>;
  tenant?: {
    id: string;
    name: string;
    isPro: boolean;
    slug: string;
    totalNotes: number;
  };
  getTenant: () => Promise<void>;

  loginUser: (data: { email: string; password: string }) => Promise<void>;
} => useContext(UserContext);
