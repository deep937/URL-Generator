"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function FooterWrapper() {
  const pathname = usePathname();

  // 1. Define an array of "Auth" or "Focus" routes where the footer is distracting
  const NO_FOOTER_ROUTES = ["/login", "/register", "/forgot-password", "/onboarding"];

  // 2. Use .some() or .includes() for better readability
  // We use .some() if we want to check if the pathname *starts* with a specific string
  const isHidden = NO_FOOTER_ROUTES.includes(pathname);

  if (isHidden) return null;

  return (
    <div className="relative z-10">
       <Footer />
    </div>
  );
}