'use client';

import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import { LogOut, User, Loader2, Box } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import InteractiveHoverButton from "../ui/interactive-hover-button";

export function UserButton() {
  const { user, isAuthenticated, isLoading } = useKindeAuth();

  // If loading, show a minimal loading state
  if (isLoading) {
    return (
      <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    );
  }

  // If not authenticated, show login button
  if (!isAuthenticated || !user) {
    return (
      <Link href="/api/auth/login">
        <InteractiveHoverButton
          text="Sign in"
          className="flex items-center gap-2 w-auto px-4"
        >
            <User className="h-4 w-4" />
            <span>Sign in</span>
        </InteractiveHoverButton>
      </Link>
    );
  }

  // If authenticated and user data is available, show dropdown
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="h-8 w-8 rounded-full border"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user.picture ?? ''}
              alt={user.given_name ?? 'User avatar'}
              referrerPolicy="no-referrer"
            />
            <AvatarFallback>
              {user.given_name?.[0] ?? user.email?.[0] ?? 'U'}
            </AvatarFallback>
          </Avatar>
          <span className="sr-only">Open user menu</span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-[200px]" forceMount>
        <div className="flex flex-col space-y-1 leading-none p-2">
          {user.given_name && (
            <p className="font-medium text-sm">
              {user.given_name} {user.family_name}
            </p>
          )}
          {user.email && (
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          )}
        </div>
        
        <DropdownMenuSeparator />

        {user.email === 'imchn24@gmail.com' && (
          <>
            <DropdownMenuItem asChild>
              <Link 
                href="/admin-panel" 
                className="w-full flex items-center cursor-pointer"
              >
                <Box className="mr-2 h-4 w-4" />
                Admin Panel
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        
        <DropdownMenuItem asChild>
          <Link 
            href="/profile" 
            className="w-full flex items-center cursor-pointer"
          >
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link 
            href="/api/auth/logout" 
            className="w-full flex items-center cursor-pointer text-red-600"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}