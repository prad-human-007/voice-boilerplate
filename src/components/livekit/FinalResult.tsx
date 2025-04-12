import { Loader } from "lucide-react";
import { Button } from "../ui/button"
import { VisaInterviewFeedback } from "@/zod/VisaInterviewFeedback";
import { z } from "zod";
import { useEffect } from "react";

interface FinalResultProps {
    setResult: (result: boolean) => void;
    setText: (text: z.infer<typeof VisaInterviewFeedback> | null) => void;
    text: z.infer<typeof VisaInterviewFeedback> | null;
}
export default function FinalResult( {setResult, setText, text} : FinalResultProps) {
    useEffect(() => {
        console.log("[Final Result] TEXT ",  text);
    }, [text])
    return(
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-10 p-2">
            <div className="flex flex-col gap-2 bg-white p-4 border border-gray-400 rounded-lg shadow-lg max-w-2xl max-h-2xl">
                <h2 className="text-2xl font-bold">Result</h2>
                <div className="flex flex-col h-96 w-[40rem] max-h-[70vh] pr-2 max-w-[85vw] overflow-y-auto">
                    { text ? <div className="flex flex-col gap-2">
                        <div className="border border-gray-400 shadow-md rounded-xl p-2">
                            <h2 className="font-semibold text-lg"> Score </h2> 
                            <div>{text.score} / 10</div>
                        </div>
                        <div className="border border-gray-400 shadow-md rounded-xl p-2">
                            <h2 className="font-semibold text-lg"> Overall Observation </h2> 
                            <div>{text.overall_observation}</div>
                        </div>
                        <div className="border border-gray-400 shadow-md rounded-xl p-2">
                            <h2 className="font-semibold text-lg"> Strengths </h2> 
                            <div>{text.strengths}</div>
                        </div>
                        <div className="border border-gray-400 shadow-md rounded-xl p-2">
                            <h2 className="font-semibold text-lg"> Weaknesses </h2> 
                            <div>{text.weaknesses}</div>
                        </div>
                        </div>
                        :   <div className="flex w-full h-full justify-center items-center"><Loader className="animate-spin"/></div> }
                </div>
                <Button onClick={() => {
                    setResult(false);
                    setText(null);
                    window.location.reload();
                }}>
                    Close
                </Button>
            </div>
        </div>
    )
}