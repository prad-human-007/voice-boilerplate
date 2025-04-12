import { createClient } from "@/utils/supabase/server";
import { SignInButton, SignUpButton} from "@/components/auth-buttons";
import { UserDropdown } from "@/components/home/user-dropdown";
import { Hero } from "@/components/home/hero";
import Image from "next/image";

export default async function Home() {

  const supabase = await createClient();
  const { data: {user} } = await supabase.auth.getUser();

  return (
    <div className="landing-page flex flex-col items-center justify-between w-full ">

      <div className="w-full">
        <div className="flex justify-center w-full px-2">
          <div className="flex flex-row shadow-xl rounded-2xl mt-3 w-full max-w-7xl justify-between items-center gap-3 p-3 bg-white bg-opacity-50"> 
           
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
            
            <div className="flex gap-2 items-center">
              <a href="/blogs" className="h-10 rounded-xl border p-2 bg-orange-200 shadow-xl ">FAQ</a>
              {!user && <SignInButton/> }
              {!user && <SignUpButton/> }
              {user && <UserDropdown/> }
            </div>
          </div>
        </div>
      </div>

      <Hero user={user}/>
      
      {/* FOOTER */}
      <div className="mt-5 flex flex-row gap-2 text-gray-700 mb-1">
        <a href="/terms" className="font-thin ">Terms & Conditions</a>
        <span className="font-thin ">|</span>
        <a href="/privacy" className="font-thin ">Privacy</a>
      </div>

    </div>
  );
}
