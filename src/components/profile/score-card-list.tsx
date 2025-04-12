'use client'
import { ScoreCard, CardData } from "./score-card"
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client"; 


export function ScoreCardList() {

    const [loading, setLoading] = useState(true);
    const [noConvo, setNoConvo] = useState(false);
    const [dataSet, setDataSet] = useState<CardData[]>([]);

    useEffect(() => {
        async function fetchConversations() {
            const supabase = await createClient(); 
            const { data, error } = await supabase.from('conversations').select('id, conversation, score, created_at, overall_observation, strengths, weaknesses').order('created_at', {ascending: false})

            if (error) { alert(error.message);  return;}

            if(data?.length === 0) {
                setNoConvo(true);
            }
            else
            {
                data.map(({id, conversation, score, created_at, overall_observation, strengths, weaknesses}) => {
                    setDataSet(prevState => [...prevState, {id, conversation, score, created_at, overall_observation, strengths, weaknesses}]);
                });
            }
            setLoading(false);
        }

        fetchConversations();
    }, []);

    if (loading) {
        return <div className="flex w-full h-full justify-center items-center">Loading Conversations... </div>;
    }

    if(noConvo) {
        return (
            <div className="flex p-3 border border-black rounded-lg bg-white flex-col ml-2 mt-5 gap-2">
                <h1 className="text-2xl font-thin">No Interviews of the Past is Analyzed</h1>
                <h1 className="text-2xl font-thin">Please Start a New Interview </h1>
            </div>
        )
    }
    
    return (
        <div className="flex flex-col w-full max-w-4xl gap-2">
            {dataSet.map( (card) => <ScoreCard key={card.id} card={card} /> )}
        </div>
    )
}