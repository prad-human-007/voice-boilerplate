"use client";

import {
  LiveKitRoom,
  RoomAudioRenderer,
  AgentState,
  TrackReference,
} from "@livekit/components-react";
import { useCallback, useEffect, useState } from "react";
import { MediaDeviceFailure } from "livekit-client";
import type { ConnectionDetails } from "../api/connection-details/route";
import { NoAgentNotification } from "@/components/livekit/NoAgentNotification";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { TranscriptionTile } from "@/components/livekit/TranscriptionTile";
import MyControlBar from "@/components/livekit/MyControlBar";
import FinalResult from "@/components/livekit/FinalResult";
import { ChatMessageType } from "@/components/livekit/chat/ChatTile";
import { SimpleVoiceAssistant } from "@/components/livekit/SimpleVoiceAssistant";
import { VisaInterviewFeedback } from "@/zod/VisaInterviewFeedback";
import {  z } from "zod"; 
import { User } from "@supabase/supabase-js";
import { UserDropdown } from "@/components/home/user-dropdown";
import UnpaidResult from "@/components/livekit/UnpaidResult";

export default function Page() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [connectionDetails, updateConnectionDetails] = useState<ConnectionDetails | undefined>(undefined);
  const [agentState, setAgentState] = useState<AgentState>("disconnected");
  const [audioTrack, setAudioTrack] = useState<TrackReference | undefined>(undefined);
  const [allMessages, setAllMessages] = useState<ChatMessageType[]>([]);
  const [ result, setResult ] = useState(false);
  const [ unpaidResult , setUnpaidResult ] = useState(false);
  const [ assesment, setAssesment ] = useState<z.infer<typeof VisaInterviewFeedback> |  null>(null)
  const [ convoEnd, setConvoEnd ] = useState(false);
  const [ token, setToken ] = useState('')
  const [ user, setUser ] = useState<User | null>(null)
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: {session } , error }) => {
      if (error || !session?.user) {
        router.replace("/sign-in"); 
      } else {
        setUser(session.user)
        setToken(session.access_token)
        setIsAuthenticated(true)
      }
    });
  }, []);

  const onConnectButtonClicked = useCallback(async () => {
    const url = new URL(
      process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT ??
      "/api/connection-details",
      window.location.origin
    );
    const response = await fetch(url.toString(), {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    });
    if(response.status === 200) {
      const connectionDetailsData = await response.json();
      updateConnectionDetails(connectionDetailsData);
    }
    else {
      const error = await response.json();
      alert("Error in fetching connection details " + error.error)
    }
    
  }, [token]);

  function onDeviceFailure(error?: MediaDeviceFailure) {
    console.error(error);
    alert(
      "Error acquiring camera or microphone permissions. Please make sure you grant the necessary permissions in your browser and reload the tab"
    );
  }

  const printMsg = async () => {
    console.log("ALL MESSAGES: in Print msg ", allMessages)
    if(allMessages) {
      setResult(true)
      let msgCombine = ''
      allMessages.forEach((element) => {
          console.log(element)
          msgCombine += "{ 'Speaker': '" + element.name + "', 'Says' : '" + element.message + "' } ";
      });
      try{
        const response = await fetch('/api/score/', {
          method: 'POST',
          headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'text/plain'
            },
            body: 'This is the conversation:  ' + msgCombine,
        })
        const message = await response.json()
        if(message.message === 'notpaid') {
          setResult(false)
          setUnpaidResult(true)
          return;
        }
        const feedback = VisaInterviewFeedback.parse(message);
        setAssesment(feedback)
      }
      catch(e) {
        console.log("Error in fetching score: ", e)
      }
      
    }
    setConvoEnd(false)
  }

  useEffect(() => {
    if(convoEnd) {
        printMsg()
        setConvoEnd(false)
    }
  }, [convoEnd])

  if(!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <h1> Loading... </h1>
      </div>
        
    )
  }

  return (
    <main
      // data-lk-theme="default"
      className={`voice-page dashboard-grid`}
    >
        {/* NAVBAR */}
        <div className="flex justify-center w-full px-2">
          <div className="flex flex-row w-full max-w-7xl justify-between items-center gap-3 p-3 border bg-gradient-to-r from-blue-400 to-green-400 border-black rounded-xl mt-2 "> 
            <a href="/" className="text-lg font-extrabold italic"> Visa Prep AI</a>
            <div className="flex flex-row gap-2">
                {user && <UserDropdown/> }
          </div>
        </div>
        
            
        </div>
        <div className="" >
            <LiveKitRoom
                token={connectionDetails?.participantToken}
                serverUrl={connectionDetails?.serverUrl}
                connect={connectionDetails !== undefined}
                audio={true}
                video={false}
                onMediaDeviceFailure={onDeviceFailure}
                onDisconnected={() => {
                    updateConnectionDetails(undefined);
                }}
                className="flex flex-col justify-center gap-1 items-center h-screen w-full"

            >
                <SimpleVoiceAssistant onStateChange={setAgentState} onAudioTrackChange={setAudioTrack} />
                <MyControlBar
                    onConnectButtonClicked={onConnectButtonClicked}
                    agentState={agentState}
                    setConvoEnd={setConvoEnd}
                />                
                <div>
                    <TranscriptionTile
                        agentAudioTrack={audioTrack}
                        accentColor={'cyan'}
                        setAllMessages={setAllMessages}
                    />
                </div>               
                <RoomAudioRenderer />
                <NoAgentNotification state={agentState} />
            </LiveKitRoom>
        </div>

        {result && (
            <FinalResult setResult={setResult} setText={setAssesment} text={assesment}/>
        )}

        {unpaidResult && (
            <UnpaidResult setResult={setUnpaidResult}/> 
        )}
        
    </main>
  );
}
