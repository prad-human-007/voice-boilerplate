import { createClient } from "@/utils/supabase/server";
import { SignInButton, SignUpButton} from "@/components/auth-buttons";
import { UserDropdown } from "@/components/home/user-dropdown";
import { Hero } from "@/components/home/hero";
import Image from "next/image";

export default async function Home() {

  const supabase = await createClient();
  const { data: {user} } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col items-center justify-between w-full ">
      <Hero user={user}/>
    </div>
  );
}
