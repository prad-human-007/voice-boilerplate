import { ScoreCardList } from "@/components/profile/score-card-list"
import { NewConversation } from "@/components/dashboard/NewConversation"

export default function History() {
    return (
        <div className="flex flex-col gap-3 max-w-3xl w-full  min-h-screen h-full">
            <div className="flex flex-col gap-3 ml-2">
                <div className="flex flex-row items-center gap-5">
                    <h1 className="text-3xl font-semibold">History</h1>
                    <div className="border-r-2 border-gray-500 h-7"></div>
                    <div><NewConversation/></div>
                </div>
                <h2 className="italic"> All Your past Interviews are present here</h2>
            </div>
            <ScoreCardList />
        </div>
    )
}