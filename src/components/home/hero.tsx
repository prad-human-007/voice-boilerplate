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
    <div className="flex flex-col items-center overflow-y-auto p-2 py-4 gap-4">

      {/* MIDDLE SECTION */}
      <section className="flex flex-col md:flex-row items-center justify-center ">
        {/* Left Side: Heading, Description, CTA */}
        <div className="flex flex-col gap-6  text-center  p-5 md:p-10 rounded-lg">
          <h2>
              <span className="text-blue-500 font-semibold text-lg">Join 1000+ who landed their visas</span> 
          </h2>
          <h1 className="text-3xl md:text-[3.3rem] font-sans font-bold max-w-6xl leading-tight text-center ">
              Practice for USA F1 Visa, IELTS, TOFEL Interview with Expert Visa Coach ⭐ 
          </h1>
          <AnimatedTooltipPreview />
          <div className="flex justify-center ">
            <p className="text-gray-700 max-w-4xl text-sm md:text-lg">
                Practice Visa Interview with AI Visa Officer and build confidence. 
                Visa Interview AI Coach will ask questions as per US visa application and give instant feedback for the interview.
                Practice for different visa Interview like F1 visa Interview, B1/B2 Visa Intervew, Schengen Visa Interview, IELTS Mock Interview with AI.
            </p>         
          </div>

          {user? (
            <div className="flex gap-3 justify-center items-center">
              <Button onClick={() => router.push('/voice')} className="px-6 text-lg italic py-3 [box-shadow:0.0rem_0.25rem_#000] hover:[box-shadow:0.0rem_0.0rem_#000] hover:translate-y-[0.25rem] font-semibold bg-teal-500 hover:bg-teal-600 ">Start Interview <ArrowRight/> </Button>
              <Button onClick={() => router.push('/account')} className="px-6 text-lg italic py-3 [box-shadow:0.0rem_0.25rem_#000] hover:[box-shadow:0.0rem_0.0rem_#000] hover:translate-y-[0.25rem]  bg-teal-500 hover:bg-teal-600 ">View Account <ArrowRight/> </Button>
            </div>
          ) : (
            <div className="flex gap-4 justify-center ">
              <Button onClick={() => router.push('/voice')} className="px-6 shadow-xl border border-gray-200  italic py-3 [box-shadow:0.0rem_0.25rem_#000] hover:[box-shadow:0.0rem_0.0rem_#000] hover:translate-y-[0.25rem] text-lg rounded-lg bg-teal-500 hover:bg-teal-600 ">1 Free Interview <ArrowRight/> </Button>
            </div>
          ) }
          
        </div>
      </section>

      <div className="shadow-2xl flex mt-5 flex-col p-2 px-2 gap-4 font-sans text-gray-600 bg-white bg-opacity-40  rounded-xl items-center">
        {/* <div className="p-1">Have Real Time Conversation & Get Instant Results</div> */}
        <div className="flex flex-row gap-4">
          <div>
            <Image
              src="/images/demo3.png"
              alt="Demo Image 1"
              width={850}
              height={850}
              className="rounded-lg"
            />
          </div>
        </div>

      </div>
      
      <h1 className="mt-10 font-serif text-4xl">Pricing</h1>
      
      {/* <AnimatedTestimonialsDemo /> */}

      <PlanNoPay />
  

    </div>
    )
}