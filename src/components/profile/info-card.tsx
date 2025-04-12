import { Card, CardHeader, CardFooter, CardTitle, CardDescription } from "../ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar"
import { SignOutButton } from "../auth-buttons";
import { PayButton } from "../payment/PayButton";


interface InfoCardProps {
    title: string;
    imgSrc?: string;
    description: string;
}

export function InfoCard({ 
    title, description
}: InfoCardProps) {

    return (
        <>
            <Card className="w-full max-w-4xl mx-auto shadow-lg border border-gray-500 ">
            <CardHeader>
                <div className="flex items-center gap-4">
                <Avatar>
                    <AvatarImage src="" alt="User profile picture" />
                    <AvatarFallback>{title.split(' ').map(word => word.charAt(0)).join('')}</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
                </div>
            </CardHeader>
            <CardFooter>
                <div className="flex gap-4">
                <SignOutButton></SignOutButton>
                <PayButton currency="INR" className="border border-gray-400 hover:translate-x-[-0.25rem] hover:translate-y-[-0.25rem] hover:[box-shadow:0.25rem_0.25rem_#000] bg-green-400 hover:bg-green-500"> Get 10 credits </PayButton>
                </div>
            </CardFooter>
            </Card>
        </>
    )
}