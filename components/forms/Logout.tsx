"use client";

import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

import { ROUTES } from "@/constants/routes";

import { Button } from "../ui/button";

const LogoutButton = () => {
  const pathname = usePathname();

  const handleLogout = async () => {
    const isProtectionRoutes = pathname.startsWith("/profile") || pathname.startsWith("/ask-question");

    const callbackUrl = isProtectionRoutes ? ROUTES.SIGN_IN : pathname;

    await signOut({ redirectTo: callbackUrl });
  };

  return (
    <Button onClick={handleLogout} className="base-medium w-fit !bg-transparent px-4 py-3">
      <LogOut className="size-5 text-black dark:text-white" />
      <span className="text-dark300_light900 max-lg:hidden">Logout</span>
    </Button>
  );
};

export default LogoutButton;
