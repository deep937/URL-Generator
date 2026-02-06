import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#FCFDFE] antialiased">
        {/* Concept: Sidebar is a direct sibling to the content wrapper */}
        <Sidebar />
        
        {/* Content Wrapper: Flex-col handles the vertical stack of Header, Main, and Footer */}
        <div className="flex flex-col min-h-screen">
          <Header />
          
          {/* Main: flex-1 ensures it fills the space so the footer sits at the bottom */}
          <main className="flex-1 pt-20 pl-16 lg:pl-20 transition-all duration-500">
            {children}
          </main>

          {/* Footer: Now inside the flow, respecting the sidebar padding */}
          <div className="pl-16 lg:pl-20 transition-all duration-500">
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}