"use client";
import MainPage from "@/components/MainPage";
import { getUser } from "@/services/api.services";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Home = () => {
  const router = useRouter();
  const [user, setUser] = useState();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    getUser()
      .then((data) => {
        if (!data.user) {
          router.push("/login");
          return;
        }
        setUser(data.user);
        setIsLoading(false);
      })
      .catch(() => {
        router.push("/login");
      });
  }, []);

  if (isLoading)
    return (
      <Loader2 className="animate-spin fixed top-[50%] left-[50%] translate-[-50%]" />
    );
  return <MainPage user={user!} tenant={(user as any)?.tenant} />;
};

export default Home;
