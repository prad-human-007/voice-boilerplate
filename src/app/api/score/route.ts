import { NextRequest, NextResponse } from 'next/server';
import { createClient, User } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { zodResponseFormat } from "openai/helpers/zod";
import { VisaInterviewFeedback } from '@/zod/VisaInterviewFeedback';

const openai = new OpenAI();
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);
let user: User | null  = null;



async function isAuthenticated(req: Request): Promise<string> {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return 'unauthenticated';
    }

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data || data.user.role != 'authenticated') {
      console.error('Failed to authenticate user: ', token, "Error: ", error);  
      return 'unauthenticated';
    }
    user = data.user;
    
    const userInfo = await supabase.from('roles').select('*').eq('user_id', data.user.id);
    if(userInfo.data){
      if(userInfo.data[0].role !== 'paid') return 'notpaid';
      else return 'paid';
    }
    else {
      console.log("Error in receiving user info: ", userInfo.error);
      return 'unauthenticated';
    }
    
  }

export async function POST(request: NextRequest) {
    try {
        const userAuth = await isAuthenticated(request);
        if(userAuth == 'unauthenticated' || user == null) {
            return new NextResponse('Unauthorized', { status: 401})
        }
        

        const conversation = await request.text();
        console.log(conversation);
        
        if(userAuth == 'notpaid') {
          try{
            const response = await supabase.from('conversations').insert([{user_id: user.id, conversation: conversation,score: '--/10', overall_observation: 'Need to Pay for Results', strengths: '', weaknesses: ''}]);
            console.log("Response from insert: ", response);
            return NextResponse.json({message : 'notpaid'});
          }
          catch(error) {
            console.log("Error inserting data: ", error);
            return NextResponse.json({message: 'Error inserting data'}, {status: 500});
          }
          
        }

        const completion = await openai.beta.chat.completions.parse({
            model: "gpt-4o",
            messages: [
                { 
                role: "system", 
                content: `You are an evaluator for a visa interview conversation.
                            Your task is to provide feedback in JSON format with the following structure:

                            {
                            "score": float,  // A score between 1 and 10 (can be fractional)
                            "overall_observation": string,  // General comments about the conversation
                            "strengths": string,  // What the applicant did well
                            "weaknesses": string   // Areas where the applicant can improve
                            }

                            Ignore typographical and punctuation errors since this is a transcribed voice conversation.
                            If incorrect words are used, provide suggestions for pronunciation improvement.
                            Always respond with a valid JSON object.`
                },
                {
                role: "user",
                content: conversation, // Replace `data` with the transcribed conversation
                },
            ],
            response_format: zodResponseFormat(VisaInterviewFeedback, "feedback"),
        });

        
        const event = completion.choices[0].message.parsed;
        if(event) {
          const response = await supabase.from('conversations').insert([{user_id: user.id, conversation: conversation,score: event.score, overall_observation: event.overall_observation, strengths: event.strengths, weaknesses: event.weaknesses}]);
          console.log("Response from insert: ", response);
        }
        else 
          return NextResponse.json({message: 'Retriving Event'}, {status: 500}); 
        

        return NextResponse.json(event);
    } catch (error) {
        console.log("Error processing request: ", error);
        return NextResponse.json({ message: 'Error processing request', error }, { status: 500 });
    }
}