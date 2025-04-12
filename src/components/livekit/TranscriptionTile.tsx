import { ChatMessageType, ChatTile } from "@/components/livekit/chat/ChatTile";
import {
  TrackReferenceOrPlaceholder,
  useLocalParticipant,
  useTrackTranscription,
} from "@livekit/components-react";
import {
  LocalParticipant,
  Participant,
  Track,
  TranscriptionSegment,
} from "livekit-client";
import { useEffect, useState } from "react";

export function TranscriptionTile({
  agentAudioTrack,
  accentColor,
  setAllMessages,
}: {
  agentAudioTrack?: TrackReferenceOrPlaceholder;
  accentColor: string;
  setAllMessages: (allMessages: ChatMessageType[]) => void;
}) {
  const agentMessages = useTrackTranscription(agentAudioTrack);
  const localParticipant = useLocalParticipant();
  const localMessages = useTrackTranscription({
    publication: localParticipant.microphoneTrack,
    source: Track.Source.Microphone,
    participant: localParticipant.localParticipant,
  });

  const [transcripts] = useState<Map<string, ChatMessageType>>(new Map());
  const [messages, setMessages] = useState<ChatMessageType[]>([]);

  // store transcripts
  useEffect(() => {
    if (agentAudioTrack) {
      agentMessages.segments.forEach((s) =>
        transcripts.set(
          s.id,
          segmentToChatMessage(
            s,
            transcripts.get(s.id),
            agentAudioTrack.participant
          )
        )
      );
    }
    localMessages.segments.forEach((s) =>
      transcripts.set(
        s.id,
        segmentToChatMessage(
          s,
          transcripts.get(s.id),
          localParticipant.localParticipant
        )
      )
    );

    const allMessages = Array.from(transcripts.values());
    allMessages.sort((a, b) => a.timestamp - b.timestamp);
    setMessages(allMessages);
    setAllMessages(allMessages);
  }, [
    transcripts,
    localParticipant.localParticipant,
    agentAudioTrack?.participant,
    agentMessages.segments,
    localMessages.segments,
  ]);

  return (
    <div className="transcript-tile">
      <ChatTile messages={messages} accentColor={accentColor} />
    </div>
  );
}

function segmentToChatMessage(
  s: TranscriptionSegment,
  existingMessage: ChatMessageType | undefined,
  participant: Participant
): ChatMessageType {
  const msg: ChatMessageType = {
    message: s.final ? s.text : `${s.text} ...`,
    name: participant instanceof LocalParticipant ? "Candidate" : "Visa Officer",
    isSelf: participant instanceof LocalParticipant,
    timestamp: existingMessage?.timestamp ?? Date.now(),
  };
  return msg;
}
