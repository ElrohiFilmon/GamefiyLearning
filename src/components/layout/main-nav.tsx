
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  BookOpen as BookOpenIcon,
  UserCircle,
  Sparkles,
  Map,
  Trophy,
  Target,
  Settings,
  ChevronLeft, 
  ChevronRight,
  CreditCard 
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar, 
} from '@/components/ui/sidebar';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  tooltip: string;
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, tooltip: 'Dashboard' },
  { href: '/courses', label: 'Courses', icon: BookOpenIcon, tooltip: 'Courses' },
  { href: '/learning-paths', label: 'Learning Paths', icon: Map, tooltip: 'Learning Paths' },
  { href: '/challenges', label: 'Challenges', icon: Target, tooltip: 'Challenges' },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy, tooltip: 'Leaderboard' },
  { href: '/ai-assistant', label: 'AI Assistant', icon: Sparkles, tooltip: 'AI Assistant' },
  { href: '/profile', label: 'Profile', icon: UserCircle, tooltip: 'Profile' },
  { href: '/subscription', label: 'Subscription', icon: CreditCard, tooltip: 'Subscription'},
];

const settingsNavItem: NavItem = { href: '/settings/accessibility', label: 'Settings', icon: Settings, tooltip: 'Settings' };

export function MainNav() {
  const pathname = usePathname();
  const { toggleSidebar, open } = useSidebar(); 

  return (
    <nav className="flex flex-col h-full">
      <SidebarMenu className="flex-1 p-2">
        {navItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <Link href={item.href} passHref legacyBehavior>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard' && !item.href.includes('/settings'))}
                tooltip={item.tooltip}
                className="justify-start"
              >
                <a>
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </a>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      <SidebarMenu className="mt-auto p-2 border-t border-sidebar-border">
         <SidebarMenuItem>
            <Link href={settingsNavItem.href} passHref legacyBehavior>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(settingsNavItem.href)}
                tooltip={settingsNavItem.tooltip}
                className="justify-start"
              >
                <a>
                  <settingsNavItem.icon className="h-5 w-5" />
                  <span>{settingsNavItem.label}</span>
                </a>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
         <SidebarMenuItem>
            <SidebarMenuButton
                onClick={toggleSidebar}
                tooltip={open ? "Collapse menu" : "Expand menu"}
                className="justify-start w-full"
            >
                {open ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </SidebarMenuButton>
         </SidebarMenuItem>
      </SidebarMenu>
    </nav>
  );
}
