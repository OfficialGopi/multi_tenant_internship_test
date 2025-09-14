"use client";
import MainPage from "@/components/MainPage";
import { useUser } from "@/contexts/UserContext";
import { getUser } from "@/services/api.services";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Home = () => {
  const router = useRouter();
  const { user, getUser, isUserLoading, isTenantLoading, getTenant, tenant } =
    useUser();

  useEffect(() => {
    if (!user) {
      getUser();
      getTenant();
    }
  }, [user]);

  if (isUserLoading)
    return (
      <Loader2 className="animate-spin fixed top-[50%] left-[50%] translate-[-50%]" />
    );
  return <MainPage />;
};

export default Home;
