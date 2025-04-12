"use client";
import { useState } from "react";
import { PayButton } from "@/components/payment/PayButton";
import { ArrowRight, Check } from "lucide-react";

export function BasicPlan() {
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");

  return (
    <>
      <div className="relative flex flex-col bg-white bg-opacity-50 h-full gap-5 lg:gap-8 z-10 bg-base-100 p-8 rounded-lg">
        <div className="flex justify-between items-center gap-4">
          <div>
            <p className="text-lg text-xl font-extrabold">
              Success Plan (50% off)
            </p>
            <p className="text-base-content/60 text-xs mt-2">
            This plan is designed to boost your confidence and prepare you for your US F-1 student visa interview through AI-driven mock sessions with a virtual Visa Officer.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col justify-end mb-[4px] text-lg ">
            <p className="relative">
              <span className="text-base-content/80 line-through text-sm font-semibold text-red-500">
                $9.99 USD
              </span>
            </p>
          </div>
          <div className="flex gap-2">
            <p className="text-5xl tracking-tight text-teal-600 font-extrabold">
              $4.99
            </p>
            <div className="flex flex-col justify-end mb-[4px]">
              <p className="text-base text-base-content/60 uppercase text-teal-600 font-semibold">
                USD
              </p>
              <p className="text-xs tracking-tight text-stone-500 font-extrabold">
                OR (500 INR)
              </p>
            </div>
          </div>
        </div>
        <hr className="w-full" />
        <div>
          <p className="text-lg text-teal-600 font-extrabold ">
            What you are paying for!
          </p>
          <p className="text-base-content/60 text-xs mt-1 ">
            Features designed to get your visa approved
          </p>
        </div>
        <ul className="space-y-3.5 leading-relaxed text-base flex-1">
          <li className="flex items-center gap-2">
          <Check />
            <span className="flex flex-col">
              <span>10 AI Mock Interviews</span>
              <span className="text-[9px] text-base-content/60">
                10 Premium AI Visa Mock Interviews with AI Visa officer who will talk in Real-Time
              </span>
            </span>
          </li>
          <li className="flex items-center gap-2">
          <Check />
            <span className="flex flex-col">
              <span>Visa Approved/ Rejected</span>
              <span className="text-[9px] text-base-content/60">
                Get realistic instant feedback. Get a Detailed report mentioning score strengths and weaknes
              </span>
            </span>
          </li>
          <li className="flex items-center gap-2">
          <Check />
            <span className="flex flex-col">
              <span>Premium HD Voices</span>
              <span className="text-[9px] text-base-content/60">
                Human-like AI voices with natural intonation and clarity for a realistic interview experience.
              </span>
            </span>
          </li>
          <li className="flex items-center gap-2">
          <Check />
            <span className="flex flex-col">
              <span>Additional +10 Interviews</span>
              <span className="text-[9px] text-base-content/60">
                If Failed in real US f1 visa, get +10 additional
                interviews for absolutely FREE for practice
              </span>
            </span>
          </li>
          <li className="flex items-center gap-2">
            <Check />
            <span className="flex flex-col">
              <span>Premium Support</span>
              <span className="text-[9px] text-base-content/60">
                Get 24/7 premium support from our dedicated team to help you with any issues or questions.
              </span>
            </span>
          </li>
        </ul>
        <div className="PAY BUTTON flex flex-row gap-2">
          <div className="flex flex-row items-center p-1 gap-2 font-thin">
            <button
              onClick={() => {
                setCurrency("INR");
              }}
              className={`p-1 ${
                currency == "INR" ? "bg-teal-500 rounded-lg text-white" : ""
              }`}
            >
              INR
            </button>
            <div className="h-full border border-gray-500"></div>
            <button
              onClick={() => {
                setCurrency("USD");
              }}
              className={`p-1 ${
                currency == "USD" ? "bg-teal-500 rounded-lg text-white" : ""
              }`}
            >
              USD
            </button>
          </div>
          <PayButton
            currency={currency}
            className={`border border-gray-400
                    [box-shadow:0.0rem_0.25rem_#000]  hover:translate-y-[+0.25rem] hover:[box-shadow:0.0rem_0.0rem_#000] text-white hover:text-white italic font-semibold font-sans bg-teal-500 hover:bg-teal-500 w-24`}
          >
            {" "}
            {currency == "INR" ? "Pay ₹500" : "Pay $5"}{" "}
          </PayButton>
        </div>

        <div className="space-y-2">
        <p className="flex items-center justify-center gap-2 text-xs mt-3 text-center text-base-content/80 font-medium relative">
        Pay once. Access until you get your visa.
        </p>

        </div>
      </div>
    </>
  );
}

