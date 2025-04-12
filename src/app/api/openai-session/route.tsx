import { NextResponse } from "next/server";
import { createClient, User } from '@supabase/supabase-js';
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);
let user: User | null  = null;
let chatsLeft: number = 0;

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
        console.log("User info: ", userInfo.data[0]);
      if(userInfo.data[0].chats_left <= 0) {
        return 'nocredits';
      }
      else {
        chatsLeft = userInfo.data[0].chats_left;
        return userInfo.data[0].role;
      }
    }
    else {
      console.log("Error in receiving user info: ", userInfo.error);
      return 'unauthenticated';
    }
    
}

export async function POST(req: Request) {

    const userAuth = await isAuthenticated(req);
    if(userAuth == 'unauthenticated' || user == null) {
        return new NextResponse('Unauthorized', { status: 401})
    }
    else if(userAuth == 'nocredits' || chatsLeft <= 0) {
        return NextResponse.json({ error: 'No credits' }, { status: 402 })
    }

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


    if (client_secret) {
        const { data } = await supabase
            .from('roles')
            .select('*')
            .eq('user_id', user.id);

        if (data) {
            await supabase
                .from('roles')
                .update({ chats_left: chatsLeft - 1 })
                .eq('user_id', user.id);
        } else {
            const insertRole = await supabase.from('roles').insert([{user_id: user.id, role: 'user', chats_left: 0}])
            const insertProfiles = await supabase.from('profiles').insert([{user_id: user.id, username: user.email}])
            if(insertRole.error || insertProfiles.error) {
                console.error("Error in inserting user: Role", insertRole.error, "Profle: ", insertProfiles.error);
                return NextResponse.json({ error: 'Error in inserting user' }, { status: 500 });
            }
            else {
                console.log("User Created When Generating Token: ", insertRole, insertProfiles);
            }
        }
    }
    else {
        return NextResponse.json({ error: 'Error in generating client secret' }, { status: 500 });
    }

    console.log("Client secret: ", client_secret);

    return NextResponse.json({ client_secret});
}