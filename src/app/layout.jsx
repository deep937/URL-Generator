"use client"; 

import { usePathname } from "next/navigation";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <html lang="en">
      {/* Ensure the body is forced to your light color #FCFDFE */}
      <body className={`bg-[#FCFDFE] antialiased ${isAuthPage ? 'overflow-auto' : ''}`}>
        
        {/* Only render Sidebar if NOT on auth pages */}
        {!isAuthPage && <Sidebar />}
        
        <div className="flex flex-col min-h-screen">
          {/* Only render Header if NOT on auth pages */}
          {!isAuthPage && <Header />}
          
          <main className={`flex-1 transition-all duration-500 
            ${!isAuthPage ? "pt-20 pl-16 lg:pl-20" : "pt-0 pl-0"}`}
          >
            {children}
          </main>

          {/* Only render Footer if NOT on auth pages */}
          {!isAuthPage && (
            <div className="pl-16 lg:pl-20 transition-all duration-500">
              <Footer />
            </div>
          )}
        </div>
      </body>
    </html>
  );
}