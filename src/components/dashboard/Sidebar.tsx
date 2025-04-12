'use client'

import { UserCircle, History } from "lucide-react";
import { useRouter, usePathname} from "next/navigation";

export function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();
    return(
        <div className="hidden md:flex">
        <div className="flex flex-col gap-4 p-4 ">
            <button className={`flex flex-row items-center gap-2 border border-gray-500 p-2 rounded-lg  ${pathname === '/account' ? '[box-shadow:0.25rem_0.25rem#000] translate-x-[-0.25rem] translate-y-[-0.25rem] bg-white' : 'bg-gray-200'} hover:bg-white`} onClick={() => router.push('/account')}><UserCircle size={20}/> Account</button>
            <button className={`flex flex-row items-center gap-2 border border-gray-500 p-2 rounded-md  ${pathname === '/history' ? '[box-shadow:0.25rem_0.25rem#000] translate-x-[-0.25rem] translate-y-[-0.25rem] bg-white' : 'bg-gray-200 '} hover:bg-white`} onClick={() => router.push('/history')}><History size={20} /> History</button>                       
        </div>
        <div className=" border-r border-gray-500 "></div>
        </div>
    )
    
}