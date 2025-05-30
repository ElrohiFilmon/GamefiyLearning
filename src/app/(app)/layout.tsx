
"use client"; 

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { MainNav } from '@/components/layout/main-nav';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  useSidebar, // Import useSidebar
} from '@/components/ui/sidebar';
import { Logo } from '@/components/shared/logo';
import { Rocket, PanelLeftClose } from 'lucide-react'; 

export default function AppLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    const userEmail = localStorage.getItem('currentUserEmail');

    if (authStatus === 'true' && userEmail) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      if (pathname !== '/auth') { 
        router.push('/auth');
      }
    }
  }, [router, pathname]);

  if (isAuthenticated === null) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Rocket className="h-16 w-16 text-primary animate-spin" />
            <p className="ml-4 text-lg text-muted-foreground">Loading Your Galaxy...</p>
        </div>
    );
  }

  if (!isAuthenticated) {
    return null; 
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar collapsible="icon" variant="sidebar" side="left">
        <SidebarHeader className="p-4 h-16 flex items-center justify-start hidden group-data-[collapsible=icon]:hidden md:flex">
          {/* Replaced Logo with "Menu" text */}
          <h2 className="text-xl font-semibold text-sidebar-foreground ml-1">Menu</h2>
        </SidebarHeader>
        <SidebarHeader className="p-2 h-16 flex items-center justify-center hidden group-data-[collapsible=icon]:md:flex md:hidden">
           <Rocket className="h-7 w-7 text-primary" />
        </SidebarHeader>
        <SidebarContent>
          <MainNav />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

    