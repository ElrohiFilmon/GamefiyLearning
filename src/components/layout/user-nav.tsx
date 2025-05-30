
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut, LifeBuoy } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from 'react';
import type { UserProfile } from '@/types';
import { DEFAULT_MOCK_USER_PROFILE_TEMPLATE } from '@/lib/mock-data';


export function UserNav() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const userEmail = localStorage.getItem('currentUserEmail');
    if (userEmail) {
      const userDataString = localStorage.getItem(`user_${userEmail}`);
      if (userDataString) {
        setCurrentUser(JSON.parse(userDataString).profile);
      } else if (userEmail === DEFAULT_MOCK_USER_PROFILE_TEMPLATE.email) {
        // Fallback for the original mock user if somehow their data isn't in localStorage
        // but they are "logged in" via currentUserEmail.
        setCurrentUser(DEFAULT_MOCK_USER_PROFILE_TEMPLATE);
      }
    }
  }, []);


  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUserEmail');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    setCurrentUser(null); // Clear local state
    router.push('/auth');
  };

  if (!currentUser) {
    // Or a skeleton loader, or null if AppLayout handles loading state
    return (
       <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10" data-ai-hint="user avatar">
            <AvatarFallback>??</AvatarFallback>
          </Avatar>
        </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10" data-ai-hint="user avatar">
            <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
            <AvatarFallback>{currentUser.initials || currentUser.name.substring(0,2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{currentUser.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {currentUser.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/profile" passHref>
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/settings/accessibility" passHref>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LifeBuoy className="mr-2 h-4 w-4" />
          <span>Support</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

    