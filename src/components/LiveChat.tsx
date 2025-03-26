
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  sender_name: string;
  is_admin: boolean;
  created_at: string;
}

const LiveChat: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load previous messages and set up realtime subscription
  useEffect(() => {
    if (!user || !isChatOpen) return;

    const loadMessages = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("chat_messages")
          .select("*")
          .or(`sender_id.eq.${user.id},is_admin.eq.true`)
          .order("created_at", { ascending: true })
          .limit(50);

        if (error) throw error;
        if (data) setMessages(data as Message[]);
      } catch (error) {
        console.error("Error loading messages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();

    // Subscribe to new messages in the channel
    const channel = supabase
      .channel("chat_messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `sender_id=eq.${user.id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `is_admin=eq.true`,
        },
        (payload) => {
          // Only add admin messages for this user
          const newMessage = payload.new as Message;
          // Check if this admin message is a reply to this user
          if (newMessage.recipient_id === user.id) {
            setMessages((prev) => [...prev, newMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, isChatOpen]);

  const handleSendMessage = async () => {
    if (!message.trim() || !user) return;

    try {
      const newMessage = {
        content: message,
        sender_id: user.id,
        sender_name: user.email?.split("@")[0] || "User",
        is_admin: false,
        recipient_id: null, // Admin will see all non-admin messages
      };

      await supabase.from("chat_messages").insert([newMessage]);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isChatOpen ? (
        <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-lg w-80 md:w-96 flex flex-col">
          <div className="p-3 bg-gray-800 rounded-t-lg flex justify-between items-center">
            <h3 className="text-white font-medium">Live Chat Support</h3>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-gray-400 hover:text-white"
              onClick={toggleChat}
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
      ) : (
        <Button
          onClick={toggleChat}
          className="rounded-full p-3 h-14 w-14 bg-mlbb-purple hover:bg-mlbb-darkpurple shadow-lg flex items-center justify-center"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};

export default LiveChat;
