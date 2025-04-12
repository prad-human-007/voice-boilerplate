import React, { useEffect, useRef, useState } from "react";
import { Track } from 'livekit-client';
import { type TrackReferenceOrPlaceholder } from '@livekit/components-core';
import { AgentState } from "@livekit/components-react";
import { CircleOut } from "./circleOut";

export interface AudioPorps {
  trackRef?: TrackReferenceOrPlaceholder;
  agentState?: AgentState
}

export function AudioVisMain({
  trackRef,
  agentState,
}: AudioPorps) {
  const agentStateRef = useRef(agentState);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    console.log('AGENT VIS MAIN HAS BEEN CHANGED TO, ', agentState)
    agentStateRef.current = agentState? agentState : 'speaking';
  }, [agentState])

  useEffect(() => {
    console.log('[VIS MAIN]  Getting Track', trackRef)
    if (!trackRef) return;

    const track = trackRef instanceof Track ? trackRef : trackRef?.publication?.track;
    
    if (!track || !track.mediaStream) return;
    console.log('*** TRACK FOUND in AUDIO VIS MAIN', track)

    const stream = new MediaStream([track.mediaStreamTrack]);
    setStream(stream);
    console.log('[VIS MAIN] STREAM REF: ', stream)

  }, [trackRef]);

  return (
    <div className="audio-visualizer">
      <CircleOut stream={stream!}  />
    </div>
  );
}
  