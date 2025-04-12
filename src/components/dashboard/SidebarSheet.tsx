'use client'
import { Menu, UserCircle, History, LogOut } from "lucide-react"
import { Button } from "../ui/button"
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"
import { useRouter } from "next/navigation"
import { signOutAction } from "@/app/actions"

export function SidebarSheet() {
    const router = useRouter()
    return (
        <div className="md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button className="bg-blue-500 rounded-xl"> <Menu/> </Button>
                </SheetTrigger>
                <SheetContent side={"left"} className="w-64">
                    <div className="flex flex-col gap-3 mt-4">
                        <button className="flex flex-row gap-2 p-2 rounder-lg border-l-2" onClick={() => router.push('/account')}>
                            <UserCircle/> Account
                        </button >
                        <button className="flex flex-row gap-2 p-2 rounder-lg border-l-2"  onClick={() => router.push('/history')}>
                            <History/> History
                        </button>
                        <button  className="flex flex-row gap-2 p-2 rounder-lg border-l-2" onClick={() => signOutAction()}>
                            <LogOut/> Logout
                        </button>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}