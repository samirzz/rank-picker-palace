
import React from "react";
import { Facebook, Instagram, Twitter, Twitch, Mail, MessageSquare } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-white/5 py-8 md:py-10 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
          {/* Brand */}
          <div className="space-y-4 text-center sm:text-left">
            <div className="text-xl md:text-2xl font-bold text-white">
              <span className="text-mlbb-purple">ML</span>Booster
            </div>
            <p className="text-gray-400 text-xs md:text-sm">
              Professional Mobile Legends rank boosting service. Fast, secure, and reliable.
            </p>
            <div className="flex space-x-4 justify-center sm:justify-start">
              <a href="#" className="text-gray-400 hover:text-mlbb-purple transition-colors">
                <Facebook className="h-4 w-4 md:h-5 md:w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-mlbb-purple transition-colors">
                <Instagram className="h-4 w-4 md:h-5 md:w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-mlbb-purple transition-colors">
                <Twitter className="h-4 w-4 md:h-5 md:w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-mlbb-purple transition-colors">
                <Twitch className="h-4 w-4 md:h-5 md:w-5" />
              </a>
            </div>
          </div>
          
          {/* Links */}
          <div className="text-center sm:text-left">
            <h4 className="text-white font-semibold mb-4 text-sm md:text-base">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-mlbb-purple transition-colors text-xs md:text-sm">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-mlbb-purple transition-colors text-xs md:text-sm">
                  Rank Boost
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-mlbb-purple transition-colors text-xs md:text-sm">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-mlbb-purple transition-colors text-xs md:text-sm">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-mlbb-purple transition-colors text-xs md:text-sm">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          
          {/* Services */}
          <div className="text-center sm:text-left">
            <h4 className="text-white font-semibold mb-4 text-sm md:text-base">Our Services</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-mlbb-purple transition-colors text-xs md:text-sm">
                  Rank Boosting
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-mlbb-purple transition-colors text-xs md:text-sm">
                  Duo Boosting
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-mlbb-purple transition-colors text-xs md:text-sm">
                  Placement Matches
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-mlbb-purple transition-colors text-xs md:text-sm">
                  Win Boosting
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-mlbb-purple transition-colors text-xs md:text-sm">
                  Coaching
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div className="text-center sm:text-left">
            <h4 className="text-white font-semibold mb-4 text-sm md:text-base">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start justify-center sm:justify-start">
                <Mail className="h-4 w-4 md:h-5 md:w-5 text-mlbb-purple mr-2 mt-0.5" />
                <span className="text-gray-400 text-xs md:text-sm">support@mlbooster.com</span>
              </li>
              <li className="flex items-start justify-center sm:justify-start">
                <MessageSquare className="h-4 w-4 md:h-5 md:w-5 text-mlbb-purple mr-2 mt-0.5" />
                <span className="text-gray-400 text-xs md:text-sm">Live chat available 24/7</span>
              </li>
            </ul>
            <div className="mt-4 bg-mlbb-purple/10 rounded-lg p-3 border border-mlbb-purple/20">
              <p className="text-mlbb-lightpurple text-xs">
                Our support team is online and ready to help with any questions!
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/5 mt-8 md:mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 text-xs md:text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} MLBooster. All rights reserved.
          </div>
          <div className="flex space-x-4 md:space-x-6">
            <a href="#" className="text-gray-500 hover:text-mlbb-purple text-xs">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-mlbb-purple text-xs">
              Terms of Service
            </a>
            <a href="#" className="text-gray-500 hover:text-mlbb-purple text-xs">
              Refund Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
