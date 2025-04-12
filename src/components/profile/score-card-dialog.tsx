import { Dialog, DialogTrigger, DialogContent } from "../ui/dialog"
import { CardData } from "./score-card"
import { Button } from "../ui/button"

export function ScoreCardDialog( {
    card
}: {card: CardData}) {

    return(
        <Dialog >
            <DialogTrigger asChild>
            <Button 
                variant={"outline"} 
                className="border border-gray-500 [box-shadow:0.15rem_0.15rem_#000] hover:translate-x-[+0.15rem] hover:translate-y-[+0.15rem] hover:[box-shadow:0.0rem_0.0rem_#000] bg-amber-300  hover:bg-amber-400 "
            >
                View Details
            </Button>
            </DialogTrigger>
            <DialogContent>
            <h2 className="text-2xl font-bold">Result</h2>
                <div className="flex flex-col pr-2 overflow-y-auto">
                    { card ? <div className="flex flex-col gap-2 ">
                        <div className="border border-gray-400 shadow-md rounded-xl p-2">
                            <h2 className="font-semibold text-lg"> Score </h2> 
                            <div>{card.score} / 10</div>
                        </div>
                        <div className="border border-gray-400 shadow-md rounded-xl p-2">
                            <h2 className="font-semibold text-lg"> Overall Observation </h2> 
                            <div>{card.overall_observation}</div>
                        </div>
                        <div className="border border-gray-400 shadow-md rounded-xl p-2">
                            <h2 className="font-semibold text-lg"> Strengths </h2> 
                            <div>{card.strengths}</div>
                        </div>
                        <div className="border border-gray-400 shadow-md rounded-xl p-2">
                            <h2 className="font-semibold text-lg"> Weaknesses </h2> 
                            <div>{card.weaknesses}</div>
                        </div>
                        </div>
                        :   <div className="flex w-full h-full justify-center items-center">Loading...</div> }
                </div>
            </DialogContent>
        </Dialog>
    )
    
}

