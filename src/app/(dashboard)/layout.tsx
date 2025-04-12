import { createClient } from "@/utils/supabase/server";
import { UserDropdown } from "@/components/home/user-dropdown";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { SidebarSheet } from "@/components/dashboard/SidebarSheet";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function DashboardLayout({children}: {children: React.ReactNode;}) {
    
    const supabase = await createClient();
    const { data: { user} } = await supabase.auth.getUser();
    if(!user) {
        redirect("/sign-in");
    }

    return (
        <div className="landing-page flex flex-col w-full items-center overflow-y-auto px-2">
            {/* NAVBAR */}
            <div className="flex flex-row w-full max-w-7xl justify-between items-center gap-3 p-3 bg-white bg-opacity-50 shadow-xl  rounded-xl mt-2 "> 
                <a href="/" className="flex items-center font-extrabold italic text-2xl"> 
                <Image 
                    src='/images/headerImg.png'
                    alt="Logo"
                    width={40}
                    height={40}
                    className="mr-1"
                />
                Visa<div className="text-blue-500">Prep</div>AI 
                </a>
                <div className="flex flex-row gap-2">
                    {user && <UserDropdown/> }
                    <SidebarSheet/>
                </div>
                
            </div>
            {/* <div className="w-screen border-t border-gray-400"></div> */}
    

            {/* MAIN CONTENT */}
            <div className="flex flex-row w-full max-w-7xl justify-center gap-4 p-3">
                {/* SIDEBAR */}
                <Sidebar/>
                {/* MAIN CONTENT */}
                <div className="max-w-4xl w-full mt-4">
                    {children }
                </div>
            </div>
        </div>
    );

}
