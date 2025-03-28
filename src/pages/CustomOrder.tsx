
import React, { useState } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CustomOrder: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState<Array<{
    id: string;
    text: string;
    sender: 'user' | 'support';
    timestamp: Date;
  }>>([
    {
      id: '1',
      text: "Hi there! Welcome to our custom order service. Please tell us what you're looking for and our support team will assist you shortly.",
      sender: 'support',
      timestamp: new Date()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isWaitingForSupport, setIsWaitingForSupport] = useState(false);
  
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    const newMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user' as const,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    
    // Simulate waiting for support
    if (!isWaitingForSupport) {
      setIsWaitingForSupport(true);
      
      // Simulate support response after a delay
      setTimeout(() => {
        const supportResponse = {
          id: (Date.now() + 1).toString(),
          text: "Thanks for your inquiry! One of our boost specialists will review your request and get back to you soon. In the meantime, you can add more details about your custom order.",
          sender: 'support' as const,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, supportResponse]);
      }, 1500);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <NavBar />
      
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">Custom Order Request</h1>
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="text-sm"
            >
              Back to Main Page
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel p-6 md:col-span-1">
              <h2 className="text-xl font-semibold mb-4">How It Works</h2>
              <ol className="space-y-4 text-sm md:text-base">
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center bg-mlbb-purple/20 text-mlbb-purple rounded-full w-6 h-6 text-xs mr-3 mt-0.5">1</span>
                  <span>Describe your custom boosting needs in detail</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center bg-mlbb-purple/20 text-mlbb-purple rounded-full w-6 h-6 text-xs mr-3 mt-0.5">2</span>
                  <span>Our specialists will review your request and provide a quote</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center bg-mlbb-purple/20 text-mlbb-purple rounded-full w-6 h-6 text-xs mr-3 mt-0.5">3</span>
                  <span>After you approve, we'll send a payment link</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center bg-mlbb-purple/20 text-mlbb-purple rounded-full w-6 h-6 text-xs mr-3 mt-0.5">4</span>
                  <span>Our boosters will begin work on your custom order</span>
                </li>
              </ol>
              
              <div className="mt-6 pt-6 border-t border-gray-700">
                <h3 className="font-medium mb-2">Need help immediately?</h3>
                <p className="text-sm text-gray-400 mb-4">You can also reach us through:</p>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-sm"
                    onClick={() => window.open('https://discord.gg/your-discord', '_blank')}
                  >
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 71 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z" fill="#5865F2"/>
                    </svg>
                    Join our Discord Server
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full justify-start text-sm"
                    onClick={() => window.open('https://wa.me/1234567890', '_blank')}
                  >
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M16 31C23.732 31 30 24.732 30 17C30 9.26801 23.732 3 16 3C8.26801 3 2 9.26801 2 17C2 19.5109 2.661 21.8674 3.81847 23.905L2 31L9.31486 29.3038C11.3014 30.3854 13.5789 31 16 31ZM16 28.8C22.5176 28.8 27.8 23.5176 27.8 17C27.8 10.4824 22.5176 5.2 16 5.2C9.48244 5.2 4.2 10.4824 4.2 17C4.2 19.4021 4.91531 21.6345 6.15475 23.4739L5 28L9.71724 26.8743C11.5256 28.0559 13.6817 28.8 16 28.8ZM21.5 18.7C22 18.9667 22.5 19.0333 22.6667 18.9C22.8333 18.7667 22.8333 18.2333 22.6 17.7333C22.3667 17.2333 21.0333 16.1333 21.0333 16.1333C20.8333 16 20.6 16 20.4333 16.1333L19.5667 17C19.4 17.1667 19.1667 17.1667 19 17.0667C18.5667 16.9 18.1333 16.6667 17.7333 16.3333C17.4 16 17.0667 15.6333 16.8 15.2667C16.7 15.1 16.7333 14.9333 16.8667 14.8L17.2333 14.4333C17.3333 14.3333 17.3667 14.1333 17.3333 14L16.6667 12.6667C16.5667 12.3667 16.2667 12.2667 16.0333 12.4C15.5333 12.6667 15.0333 13.0667 14.8333 13.6C14.6333 14.1333 14.6333 14.7333 14.8 15.3C14.9667 15.9333 15.2333 16.5 15.6 17C15.8 17.2667 16 17.5 16.2 17.7333C16.7333 18.3667 17.4 18.9 18.1333 19.2333C18.6 19.4333 19.0667 19.6 19.5667 19.6333C20.1333 19.7 20.7 19.5667 21.1 19.2C21.3667 18.9667 21.5 18.8333 21.5 18.7Z" fill="#25D366"/>
                    </svg>
                    WhatsApp Support
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="glass-panel p-6 md:col-span-2 flex flex-col h-[600px]">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="h-5 w-5 text-mlbb-purple" />
                <h2 className="text-xl font-semibold">Live Support</h2>
              </div>
              
              <div className="flex-grow overflow-y-auto mb-4 pr-2 space-y-4">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === 'user' 
                          ? 'bg-mlbb-purple text-white'
                          : 'bg-gray-800 text-white'
                      }`}
                    >
                      <p className="text-sm md:text-base">{message.text}</p>
                      <p className="text-2xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  </div>
                ))}
                {isWaitingForSupport && (
                  <div className="flex justify-start">
                    <div className="bg-gray-800 text-white rounded-lg p-3">
                      <div className="flex gap-1">
                        <span className="animate-pulse">•</span>
                        <span className="animate-pulse delay-100">•</span>
                        <span className="animate-pulse delay-200">•</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <Textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message here..."
                  className="resize-none bg-gray-800 border-gray-700"
                  rows={2}
                />
                <Button 
                  onClick={handleSendMessage} 
                  className="bg-mlbb-purple hover:bg-mlbb-darkpurple self-end"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CustomOrder;
