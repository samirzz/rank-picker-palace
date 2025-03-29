
import React, { useState, useEffect, lazy, Suspense } from "react";
import ChatButton from "./ChatButton";
import { useChatMessages } from "./useChatMessages";

// Lazy load the chat window component
const ChatWindow = lazy(() => import("./ChatWindow"));

const LiveChat: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { messages, isLoading, sendMessage, hasNewMessages } = useChatMessages(isChatOpen);

  useEffect(() => {
    // Delay initialization of chat features until after initial page load
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  if (!isInitialized) {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isChatOpen ? (
        <Suspense fallback={
          <div className="w-80 h-96 bg-black/80 rounded-lg flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        }>
          <ChatWindow
            messages={messages}
            isLoading={isLoading}
            onClose={toggleChat}
            onSendMessage={sendMessage}
          />
        </Suspense>
      ) : (
        <ChatButton onClick={toggleChat} hasNotification={hasNewMessages} />
      )}
    </div>
  );
};

export default LiveChat;
