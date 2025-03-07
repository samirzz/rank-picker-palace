
import React from "react";
import { Mail, MessageSquare } from "lucide-react";

const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-20 px-4 bg-gradient-to-b from-black to-mlbb-blue/70 relative">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <span className="inline-block text-sm px-3 py-1 rounded-full bg-mlbb-purple/10 border border-mlbb-purple/30 text-mlbb-lightpurple mb-3">
            Get In Touch
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Need <span className="text-mlbb-purple">Help?</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our customer support team is available 24/7 to assist you with any questions.
          </p>
        </div>
        
        <div className="glass-panel p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
              <p className="text-gray-400 mb-6">
                Feel free to reach out to us anytime. We're here to help you achieve your gaming goals.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-mlbb-purple mr-3 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">Email</p>
                    <p className="text-gray-400 text-sm">support@mlbooster.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MessageSquare className="h-5 w-5 text-mlbb-purple mr-3 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">Live Chat</p>
                    <p className="text-gray-400 text-sm">Available 24/7</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 inline-block">
                <span className="text-xs font-medium text-mlbb-lightpurple bg-mlbb-purple/10 px-3 py-1 rounded-full border border-mlbb-purple/30">
                  Average Response Time: &lt; 5 minutes
                </span>
              </div>
            </div>
            
            {/* Live Chat Button */}
            <div className="flex flex-col justify-center items-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-mlbb-purple to-mlbb-darkpurple flex items-center justify-center mb-4 shadow-lg shadow-mlbb-purple/20 animate-pulse-subtle">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Start Live Chat</h4>
              <p className="text-gray-400 text-sm text-center mb-6">
                Connect instantly with our support team
              </p>
              <button className="bg-mlbb-purple hover:bg-mlbb-darkpurple text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105">
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
