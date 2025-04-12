'use client';

import { useRouter } from 'next/navigation';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User, LogOut, Speaker } from 'lucide-react';
import { signOutAction } from '@/app/actions';

export function UserDropdown() {
  const router = useRouter();

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className='rounded-xl bg-blue-500'> <User/> </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => router.push('/account')}>
            <User/> Account
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/voice')}>
            <Speaker/> New Chat
          </DropdownMenuItem>
          <DropdownMenuItem  onClick={() => signOutAction()}>
            <LogOut/> Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
