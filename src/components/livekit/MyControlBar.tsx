
import { AgentState } from "@livekit/components-react";
import { CloseIcon } from "./CloseIcon";
import { useEffect, useRef, useState } from "react";
import { useRoomContext } from "@livekit/components-react";
import { Button } from "../ui/button";
import { VoiceControlBar } from "./VoiceControlbar";
import { Loader} from "lucide-react";

export default function MyControlBar(props: {
  onConnectButtonClicked: () => void;
  agentState: AgentState;
  setConvoEnd: (convoEnd: boolean) => void ;
}) {

  const waitTime = Number(process.env.NEXT_PUBLIC_INTERVIEW_TIME)
  const room = useRoomContext()
  const [time, setTime] = useState(waitTime); 
  const timerRef = useRef<NodeJS.Timeout| null>(null);
  const [ clicked , setClicked ] = useState(false);

  useEffect(() => {
    return () => disconnectRoom();
  }, [])

  useEffect(() => {
    console.log("*** AGENT STATE: ***", props.agentState)
    if(props.agentState === 'initializing') startTimer();
  }, [props.agentState])

  const startTimer = () => {
    if (timerRef.current || time<0) return;

    timerRef.current = setInterval(() => {
      setTime((prev_time) => {
        console.log("Time: ", prev_time)
        if (prev_time <= 0) {
          disconnectRoom();
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

  function disconnectRoom() {
    if(room.state == 'connected') {
      console.log(`[ControlBar] Disconnecting room`);
      room.disconnect(true)
      props.setConvoEnd(true)
    }
    resetTimer();
  }

  return (
    <div className="">
      {props.agentState === "disconnected" && (
        <Button
          className={`connect-button uppercase border border-gray-500 [box-shadow:0.25rem_0.25rem_#000] ${clicked? 'translate-x-[+0.25rem] translate-y-[+0.25rem] [box-shadow:0.0rem_0.0rem_#000] bg-blue-600': 'bg-blue-500'} hover:bg-blue-600`}
          onClick={() => {
            props.onConnectButtonClicked() 
            setClicked(true)
          }}
        >
          Start a conversation
        </Button>
      )}

      {props.agentState === "connecting" && (
        <div>
          <Loader className="animate-spin" />
        </div>
      )}
      
      {props.agentState !== "disconnected" &&
        props.agentState !== "connecting" && (
          <div className="control-bar flex  gap-2 items-center justify-center">
            <VoiceControlBar />
            <Button className=" bg-red-500" onClick={disconnectRoom}>
              <CloseIcon />
            </Button>
            {formatTime(time)}
          </div>
      )}
    </div>
  );
}