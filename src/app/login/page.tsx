import { env } from "@/constants/env";
import { redirect } from "next/navigation";
import React from "react";

async function loginAction(formData: FormData) {
  "use server";

  const email = formData.get("email");
  const password = formData.get("password");

  // Call your auth logic or API here
  const res = await fetch(`${env.BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await res.json();
  if (data.success) redirect("/");
}

const page = () => {
  return (
    <form
      action={loginAction}
      className="flex flex-col max-w-[400px] w-full p-2 gap-4 rounded-4xl fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          className="p-2 border border-neutral-500/50 rounded-lg text-sm"
          placeholder="johndoe@example.com"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          className="p-2 border border-neutral-500/50 rounded-lg text-sm"
          placeholder="Enter your password"
        />
      </div>
      <button
        type="submit"
        className="border p-2 rounded-lg hover:bg-neutral-900 border-neutral-500/50 transition-colors cursor-pointer"
      >
        Login
      </button>
    </form>
  );
};

export default page;
