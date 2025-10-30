"use client"

import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { ThemeProvider } from "@/contexts/theme-context";
import { AuthProvider } from "@/components/providers/session-provider";
import { SelectedServerProvider } from "@/contexts/selected-server-context";
import { MobileSidebarProvider } from "@/contexts/mobile-sidebar-context";
import ActivityTracker from "@/components/ActivityTracker";
import { usePathname } from "next/navigation";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isPublicPage = pathname?.startsWith('/home') || pathname?.startsWith('/servers') || pathname?.startsWith('/gaming') || pathname?.startsWith('/store') || pathname?.startsWith('/admin-verification');

  if (isPublicPage) {
    return (
      <html lang="en" className="dark">
        <body className="antialiased bg-gray-950 text-white font-sans">
          <AuthProvider>
            <ThemeProvider>
              <SelectedServerProvider>
                <ActivityTracker>
                  {children}
                </ActivityTracker>
              </SelectedServerProvider>
            </ThemeProvider>
          </AuthProvider>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-gray-950 text-white font-sans">
        <AuthProvider>
          <ThemeProvider>
            <SelectedServerProvider>
              <MobileSidebarProvider>
                <ActivityTracker>
                  <div className="flex h-screen overflow-hidden">
                    {/* Sidebar */}
                    <Sidebar />
                    
                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                      {/* Header */}
                      <Header />
                      
                      {/* Page Content */}
                       <main className="flex-1 overflow-auto">
                         {children}
                       </main>
                     </div>
                   </div>
                </ActivityTracker>
               </MobileSidebarProvider>
             </SelectedServerProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
