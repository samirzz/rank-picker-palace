
import React, { useContext } from "react";
import ChatWindow from "./chat/ChatWindow";
import ChatButton from "./chat/ChatButton";
import { LiveChatContext, LiveChatProvider } from "./chat/LiveChatContext";

const LiveChatComponent: React.FC = () => {
  const { isChatOpen, toggleChat, messages, isLoading, sendMessage, hasNewMessages } = useContext(LiveChatContext);

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
        <ChatButton onClick={toggleChat} hasNotification={hasNewMessages} />
      )}
    </div>
  );
};

// Export a wrapped version with the provider for use at the app level
const LiveChat: React.FC = () => {
  return (
    <LiveChatProvider>
      <LiveChatComponent />
    </LiveChatProvider>
  );
};

export default LiveChat;
