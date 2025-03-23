
import React from "react";
import { Mail, MessageSquare } from "lucide-react";

interface ContactSectionProps {
  isIntersecting?: boolean;
}

const ContactSection: React.FC<ContactSectionProps> = ({ isIntersecting = false }) => {
  return (
    <section id="contact" className="py-16 md:py-20 px-4 bg-gradient-to-b from-black to-mlbb-blue/70 relative">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8 md:mb-12">
          <span className="inline-block text-xs md:text-sm px-3 py-1 rounded-full bg-mlbb-purple/10 border border-mlbb-purple/30 text-mlbb-lightpurple mb-3">
            Get In Touch
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">Need <span className="text-mlbb-purple">Help?</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto px-2 text-sm md:text-base">
            Our customer support team is available 24/7 to assist you with any questions.
          </p>
        </div>
        
        <div className="glass-panel p-4 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="text-center md:text-left">
              <h3 className="text-lg md:text-xl font-semibold mb-4">Contact Information</h3>
              <p className="text-gray-400 mb-6 text-sm md:text-base">
                Feel free to reach out to us anytime. We're here to help you achieve your gaming goals.
              </p>
              
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row items-center md:items-start">
                  <Mail className="h-5 w-5 text-mlbb-purple mb-2 md:mb-0 md:mr-3 md:mt-0.5" />
                  <div className="text-center md:text-left">
                    <p className="text-white font-medium">Email</p>
                    <p className="text-gray-400 text-xs md:text-sm">support@mlbooster.com</p>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-center md:items-start mt-4 md:mt-0">
                  <MessageSquare className="h-5 w-5 text-mlbb-purple mb-2 md:mb-0 md:mr-3 md:mt-0.5" />
                  <div className="text-center md:text-left">
                    <p className="text-white font-medium">Live Chat</p>
                    <p className="text-gray-400 text-xs md:text-sm">Available 24/7</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 md:mt-8 inline-block">
                <span className="text-xs font-medium text-mlbb-lightpurple bg-mlbb-purple/10 px-3 py-1 rounded-full border border-mlbb-purple/30">
                  Average Response Time: &lt; 5 minutes
                </span>
              </div>
            </div>
            
            {/* Live Chat Button */}
            <div className="flex flex-col justify-center items-center mt-6 md:mt-0">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-r from-mlbb-purple to-mlbb-darkpurple flex items-center justify-center mb-4 shadow-lg shadow-mlbb-purple/20 animate-pulse-subtle">
                <MessageSquare className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <h4 className="text-base md:text-lg font-semibold mb-2">Start Live Chat</h4>
              <p className="text-gray-400 text-xs md:text-sm text-center mb-4 md:mb-6 px-4 md:px-0">
                Connect instantly with our support team
              </p>
              <button className="bg-mlbb-purple hover:bg-mlbb-darkpurple text-white px-4 md:px-6 py-2 md:py-3 text-sm md:text-base rounded-lg transition-all duration-300 transform hover:scale-105">
                Chat Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
