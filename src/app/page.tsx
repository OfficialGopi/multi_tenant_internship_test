import { env } from "@/constants/env";
import { redirect } from "next/navigation";

const getUser = async () => {
  let user = await (
    await fetch(`${env.BASE_URL}/api/auth/me`, {
      credentials: "include",
      method: "POST",
    })
  ).json();

  if (user.success) {
    return user.data;
  }

  let refreshAccessTokenResponse = await (
    await fetch(`${env.BASE_URL}/api/auth/refresh-access-token`, {
      method: "PUT",
    })
  ).json();

  if (refreshAccessTokenResponse.success) {
    user = await (
      await fetch(`${env.BASE_URL}/api/auth/me`, {
        credentials: "include",
        method: "POST",
      })
    ).json();

    if (user.success) {
      return user.data;
    }
  }

  return null;
};

const Home = async () => {
  let user = await getUser();
  if (!user) {
    return redirect("/login");
  }

  return <div></div>;
};

export default Home;
