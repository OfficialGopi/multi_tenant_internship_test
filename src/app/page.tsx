"use client";
import MainPage from "@/components/MainPage";
import { useUser } from "@/contexts/UserContext";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

const Home = () => {
  const { user, getUser, isUserLoading, getTenant } = useUser();

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
