import { ChatMessage } from "@/components/livekit/chat/ChatMessage";
import { ChatMessage as ComponentsChatMessage } from "@livekit/components-react";
import { useEffect, useRef } from "react";

export type ChatMessageType = {
  name: string;
  message: string;
  isSelf: boolean;
  timestamp: number;
};

type ChatTileProps = {
  messages: ChatMessageType[];
  accentColor: string;
  onSend?: (message: string) => Promise<ComponentsChatMessage>;
};

export const ChatTile = ({ messages, accentColor }: ChatTileProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [containerRef, messages]);

  return (
    <div className="chat-tile flex flex-col w-screen h-full justify-center p-4 gap-4 items-center">
        <div ref={containerRef} className="flex flex-col bg-white p-3 w-[40rem] h-96 max-w-full max-h-full border-2 rounded-lg overflow-y-auto">
          {messages.map((message, index, allMsg) => {
            const hideName =
              index >= 1 && allMsg[index - 1].name === message.name;
            return (
              <ChatMessage
                key={index}
                hideName={hideName}
                name={message.name}
                message={message.message}
                isSelf={message.isSelf}
                accentColor={accentColor}
              />
            );
          })}
        </div>
    </div>
  );
};
