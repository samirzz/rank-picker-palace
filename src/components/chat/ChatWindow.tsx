
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Message } from "./types";

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  onClose: () => void;
  onSendMessage: (message: string) => Promise<boolean>;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  isLoading,
  onClose,
  onSendMessage,
}) => {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || !user) return;
    
    const success = await onSendMessage(message);
    if (success) {
      setMessage("");
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-lg w-80 md:w-96 flex flex-col">
      <div className="p-3 bg-gray-800 rounded-t-lg flex justify-between items-center">
        <h3 className="text-white font-medium">Live Chat Support</h3>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-1 p-3 max-h-80 overflow-y-auto bg-gray-950 flex flex-col space-y-3">
        {isLoading ? (
          <div className="text-center py-4 text-gray-500">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No messages yet. Start a conversation!
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`${
                msg.is_admin
                  ? "bg-mlbb-purple/20 border-l-2 border-mlbb-purple ml-4"
                  : "bg-gray-800 border-l-2 border-gray-700 mr-4"
              } p-2 rounded shadow`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-gray-400">
                  {msg.is_admin ? "Support Agent" : msg.sender_name}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(msg.created_at).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <p className="text-sm text-gray-200">{msg.content}</p>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-3 bg-gray-800 rounded-b-lg">
        <div className="flex space-x-2">
          <Input
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1 bg-gray-700 border-gray-600 focus:ring-mlbb-purple text-white"
          />
          <Button
            onClick={handleSendMessage}
            size="sm"
            className="bg-mlbb-purple hover:bg-mlbb-darkpurple"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {!user && (
          <p className="text-xs text-gray-500 mt-2">
            You need to be logged in to chat with support.
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
