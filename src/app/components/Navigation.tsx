"use client";
import React from "react";
import { useSession } from "next-auth/react";
import LogoutButton from "./LogoutButton";
import { Capitalize } from "@/utils/Capitalize";



function Navigation() {
  const { data: session, status } = useSession();

  return (
    <div className="flex items-center justify-between px-6 w-full text-2xl font-bold">
      {status === "loading"
        ? "Loading"
        : session && Capitalize(session?.user?.name).split(" ")[0]}
      <div className="flex items-center gap-6">
        <LogoutButton />
      </div>
    </div>
  );
}

export default Navigation;
