import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="pt-24 pb-12 px-6 md:px-12 border-t border-[#E8D8C8] relative overflow-hidden bg-[#FAF6F2]">
      {/* Background Soft Element */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-white blur-[150px] rounded-t-full pointer-events-none" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">
          
          {/* Brand & Newsletter */}
          <div className="lg:col-span-2">
            <h3 className="text-3xl font-normal tracking-widest text-[#2d1f1f] uppercase mb-6" style={{ fontFamily: 'Playfair Display' }}>Tessara</h3>
            <p className="text-[#5a443f] font-light max-w-md mb-8 leading-relaxed">
              Elevate your daily ritual. Discover our curated collection of premium authentic Moroccan skincare.
            </p>
            
            <div className="space-y-4 max-w-sm">
              <h4 className="text-xs font-semibold tracking-widest uppercase text-[#2d1f1f]">Join the Inner Circle</h4>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full bg-white border border-[#E8D8C8] rounded-full py-3 px-6 text-[#2d1f1f] placeholder:text-[#8c7a6b] focus:outline-none focus:border-[#731625] transition-colors"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#731625] text-white p-2 rounded-full hover:bg-[#5a111d] transition-colors">
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-[#2d1f1f] mb-6">Shop</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-[#5a443f] font-light hover:text-[#731625] transition-colors">All Products</a></li>
              <li><a href="#" className="text-[#5a443f] font-light hover:text-[#731625] transition-colors">Skincare</a></li>
              <li><a href="#" className="text-[#5a443f] font-light hover:text-[#731625] transition-colors">Gifts</a></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-[#2d1f1f] mb-6">Support</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-[#5a443f] font-light hover:text-[#731625] transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-[#5a443f] font-light hover:text-[#731625] transition-colors">FAQs</a></li>
              <li><a href="#" className="text-[#5a443f] font-light hover:text-[#731625] transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="text-[#5a443f] font-light hover:text-[#731625] transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-[#E8D8C8]">
          <p className="text-[#8c7a6b] text-[10px] uppercase tracking-wider mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Tessara Cosmetics. All rights reserved.
          </p>
          <div className="flex space-x-6 text-[10px] uppercase tracking-wider font-semibold text-[#8c7a6b]">
            <Link to="/admin" className="hover:text-[#731625] transition-colors">Admin Portal</Link>
            <span className="text-[#E8D8C8]">|</span>
            <a href="#" className="hover:text-[#2d1f1f] transition-colors">IG</a>
            <a href="#" className="hover:text-[#2d1f1f] transition-colors">TW</a>
            <a href="#" className="hover:text-[#2d1f1f] transition-colors">FB</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
