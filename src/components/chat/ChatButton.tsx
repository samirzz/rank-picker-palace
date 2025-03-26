
import React from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

interface ChatButtonProps {
  onClick: () => void;
}

const ChatButton: React.FC<ChatButtonProps> = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      className="rounded-full p-3 h-14 w-14 bg-mlbb-purple hover:bg-mlbb-darkpurple shadow-lg flex items-center justify-center"
    >
      <MessageSquare className="h-6 w-6" />
    </Button>
  );
};

export default ChatButton;
