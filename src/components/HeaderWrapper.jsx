"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function HeaderWrapper() {
  const pathname = usePathname();

  // Routes where we want a "Clean Slate" (No distractions)
  const AUTH_ROUTES = ["/login", "/register", "/reset-password"];
  
  // Check if current path is in the auth list
  const isAuthPage = AUTH_ROUTES.includes(pathname);

  if (isAuthPage) return null;

  return (
    <div className="sticky top-0 z-50 w-full">
      <Header />
    </div>
  );
}