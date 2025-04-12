'use client';
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

export function NewConversation() {
    const router = useRouter()
    return (
        <Button className="border border-gray-500 [box-shadow:0.25rem_0.25rem_#000] hover:translate-x-[+0.25rem] hover:translate-y-[+0.25rem] hover:[box-shadow:0.0rem_0.0rem_#000] bg-blue-500 hover:bg-blue-600"
            onClick={() => router.push("/voice")}
        > 
            New Interview <ArrowRight/>
        </Button>
    )
}