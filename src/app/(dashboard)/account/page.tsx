import { SignOutButton } from "@/components/auth-buttons";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { redirect } from "next/navigation";
import { NewConversation } from "@/components/dashboard/NewConversation";
import { BasicPlan } from "@/components/payment/Plans";

export default async function Profile() {

    const supabase = await createClient();
    const { data: {user} } = await supabase.auth.getUser();
    if(!user) {
        redirect("/sign-in");
    }
    const title = user.email!
    const description = user.email!
    const {name, avatar_url} = user.user_metadata


    const {data} = await supabase.from("roles").select('chats_left').eq('user_id', user.id)
    return (
        <div className="flex flex-col w-full h-screen items-center gap-4">
            <div className="flex flex-col gap-3 max-w-4xl w-full">
                <div>
                    <Card className="w-full max-w-4xl mx-auto shadow-xl  bg-white bg-opacity-50 ">
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <Avatar >
                                <AvatarImage src={avatar_url} alt="User profile picture" />
                                <AvatarFallback>{title.split(' ').map(word => word.charAt(0)).join('')}</AvatarFallback>
                            </Avatar>
                        <div>
                            <CardTitle>{name? name : title}</CardTitle>
                            <CardDescription>{description}</CardDescription>
                        </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="italic text-ms">
                            Number of credits left: {data![0].chats_left}
                        </div>
                    </CardContent>
                    
                    <CardFooter>
                        <div className="flex gap-4">
                        <NewConversation/>
                        <SignOutButton></SignOutButton>
                        </div>
                    </CardFooter>
                    </Card>
                </div>
                <BasicPlan />
                {/* <div className="border border-gray-400 rounded-lg shadow-lg p-4">
                    <h4>Get 20 More Mock Interview for $15</h4>
                    <PayButton className="border border-gray-400 hover:translate-x-[-0.25rem] hover:translate-y-[-0.25rem] hover:[box-shadow:0.25rem_0.25rem_#000] bg-green-400 hover:bg-green-500"> Get 10 credits </PayButton>
                </div> */}
            </div>
            
        </div>
    );
}

