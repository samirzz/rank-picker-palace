
import React, { useState } from "react";
import ChatWindow from "./ChatWindow";
import ChatButton from "./ChatButton";
import { useChatMessages } from "./useChatMessages";

const LiveChat: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { messages, isLoading, sendMessage } = useChatMessages(isChatOpen);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isChatOpen ? (
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          onClose={toggleChat}
          onSendMessage={sendMessage}
        />
      ) : (
        <ChatButton onClick={toggleChat} />
      )}
    </div>
  );
};

export default LiveChat;
