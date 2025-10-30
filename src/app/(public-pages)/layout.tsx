'use client';

import "../globals.css";
import { DashboardNavbar } from "@/components/dashboard-navbar";
import { SelectedServerProvider } from "@/contexts/selected-server-context";
import { usePathname } from "next/navigation";

export default function PublicPagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  
  // Hide navbar for dashboard pages
  const hideNavbar = pathname?.includes('/dashboard');
  
  return (
    <SelectedServerProvider>
      <div className="min-h-screen bg-gray-950 text-white">
        {/* Navbar - hidden for dashboard and admin verification pages */}
        {!hideNavbar && <DashboardNavbar />}
        
        {/* Page Content */}
        <main className={hideNavbar ? "" : "pt-20"}>
          {children}
        </main>
      </div>
    </SelectedServerProvider>
  );
}