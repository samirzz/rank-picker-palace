
import React, { createContext, useState, useEffect, useCallback } from "react";
import { Message } from "./types";

interface LiveChatContextType {
  isChatOpen: boolean;
  toggleChat: () => void;
  messages: Message[];
  isLoading: boolean;
  sendMessage: (content: string) => void;
  hasNewMessages: boolean;
}

export const LiveChatContext = createContext<LiveChatContextType>({
  isChatOpen: false,
  toggleChat: () => {},
  messages: [],
  isLoading: false,
  sendMessage: () => {},
  hasNewMessages: false,
});

export const LiveChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewMessages, setHasNewMessages] = useState(false);

  // Load initial messages only once on mount
  useEffect(() => {
    const loadInitialMessages = async () => {
      try {
        // Simulate loading initial messages
        const storedMessages = localStorage.getItem("chatMessages");
        if (storedMessages) {
          setMessages(JSON.parse(storedMessages));
        } else {
          // Default welcome message if no stored messages
          const welcomeMessage: Message = {
            id: "welcome-1",
            content: "Hello! How can I help you today?",
            sender: "agent",
            timestamp: new Date().toISOString(),
          };
          setMessages([welcomeMessage]);
          localStorage.setItem("chatMessages", JSON.stringify([welcomeMessage]));
        }
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };

    loadInitialMessages();
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatMessages", JSON.stringify(messages));
    }
  }, [messages]);

  // Set hasNewMessages when new messages arrive and chat is closed
  useEffect(() => {
    if (messages.length > 0 && !isChatOpen) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === "agent") {
        setHasNewMessages(true);
      }
    }
  }, [messages, isChatOpen]);

  const toggleChat = useCallback(() => {
    setIsChatOpen((prev) => !prev);
    if (!isChatOpen) {
      setHasNewMessages(false);
    }
  }, [isChatOpen]);

  const sendMessage = useCallback((content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate response after a delay
    setTimeout(() => {
      const botMessage: Message = {
        id: `agent-${Date.now()}`,
        content: "Thank you for your message! Our team will get back to you soon.",
        sender: "agent",
        timestamp: new Date().toISOString(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
      
      if (!isChatOpen) {
        setHasNewMessages(true);
      }
    }, 1000);
  }, [isChatOpen]);

  return (
    <LiveChatContext.Provider
      value={{
        isChatOpen,
        toggleChat,
        messages,
        isLoading,
        sendMessage,
        hasNewMessages,
      }}
    >
      {children}
    </LiveChatContext.Provider>
  );
};
