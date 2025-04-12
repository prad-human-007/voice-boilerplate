'use client'
import { ArrowRight, TriangleAlert } from "lucide-react";
import { Button } from "../ui/button"
import { useRouter } from "next/navigation";


interface UnpaidResultProps {
    setResult: (result: boolean) => void;
}
export default function UnpaidResult( {setResult} : UnpaidResultProps) {
    const router = useRouter()
    return(
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-10 p-2">
            <div className="flex flex-col gap-2 bg-white p-4 border border-gray-400 rounded-lg shadow-lg max-w-2xl max-h-2xl">
                <h2 className="text-2xl font-bold">Result</h2>
                <div className="flex flex-col h-96 w-[40rem] max-h-[70vh] pr-2 max-w-[85vw] overflow-y-auto">
                    {  <div className="flex flex-col gap-2">
                        <div className="rounded-xl p-2">
                        <h2 className="flex flex-row gap-2 font-semibold text-lg text-red-500"> <TriangleAlert/> You Have Made few Mistakes in Your Answers</h2> 
                            <h2 className="font-semibold text-lg"> Buy Credits to View Score & Improvements</h2> 
                        </div>
                        <Button className="bg-blue-500 border border-black font-bold" onClick={() => {router.push('/account')}}>Buy Credits from Dashboard <ArrowRight/> </Button>
                        <div className="border border-gray-400 shadow-md rounded-xl p-2">
                            <h2 className="font-semibold flex flex-row gap-2 text-lg"> Score <TriangleAlert color="red"/> <div className="text-red-500">Low Score</div> </h2> 
                            <div className="blur-sm text-red-500">******</div>
                        </div>
                        <div className="border border-gray-400 shadow-md rounded-xl p-2">
                            <h2 className="font-semibold text-lg"> Overall Observation </h2> 
                            <div className="">Will Provide Overall Analysis of the Interview </div>
                        </div>
                        <div className="border border-gray-400 shadow-md rounded-xl p-2">
                            <h2 className="font-semibold text-lg"> Strengths </h2> 
                            <div className="">Hilights the Correct Responses in the Interview</div>
                        </div>
                        <div className="border border-gray-400 shadow-md rounded-xl p-2">
                            <h2 className="font-semibold text-lg"> Weaknesses </h2> 
                            <div className="">Identifies the Missing Points in the Answers</div>
                        </div>
                        </div>
                        }
                </div>
                <Button onClick={() => {
                    setResult(false);
                    window.location.reload();
                }}>
                    Close
                </Button>
            </div>
        </div>
    )
}