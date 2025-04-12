'use client'
import { useEffect, useRef, useState } from "react";
import { CircleOut } from "@/components/livekit/audioAnim/circleOut";
import { Button } from "@/components/ui/button";
import { UserDropdown } from "@/components/home/user-dropdown";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { FinalResultOAI } from "@/components/livekit/FinalResultOAI";
import { VisaInterviewFeedback } from "@/zod/VisaInterviewFeedback";
import { z } from "zod";
import { DotStream, DotPulse } from "@/components/ui/Loaders";
import Image from "next/image";
import { VisaTypeSelector } from "@/components/visa-type";


interface Msg {
    type: string
    event_id: string
    item_id: string;
    transcript: string;
}

interface AgentInput {
  type: "message";
  role: 'system' | 'user' | 'assistant';
  content: {
    type: "input_text";
    text: string;
  }[];
}

export type AgentState = "preconnected" | "connecting" | "connected" | "disconnected";



export default function Voice() {
    // AUTH 
    const router = useRouter();
    // Timer
    const waitTime = Number(process.env.NEXT_PUBLIC_INTERVIEW_TIME)
    const [time, setTime] = useState(waitTime); 
    const timerRef = useRef<NodeJS.Timeout| null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const endAudioRef = useRef<HTMLAudioElement | null>(null)
    const peerConectionRef = useRef<RTCPeerConnection | null>(null);
    const datachannelRef = useRef<RTCDataChannel | null>(null);
    const localMediaStreamRef = useRef<MediaStream | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [messages, setMessages] = useState<Msg[]>([]);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [agentState, setAgentState] = useState<AgentState>("preconnected");
    const [ assesment, setAssesment ] = useState<z.infer<typeof VisaInterviewFeedback> |  null>(null)
    const [ userUnpaid, setUserUnpaid ] = useState(false);
    const [ visaType, setVisaType]  = useState('F1 Visa')
    

    useEffect(() => {
        if(agentState === 'preconnected') {
            resetVariables();
            resetTimer();
            setMessages([]);
            setAssesment(null);
            setUserUnpaid(false);
            setStream(null);
        }
        if(agentState === 'connected') {
            startTimer();
        }
        if(agentState === 'disconnected') {
            // setAssesmentData();
        }

    }, [agentState]);


    const startTimer = () => {
        if (timerRef.current || time<0) return;

        timerRef.current = setInterval(() => {
            setTime((prev_time) => {
            // console.log("Time: ", prev_time)
            if(prev_time == 8) {
              if(audioRef.current) {
                audioRef.current.pause()
                audioRef.current.srcObject = null
              }
            }
            if(prev_time == 6) {
              if(endAudioRef.current)
                endAudioRef.current.play()
            }
            if (prev_time <= 0) {
                endSession();
                return 0;
            }
            return prev_time - 1;
            })
        }, 1000)
    }
    
    const resetTimer = () => {
        if(timerRef.current) {
            clearInterval(timerRef.current)
            timerRef.current = null;
        }
        setTime(waitTime);
    }

    const formatTime = (seconds: number) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
    };
    
    function endSession() {
        setAgentState("preconnected");
        resetVariables();
        resetTimer();
    }

    function resetVariables() {
        if(localMediaStreamRef.current) {
            localMediaStreamRef.current.getTracks().forEach((track) => {
                track.stop();
            });
            localMediaStreamRef.current = null;
        }

        if (datachannelRef.current) {
            datachannelRef.current.close();
        }

        if (peerConectionRef.current) {
            peerConectionRef.current.getSenders().forEach((sender) => {
                if (sender.track) {
                    sender.track.stop();
                }
                });
            peerConectionRef.current.close();
        }

        datachannelRef.current = null;
        peerConectionRef.current = null;

    }

    function agentSpeak(input: AgentInput[] | null = null) {
      if (datachannelRef.current && datachannelRef.current.readyState === "open") {
          const event = {
              event_id: "convo_end",
              type: "response.create",
              response: {
                  modalities: ["text", "audio"], // Get both text and audio
                  output_audio_format: "pcm16",
                  temperature: 0.8,
                  max_output_tokens: 1024,
                  input: input
              }
          };
          datachannelRef.current.send(JSON.stringify(event));
          console.log("Sent disconnect request:", event);
      } else {
          console.warn("DataChannel is not open");
      }
    }

    function addMessage(e: MessageEvent) {
        // console.log("Message: ", e)
        const data = JSON.parse(e.data);
        if(data && data.type === "conversation.item.created") {
            console.log("CREATED CONVERSATION:", data.item.id, "PREV MSG ", data.previous_item_id, data)
            setMessages((prev) => [...prev, {
                    type: "User", 
                    event_id: data.event_id,
                    item_id: data.item.id, 
                    transcript: ""
                }]
            )
        }
        if(data && data.type === "conversation.item.input_audio_transcription.completed") {
            // console.log("Msg Id:", data.item_id, "User Msg: ", data.transcript, data)
            setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                    msg.item_id === data.item_id ? { ...msg, type: 'User', transcript: (msg.transcript + data.transcript) || '---'} : msg
                )
            );
        }
        if(data && data.type === "response.audio_transcript.delta") {
            
            // console.log("Resp Id:", data.response_id, "Response Msg: ", data.delta, data)
            setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                    msg.item_id === data.item_id ? { ...msg, type: 'Agent', transcript: msg.transcript + data.delta } : msg
                )
            );
        }
        if(data && data.type === "error") {
            console.log("ERROR", data)
        }
    }

    async function init() {
        if(!audioRef.current) return;  
        try {
            // Get an ephemeral key from your server
            console.log("Fetching token")
            setAgentState("connecting");
            const tokenResponse = await fetch("/api/openai-session", { 
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ visaType }),
            });
            if(!tokenResponse.ok) { 
                setAgentState('preconnected'); 
                if(tokenResponse.status === 401) { alert("Unauthorized") }
                if(tokenResponse.status === 402) { alert("No credits")}
                return;
            }
            
            
            const data = await tokenResponse.json();
            console.log("Token response:", data);
            const EPHEMERAL_KEY = data.client_secret.value;

            console.log("Ephemeral key:", EPHEMERAL_KEY);
            // Create a peer connection
            peerConectionRef.current = new RTCPeerConnection();
            peerConectionRef.current.onconnectionstatechange = () => {
                if(peerConectionRef.current) {
                    if (peerConectionRef.current.connectionState === "connected") {
                        setAgentState("connected");
                    }
                }
            }

            // Set up to play remote audio from the model
            peerConectionRef.current.ontrack = (e: RTCTrackEvent) => {
                if (audioRef.current) {
                    audioRef.current.srcObject = e.streams[0];
                }
                setStream(e.streams[0]);
            };

            // Add local audio track for microphone input in the browser
            localMediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
            peerConectionRef.current.addTrack(localMediaStreamRef.current.getTracks()[0]);
            console.log("Added local audio track", localMediaStreamRef.current.getTracks()[0]);

            // Set up data channel for sending and receiving events
            datachannelRef.current = peerConectionRef.current.createDataChannel("oai-events");
            datachannelRef.current.addEventListener("message", (e) => {
                addMessage(e);
            });
            datachannelRef.current.onopen = () => {
              agentSpeak();
            }

            // Start the session using SDP
            const offer = await peerConectionRef.current.createOffer();
            await peerConectionRef.current.setLocalDescription(offer);

            const baseUrl = "https://api.openai.com/v1/realtime";
            const model = process.env.NEXT_PUBLIC_REALTIME_MODEL_NAME;
            const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
                method: "POST",
                body: offer.sdp,
                headers: {
                    Authorization: `Bearer ${EPHEMERAL_KEY}`,
                    "Content-Type": "application/sdp",
                },
            });

            const answer: RTCSessionDescriptionInit = {
                type: 'answer',
                sdp: await sdpResponse.text(),
            };
            await peerConectionRef.current.setRemoteDescription(answer);

            console.log("Peer connection established", peerConectionRef.current);
        } catch (error) {
            console.error("Error initializing WebRTC session:", error);
        }
    }

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <div className=" w-full h-screen">   
            <div className="flex flex-col items-center gap-4 p-3 mt-4">
                
                <CircleOut stream={stream}/>
                
                {/* Control Buttons */}
                {
                    agentState === "preconnected" && (
                        <div className="flex flex-row items-center gap-3">
                            <Button 
                                className={`connect-button uppercase border border-gray-500 [box-shadow:0.0rem_0.25rem_#000] ${false? 'translate-x-[+0.25rem] translate-y-[+0.25rem] [box-shadow:0.0rem_0.0rem_#000] bg-blue-600': 'bg-blue-500'} hover:bg-blue-600`}
                                onClick={init}>
                                Start Interview
                            </Button>
                            <VisaTypeSelector type={visaType} setVisaType={setVisaType}/>
                        </div>
                    )
                }
                {
                    
                    agentState === "connecting" && (
                        <div>
                            <DotPulse color="#1E88E5" />
                        </div>
                    )
                }
                {
                    agentState === "connected" && (
                        <div className="flex flex-row gap-2 items-center justify-center">
                            <Button className=" bg-red-500" onClick={endSession}>
                                Disconnect
                            </Button>
                            {formatTime(time)}
                        </div>
                    )
                }
                
                {/* Messages */}
                <div className="overflow-y-auto h-96 max-w-2xl w-full bg-white bg-opacity-30 shadow-2xl p-4 mt-2 rounded-lg">
                    <div className="">
                        {messages.map((m) => (
                            <div className={`flex flex-col  gap-1 border-b-2 p-3`} key={m.event_id}>
                                <h3 className={`text-lg ${m.type == 'Agent'? 'text-red-600 ': 'text-black text-right'}`}>{m.type} Message</h3>
                                <p className={`flex text-gray-600 italic ${m.type == 'Agent'? '': 'text-right justify-end '}`}>{ m.transcript || <DotStream color="#1E88E5"/>}</p>
                                <div className={`w-full `}></div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
                
                <audio ref={audioRef} autoPlay />
                <audio ref={endAudioRef} src="/assets/aivoice.mp3"/>
            </div>
        </div>
    );
}
