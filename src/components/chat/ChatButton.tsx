
import React from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

interface ChatButtonProps {
  onClick: () => void;
  hasNotification?: boolean;
}

const ChatButton: React.FC<ChatButtonProps> = ({ onClick, hasNotification = false }) => {
  return (
    <Button
      onClick={onClick}
      className="relative rounded-full p-3 h-14 w-14 bg-mlbb-purple hover:bg-mlbb-darkpurple shadow-lg flex items-center justify-center"
    >
      <MessageSquare className="h-6 w-6 text-white" />
      {hasNotification && (
        <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
      )}
    </Button>
  );
};

export default ChatButton;
