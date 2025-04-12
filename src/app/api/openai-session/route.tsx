import { NextResponse } from "next/server";
import { createClient, User } from '@supabase/supabase-js';
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);
let user: User | null  = null;
let chatsLeft: number = 0;



export async function POST(req: Request) {

    


    const { visaType } = await req.json();
    let instructions = `Act like a US visa interview officer who will ask questions to the user. 
                            The user has applied for ${visaType} visa. 
                            Verify answers with the Visa type applied for 
                            The user will answer the questions. Be strict in asking questions. 
                            Always talk in English. Analyze Everything that the user is saying.
                            If something seems doubtfull then ask the user about it again.`
                            
    if( visaType == 'IELTS' || visaType == 'TOFEL') {
        console.log("Visa Type: ", visaType);
        instructions = `Act like an ${visaType} examinor who will ask questions to the user. 
                            The user has applied for ${visaType} exam. 
                            Verify answers with the Exam type applied for 
                            The user will answer the questions. Be strict in asking questions. 
                            Always talk in English. Analyze Everything that the user is saying.
                            If something seems doubtfull then ask the user about it again.`
    }

    const r = await fetch("https://api.openai.com/v1/realtime/sessions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: process.env.NEXT_PUBLIC_REALTIME_MODEL_NAME,
            voice: "alloy",
            instructions: instructions,
            "input_audio_transcription": {
                "model": "whisper-1"
            }
        }),
    });
    const { client_secret } = await r.json();


    console.log("Client secret: ", client_secret);

    return NextResponse.json({ client_secret});
}