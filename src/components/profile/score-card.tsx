import { TriangleAlert } from "lucide-react"
import { Card } from "../ui/card"
import { ScoreCardDialog } from "./score-card-dialog"


export interface CardData {
    id: string,
    created_at: string,
    score: number,
    conversation: string,
    overall_observation: string,
    strengths: string,
    weaknesses: string

}

export function ScoreCard( {card}: {card: CardData}) {
    
    return (
        <Card  key={card.id} className="flex flex-col p-3 gap-2 border border-gray-500 hover:shadow-lg transition " >
          <div>
            <div className="flex"><h3 >{`The Probability of pass the Interview is`}</h3> <h2 className={`flex gap-1 items-center ml-1 ${card.score<8? 'text-red-500': ''}`}>{card.score * 10}% {card.score<8? <div><TriangleAlert size={18}/></div>: ''}</h2></div>
            <h3 className="text-sm text-gray-800">Conversation at {new Date(card.created_at).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' })}</h3>
          </div>
          <div>
            <ScoreCardDialog card={card}/>
          </div>
          
        </Card>
    )
}