export function PlanNoPay() {
    return (
        <>
          <div className=" mt-5 max-w-md shadow-2xl relative flex flex-col bg-white bg-opacity-50 h-full gap-5 lg:gap-8 z-10 bg-base-100 p-8 rounded-lg">
            <div className="flex justify-between items-center gap-4">
              <div>
                <p className="text-lg text-xl font-extrabold">
                  Success Plan (50% off)
                </p>
                <p className="text-base-content/60 text-xs mt-2">
                This plan is designed to boost your confidence and prepare you for your US F-1 student visa interview through AI-driven mock sessions with a virtual Visa Officer.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col justify-end mb-[4px] text-lg ">
                <p className="relative">
                  <span className="text-base-content/80 line-through text-sm font-semibold text-red-500">
                    $9.99 USD
                  </span>
                </p>
              </div>
              <div className="flex gap-2">
                <p className="text-5xl tracking-tight text-teal-600 font-extrabold">
                  $4.99
                </p>
                <div className="flex flex-col justify-end mb-[4px]">
                  <p className="text-base text-base-content/60 uppercase text-teal-600 font-semibold">
                    USD
                  </p>
                  <p className="text-xs tracking-tight text-stone-500 font-extrabold">
                    OR (500 INR)
                  </p>
                </div>
              </div>
            </div>
            <hr className="w-full" />
            <div>
              <p className="text-lg text-teal-600 font-extrabold ">
                What you are paying for!
              </p>
              <p className="text-base-content/60 text-xs mt-1 ">
                Features designed to get your visa approved
              </p>
            </div>
            <ul className="space-y-3.5 leading-relaxed text-base flex-1">
              <li className="flex items-center gap-2">
              <Check />
                <span className="flex flex-col">
                  <span>10 AI Mock Interviews</span>
                  <span className="text-[9px] text-base-content/60">
                    10 Premium AI Visa Mock Interviews with AI Visa officer who will talk in Real-Time
                  </span>
                </span>
              </li>
              <li className="flex items-center gap-2">
              <Check />
                <span className="flex flex-col">
                  <span>Visa Approved/ Rejected</span>
                  <span className="text-[9px] text-base-content/60">
                    Get realistic instant feedback. Get a Detailed report mentioning score strengths and weaknes
                  </span>
                </span>
              </li>
              <li className="flex items-center gap-2">
              <Check />
                <span className="flex flex-col">
                  <span>Premium HD Voices</span>
                  <span className="text-[9px] text-base-content/60">
                    Human-like AI voices with natural intonation and clarity for a realistic interview experience.
                  </span>
                </span>
              </li>
              <li className="flex items-center gap-2">
              <Check />
                <span className="flex flex-col">
                  <span>Additional +10 Interviews</span>
                  <span className="text-[9px] text-base-content/60">
                    If Failed in real US f1 visa, get +10 additional
                    interviews for absolutely FREE for practice
                  </span>
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Check />
                <span className="flex flex-col">
                  <span>Premium Support</span>
                  <span className="text-[9px] text-base-content/60">
                    Get 24/7 premium support from our dedicated team to help you with any issues or questions.
                  </span>
                </span>
              </li>
            </ul>

            <a className="flex w-full gap-2 items-center justify-center border border-gray-500 rounded-lg p-2 shadow-xl hover:shadow-sm" href="/account"> 
            Get Success Plan <ArrowRight />
            </a>
            <div className="space-y-2">
            <p className="flex items-center justify-center gap-2 text-xs mt-3 text-center text-base-content/80 font-medium relative">
            Pay once. Access until you get your visa.
            </p>
    
            </div>
          </div>
        </>
      );
}
