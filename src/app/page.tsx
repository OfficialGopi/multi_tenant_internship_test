"use client";
import MainPage from "@/components/MainPage";
import { useUser } from "@/contexts/UserContext";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Navigate = ({ to }: { to: string }) => {
  const router = useRouter();
  useEffect(() => {
    router.push(to);
  }, []);
  return <></>;
};

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
  if (!user) {
    return <Navigate to="/login" />;
  } else return <MainPage />;
};

export default Home;
