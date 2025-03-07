
import React from "react";
import { Facebook, Instagram, Twitter, Twitch, Mail, MessageSquare } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-white/5 py-10 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="text-2xl font-bold text-white">
              <span className="text-mlbb-purple">ML</span>Booster
            </div>
            <p className="text-gray-400 text-sm">
              Professional Mobile Legends rank boosting service. Fast, secure, and reliable.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-mlbb-purple transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-mlbb-purple transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-mlbb-purple transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-mlbb-purple transition-colors">
                <Twitch className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-mlbb-purple transition-colors text-sm">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-mlbb-purple transition-colors text-sm">
                  Rank Boost
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-mlbb-purple transition-colors text-sm">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-mlbb-purple transition-colors text-sm">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-mlbb-purple transition-colors text-sm">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Our Services</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-mlbb-purple transition-colors text-sm">
                  Rank Boosting
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-mlbb-purple transition-colors text-sm">
                  Duo Boosting
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-mlbb-purple transition-colors text-sm">
                  Placement Matches
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-mlbb-purple transition-colors text-sm">
                  Win Boosting
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-mlbb-purple transition-colors text-sm">
                  Coaching
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-mlbb-purple mr-2 mt-0.5" />
                <span className="text-gray-400 text-sm">support@mlbooster.com</span>
              </li>
              <li className="flex items-start">
                <MessageSquare className="h-5 w-5 text-mlbb-purple mr-2 mt-0.5" />
                <span className="text-gray-400 text-sm">Live chat available 24/7</span>
              </li>
            </ul>
            <div className="mt-4 bg-mlbb-purple/10 rounded-lg p-3 border border-mlbb-purple/20">
              <p className="text-mlbb-lightpurple text-xs">
                Our support team is online and ready to help with any questions!
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/5 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} MLBooster. All rights reserved.
          </div>
          <div className="flex space-x-6">
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
