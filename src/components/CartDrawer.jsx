import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';

const CartDrawer = ({ isOpen, setIsOpen }) => {
  // Mock cart items
  const cartItems = [
    {
      id: 1,
      name: "Velvet Rose Radiance Cream",
      price: 185.00,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=200"
    },
    {
      id: 2,
      name: "Lumière Liquid Gold Serum",
      price: 210.00,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&q=80&w=200"
    }
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-[#f4efe8] dark:bg-[#0a0a0a] border-l border-[#3a2522]/10 dark:border-white/10 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-6 border-b border-[#3a2522]/10 dark:border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-bold uppercase tracking-widest flex items-center space-x-3 text-foreground">
                <ShoppingBag className="text-primary" />
                <span>Your Cart ({cartItems.length})</span>
              </h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-[#3a2522]/10 dark:hover:bg-white/10 rounded-full transition-colors text-foreground/60 hover:text-foreground"
              >
                <X size={24} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-foreground/50 space-y-4">
                  <ShoppingBag size={48} className="opacity-20" />
                  <p className="tracking-widest uppercase">Your cart is empty</p>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="mt-4 border border-[#3a2522]/20 dark:border-white/20 px-6 py-2 rounded-full uppercase tracking-widest text-xs font-semibold hover:bg-[#3a2522]/10 dark:hover:bg-white/10 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex space-x-4 bg-white/50 border border-[#3a2522]/5 dark:border-transparent dark:glass-card p-4 rounded-xl relative group shadow-sm dark:shadow-none">
                    <button className="absolute -top-2 -right-2 bg-red-500/10 dark:bg-red-500/20 text-red-500 dark:text-red-400 hover:bg-red-500 hover:text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <X size={14} />
                    </button>
                    
                    <div className="w-20 h-24 bg-[#e8dfd5] dark:bg-black/40 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-medium text-sm text-foreground/90 leading-tight mb-1">{item.name}</h3>
                        <p className="text-primary font-semibold text-sm">${item.price.toFixed(2)}</p>
                      </div>
                      
                      <div className="flex items-center space-x-3 bg-white dark:bg-black/50 w-max rounded-lg px-2 py-1 mt-2 border border-[#3a2522]/10 dark:border-white/5 shadow-sm dark:shadow-none">
                        <button className="p-1 hover:text-primary transition-colors text-foreground/50"><Minus size={14} /></button>
                        <span className="text-sm font-medium w-4 text-center text-foreground">{item.quantity}</span>
                        <button className="p-1 hover:text-primary transition-colors text-foreground/50"><Plus size={14} /></button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-[#3a2522]/10 dark:border-white/10 bg-[#dfd6c8] dark:bg-[#050505]">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-foreground/60 tracking-wider uppercase text-sm">Subtotal</span>
                  <span className="text-2xl font-bold text-foreground">${subtotal.toFixed(2)}</span>
                </div>
                <p className="text-foreground/50 dark:text-foreground/40 text-xs mb-6 text-center">Shipping and taxes calculated at checkout.</p>
                <button className="w-full py-4 bg-primary hover:bg-primary/90 text-white transition-colors rounded uppercase tracking-widest text-sm font-bold shadow-[0_10px_20px_rgba(139,49,49,0.2)] dark:shadow-[0_0_20px_rgba(155,28,49,0.3)]">
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
