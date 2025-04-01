import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Github, 
  Mail, 
  Phone, 
  MapPin 
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-800 text-white py-12">
      <div className="cafeteria-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Smart Cafeteria</h3>
            <p className="text-gray-300 text-sm">
              An innovative cafeteria management system providing a seamless dining experience
              with inventory tracking, cashless transactions, and smart order management.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-300 hover:text-turmeric-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-turmeric-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-turmeric-400 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-turmeric-400 transition-colors">
                <Github size={20} />
              </a>
            </div>
          </div>
          
          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link to="/" className="hover:text-turmeric-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-turmeric-400 transition-colors">Menu</Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-turmeric-400 transition-colors">My Orders</Link>
              </li>
              <li>
                <Link to="/wallet" className="hover:text-turmeric-400 transition-colors">Wallet</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-turmeric-400 transition-colors">About Us</Link>
              </li>
            </ul>
          </div>
          
          {/* Column 3: Opening Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Opening Hours</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex justify-between">
                <span>Monday - Friday</span>
                <span>8:00 AM - 8:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday</span>
                <span>9:00 AM - 6:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span>10:00 AM - 4:00 PM</span>
              </li>
            </ul>
          </div>
          
          {/* Column 4: Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-2">
                <MapPin size={18} className="mt-0.5 shrink-0" />
                <span>123 College Road, Campus City, India, 123456</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={18} />
                <span>+91 9876543210</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={18} />
                <span>contact@smartcafeteria.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Smart Cafeteria. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
