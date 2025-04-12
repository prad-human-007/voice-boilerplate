'use client'

import { Button } from "./ui/button"; 
import { useRouter } from "next/navigation";
import { signOutAction } from "@/app/actions";

export function SignInButton() {
    const router = useRouter();
    return (
        <Button className="border rounded-xl [box-shadow:0.0rem_0.15rem_#000] hover:[box-shadow:0.0rem_0.0rem_#000] hover:translate-y-[0.15rem]  border-gray-300 bg-blue-500 hover:bg-blue-600" onClick={() => { router.push('/sign-in') } }>Login</Button>
    );
}

export function SignUpButton() {
    const router = useRouter();
    return (
        <Button className="hidden rounded-xl sm:flex border [box-shadow:0.0rem_0.15rem_#000] hover:[box-shadow:0.0rem_0.0rem_#000] hover:translate-y-[0.15rem]  border-gray-300 bg-blue-500 hover:bg-blue-600"  onClick={() => { router.push('/sign-up') } }>Sign Up</Button>
    );
}

export function SignOutButton() {
    return (
        <Button variant={'destructive'} onClick={() => signOutAction()}>Logout</Button>
    );
}