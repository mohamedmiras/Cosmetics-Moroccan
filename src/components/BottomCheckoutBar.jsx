import React from 'react';
import { useCart } from '../context/CartContext';

const BottomCheckoutBar = ({ onCheckout }) => {
  const { totalItems, totalPrice } = useCart();

  // If no items in cart, don't show the bar
  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-[90] p-4 md:p-6 pb-6 md:pb-8 transform-gpu transition-all duration-500 animate-[fade-in_0.5s_ease-out]">
      <div className="max-w-4xl mx-auto flex items-center justify-between bg-white/70 dark:bg-black/60 backdrop-blur-xl border border-[#3a2522]/10 dark:border-white/10 p-4 md:p-6 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
        
        <div className="flex flex-col">
          <span className="text-[#5a443f] dark:text-white/60 font-light text-xs md:text-sm uppercase tracking-[0.2em]">
            {totalItems} {totalItems === 1 ? 'Product' : 'Products'}
          </span>
          <div className="flex items-end gap-2">
            <span className="text-2xl md:text-4xl font-light text-[#3a2522] dark:text-white tracking-wide">
              {totalPrice}
            </span>
            <span className="text-sm font-mono text-[#8b3131] dark:text-red-500 mb-1 tracking-widest uppercase">
              MAD
            </span>
          </div>
        </div>

        <button 
          onClick={onCheckout}
          className="px-8 md:px-12 py-3 md:py-4 bg-[#8b3131] text-white dark:bg-white dark:text-black font-medium tracking-widest uppercase text-xs hover:bg-[#6c2424] dark:hover:bg-red-600 dark:hover:text-white transition-all duration-500 rounded-full shadow-[0_10px_20px_rgba(139,49,49,0.2)] hover:shadow-[0_15px_30px_rgba(139,49,49,0.3)] dark:shadow-[0_0_20px_rgba(255,255,255,0.1)] dark:hover:shadow-[0_0_40px_rgba(220,38,38,0.4)] text-center whitespace-nowrap"
        >
          Checkout
        </button>

      </div>
    </div>
  );
};

export default BottomCheckoutBar;
