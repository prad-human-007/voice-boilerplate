'use client'
import Image from "next/image"
import { Button } from "../ui/button"; 
import { ArrowRight } from "lucide-react";
import  { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { PlanNoPay } from "../payment/Plans";
import { AnimatedTooltipPreview } from "./tooltip";

interface HeroProps {
  user: User | null;
}

export function Hero({user}: HeroProps) {
    const router = useRouter();
    return (
    <div className="flex flex-col items-center justify-center overflow-y-auto p-2 py-4 gap-4 w-full h-screen">
      <a href="/voice" className="border border-gray-400 px-4 py-2 rounded-lg bg-white shadow-xl hover:bg-gray-50 transition-all duration-300 ease-in-out">
        Go to Demo page
      </a>
    </div>
    )
}