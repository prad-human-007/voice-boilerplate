import { 
    useVoiceAssistant,
    AgentState,
    TrackReference,
 } from "@livekit/components-react";
 import { AudioVisMain } from "./audioAnim/AudioVisMain";
import { useEffect } from "react";

export function SimpleVoiceAssistant(props: {
    onStateChange: (state: AgentState) => void;
    onAudioTrackChange: (track: TrackReference) => void;
  }) {
    const { state, audioTrack} = useVoiceAssistant();
    console.log("AUdio track in SimpleVoiceAssistant:", audioTrack, "Agent State: ", state) 
    useEffect(() => {
      props.onStateChange(state);
      props.onAudioTrackChange(audioTrack!)
    }, [props, state]);
  
    return (
      <div className="flex flex-col gap-2  ">
        <AudioVisMain trackRef={audioTrack} agentState={state}/>
      </div>
    );
  }  