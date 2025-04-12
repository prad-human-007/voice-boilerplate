export const dynamic = 'force-dynamic';

import { 
    AccessToken,
    AccessTokenOptions,
    VideoGrant 
} from "livekit-server-sdk";
import { NextResponse } from "next/server";
import { createClient, User } from '@supabase/supabase-js';

// NOTE: you are expected to define the following environment variables in `.env.local`:
const API_KEY = process.env.LIVEKIT_API_KEY;
const API_SECRET = process.env.LIVEKIT_API_SECRET;
const LIVEKIT_URL = process.env.LIVEKIT_URL;
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
export type ConnectionDetails = {
    serverUrl: string;
    roomName: string;
    participantName: string;
    participantToken: string;
};

export async function GET(req: Request) {
    try {
        const userAuth = await isAuthenticated(req);
        if(userAuth == 'unauthenticated' || user == null) {
          return new NextResponse('Unauthorized', { status: 401})
        }
        else if(userAuth == 'nocredits' || chatsLeft <= 0) {
          return NextResponse.json({ error: 'No credits' }, { status: 402 })
        }

        if (LIVEKIT_URL === undefined) {
        throw new Error("LIVEKIT_URL is not defined");
        }
        if (API_KEY === undefined) {
        throw new Error("LIVEKIT_API_KEY is not defined");
        }
        if (API_SECRET === undefined) {
        throw new Error("LIVEKIT_API_SECRET is not defined");
        }

        const participantIdentity = `voice_assistant_user_${Math.floor(Math.random() * 10_000)}`;
        const roomName = `voice_assistant_room_${Math.floor(Math.random() * 10_000)}`;
        const participantToken = await createParticipantToken(
        { identity: participantIdentity },
        roomName,
        );

        // Return connection details
        const data: ConnectionDetails = {
        serverUrl: LIVEKIT_URL,
        roomName,
        participantToken: participantToken,
        participantName: participantIdentity,
        };

        if(data) {
          await supabase
          .from('roles')
          .update({ chats_left: chatsLeft - 1 })
          .eq('user_id', user.id);
        }

        return NextResponse.json(data);
    } catch (error) {
        if (error instanceof Error) {
        console.error(error);
        return new NextResponse(error.message, { status: 500 });
        }
    }
}

function createParticipantToken(
    userInfo: AccessTokenOptions,
    roomName: string
  ) {
    const at = new AccessToken(API_KEY, API_SECRET, {
      ...userInfo,
      ttl: "15m",
    });
    const grant: VideoGrant = {
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canPublishData: true,
      canSubscribe: true,
    };
    at.addGrant(grant);
    return at.toJwt();
}