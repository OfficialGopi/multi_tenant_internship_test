"use client";

import { createContext, useContext, useState } from "react";
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
  inviteMember: (data: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  isInviteMemberLoading: boolean;
  isUpgradingToPro: boolean;
  upgradeToPro: () => Promise<void>;
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
  inviteMember: async () => {},
  isInviteMemberLoading: false,
  isUpgradingToPro: false,
  upgradeToPro: async () => {},
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
  const [isInviteMemberLoading, setIsInviteMemberLoading] = useState(false);
  const [isUpgradingToPro, setIsUpgradingToPro] = useState(false);
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

      const refreshAccessTokenResponse = await (
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
    } catch {
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
    } catch {
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
    } catch {
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
    } catch {
      router.replace("/login");
    } finally {
      toast.success("Logout successful");
    }
  };

  const inviteMember = async ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) => {
    setIsInviteMemberLoading(true);
    const toastId = toast.loading("Inviting member...");
    try {
      const res = await (
        await fetch(`/api/tenants/invite`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        })
      ).json();

      if (res.success) {
        toast.success(res.message, {
          id: toastId,
        });
      } else {
        toast.error(res.message, {
          id: toastId,
        });
      }
    } catch {
      toast.error("Something went wrong", {
        id: toastId,
      });
    } finally {
      setIsInviteMemberLoading(false);
    }
  };

  const upgradeToPro = async () => {
    setIsUpgradingToPro(true);
    if (!tenant || !user) {
      toast.error("Something went wrong");
      return;
    }
    if (tenant.isPro) {
      toast.info("You are already a pro user");
      return;
    }
    try {
      await fetch(`/api/tenants/${tenant?.slug}/upgrade`, {
        method: "POST",
      });
      await getUser();
      await getTenant();
      toast.success("Upgrade successful");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsUpgradingToPro(false);
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
        inviteMember,
        isInviteMemberLoading,
        upgradeToPro,
        isUpgradingToPro,
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
  upgradeToPro: () => Promise<void>;
  isUpgradingToPro: boolean;
  tenant?: {
    id: string;
    name: string;
    isPro: boolean;
    slug: string;
    totalNotes: number;
  };
  inviteMember: (data: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  isInviteMemberLoading: boolean;
  getTenant: () => Promise<void>;

  loginUser: (data: { email: string; password: string }) => Promise<void>;
} => useContext(UserContext);
