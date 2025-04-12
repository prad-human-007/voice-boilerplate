type ChatMessageProps = {
    message: string;
    accentColor: string;
    name: string;
    isSelf: boolean;
    hideName?: boolean;
  };
  
  export const ChatMessage = ({
    name,
    message,
    isSelf,
    hideName,
  }: ChatMessageProps) => {
    return (
      <div className={`flex flex-col gap-1 ${hideName ? "pt-0" : "pt-6"}`}>
        {!hideName && (
          <div
            className={`text-${
              isSelf ? "red-500" :"grey-500" 
            } uppercase text-xs`}
          >
            {name}
          </div>
        )}
        <div
          className={`pr-4 text-${
            isSelf ? "grey-500" : + "grey-300"
          } text-sm ${
            isSelf ? "" : "drop-shadow-"
          } whitespace-pre-line`}
        >
          {message}
        </div>
      </div>
    );
  };
  