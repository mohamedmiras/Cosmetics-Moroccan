import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { ArrowLeft, Check, CreditCard, Wallet, Lock, ShieldCheck, ChevronRight } from 'lucide-react';
import { ref, push, runTransaction } from 'firebase/database';
import { db } from '../lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 30, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -30, scale: 0.98, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
};

const CheckoutPage = ({ onBack }) => {
  const { cart, totalItems, totalPrice, catalog } = useCart();
  const cartItems = Object.entries(cart).map(([id, item]) => ({ id, ...item }));
  
  const hasOutOfStockItems = cartItems.some(item => {
    const available = catalog[item.id]?.quantity ?? 0;
    return item.quantity > available;
  });
  
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' or 'card'
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handleNextStep = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(prev => prev + 1);
  };

  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    if (!name || !phone || cartItems.length === 0) return;

    setIsProcessing(true);
    
    // Simulate cinematic processing delay for premium feel
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setOrderSuccess(true);
    setIsProcessing(false);

    try {
      const deductionPromises = cartItems.map((item) => {
        const productRef = ref(db, `products/${item.id}`);
        return runTransaction(productRef, (currentData) => {
          if (currentData && currentData.quantity >= item.quantity) {
            currentData.quantity -= item.quantity;
            return currentData;
          }
          console.warn(`Insufficient stock for ${item.name}`);
          return;
        });
      });
      
      await Promise.all(deductionPromises);

      const finalizedItems = cartItems.map(item => ({
        ...item,
        price: catalog[item.id]?.price ?? item.price
      }));

      const orderData = {
        customerName: name,
        phoneNumber: phone,
        paymentMethod,
        items: finalizedItems,
        totalItems,
        totalAmount: totalPrice,
        status: 'Pending',
        createdAt: new Date().toISOString()
      };
      
      await push(ref(db, 'orders'), orderData);
    } catch (error) {
      console.error('Checkout processing failed:', error);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-[100dvh] bg-[#F3ECE4] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden font-sans">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FAF6F2] rounded-full blur-[100px] opacity-70 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#E8D8C8] rounded-full blur-[80px] opacity-50 pointer-events-none animate-[blob_10s_infinite]"></div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex flex-col items-center max-w-md w-full"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
            className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-8 shadow-[0_20px_40px_rgba(107,79,79,0.08)] border border-[#E8D8C8]"
          >
            <Check className="w-10 h-10 text-[#731625]" />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-light text-[#2d1f1f] tracking-tight mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Order Confirmed
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
            className="text-[#5a443f] text-base md:text-lg font-light mb-10 leading-relaxed"
          >
            Thank you, <span className="font-medium text-[#2d1f1f]">{name}</span>. Your luxury items are being beautifully prepared for you.
          </motion.p>

          <motion.button 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
            onClick={onBack}
            className="px-10 py-4 bg-[#2d1f1f] text-white font-medium tracking-[0.15em] uppercase text-xs hover:bg-[#1a1111] transition-all duration-300 rounded-full shadow-[0_8px_20px_rgba(45,31,31,0.2)] hover:shadow-[0_15px_30px_rgba(45,31,31,0.3)]"
          >
            Return to Boutique
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // --- Step Components ---

  const StepIndicator = () => (
    <div className="flex items-center justify-center w-full mb-12">
      <div className="flex items-center gap-3">
        {[1, 2, 3].map((s) => (
          <React.Fragment key={s}>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border text-[11px] font-medium transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              step >= s ? 'bg-[#731625] border-[#731625] text-white shadow-md scale-110' : 'bg-transparent border-[#E8D8C8] text-[#8c7a6b]'
            }`}>
              {step > s ? <Check size={14} /> : s}
            </div>
            {s !== 3 && (
              <div className="w-12 h-[2px] bg-[#E8D8C8]/60 rounded-full overflow-hidden">
                <div className={`h-full bg-[#731625] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${step > s ? 'w-full' : 'w-0'}`}></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-[100dvh] bg-[#F3ECE4] pt-8 pb-32 px-6 md:px-12 relative overflow-hidden font-sans">
      
      {/* Soft Ambient Lighting Background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-[#FAF6F2] rounded-full blur-[100px] opacity-70"></div>
        <div className="absolute top-1/2 -right-20 w-[300px] h-[300px] bg-[#E8D8C8] rounded-full blur-[100px] opacity-60"></div>
      </div>

      <div className="max-w-xl mx-auto flex flex-col relative z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button 
            type="button"
            onClick={() => step === 1 ? onBack() : setStep(prev => prev - 1)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/50 backdrop-blur-md border border-[#E8D8C8] text-[#5a443f] hover:bg-white transition-all shadow-sm active:scale-95"
          >
            <ArrowLeft size={18} />
          </button>
          
          <h1 className="text-2xl md:text-3xl font-light tracking-wide text-[#2d1f1f]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Secure Checkout
          </h1>
          <div className="w-10"></div> {/* Spacer for center alignment */}
        </div>

        <StepIndicator />

        <div className="relative">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: CART REVIEW */}
            {step === 1 && (
              <motion.div key="step1" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col gap-6">
                <div className="bg-white/80 backdrop-blur-xl border border-[#E8D8C8]/60 p-6 md:p-8 rounded-[2rem] shadow-[0_20px_60px_rgba(45,31,31,0.04)]">
                  <div className="flex justify-between items-end mb-8 border-b border-[#E8D8C8]/50 pb-4">
                    <h2 className="text-[10px] tracking-[0.2em] uppercase text-[#8c7a6b] font-medium">Order Review</h2>
                    <span className="text-xs font-medium text-[#5a443f] bg-[#F3ECE4] px-3 py-1 rounded-full">{totalItems} {totalItems === 1 ? 'Item' : 'Items'}</span>
                  </div>
                  
                  {hasOutOfStockItems && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                      <div className="text-red-500 mt-0.5">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-red-800">Backorder Notice</h4>
                        <p className="text-xs text-red-600 mt-1">Some items in your cart are currently out of stock. You can still place your order, but it may take slightly longer to fulfill and ship those items.</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-6">
                    {cartItems.map((item, idx) => {
                      const currentPrice = catalog[item.id]?.price ?? item.price;
                      return (
                        <div key={idx} className="flex justify-between items-center group">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-[#FAF6F2] rounded-2xl flex items-center justify-center overflow-hidden border border-[#E8D8C8]/50">
                               <span className="text-sm font-medium text-[#8c7a6b]">{item.quantity}x</span>
                            </div>
                            <div>
                              <h3 className="text-[#2d1f1f] font-medium text-base mb-1">{item.name}</h3>
                              <p className="text-[#8c7a6b] text-[10px] uppercase tracking-widest">{currentPrice} MAD</p>
                            </div>
                          </div>
                          <span className="text-lg text-[#2d1f1f] font-light">{currentPrice * item.quantity} MAD</span>
                        </div>
                      );
                    })}
                    
                    {cartItems.length === 0 && (
                      <p className="text-[#8c7a6b] text-center py-8 font-light">Your cart is empty.</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center px-4 mt-2">
                  <span className="text-[#5a443f] font-medium">Subtotal</span>
                  <span className="text-2xl md:text-3xl text-[#2d1f1f] font-light">{totalPrice} MAD</span>
                </div>

                <button 
                  onClick={handleNextStep}
                  disabled={cartItems.length === 0}
                  className="mt-6 w-full py-5 bg-[#731625] text-white font-medium tracking-[0.15em] uppercase text-xs hover:bg-[#5a111d] transition-all duration-300 rounded-full shadow-[0_10px_30px_rgba(115,22,37,0.25)] hover:shadow-[0_15px_40px_rgba(115,22,37,0.35)] disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  Continue to Shipping <ChevronRight size={16} />
                </button>
              </motion.div>
            )}

            {/* STEP 2: CONTACT INFO */}
            {step === 2 && (
              <motion.div key="step2" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col gap-6">
                <div className="bg-white/80 backdrop-blur-xl border border-[#E8D8C8]/60 p-6 md:p-10 rounded-[2rem] shadow-[0_20px_60px_rgba(45,31,31,0.04)]">
                  <h2 className="text-[10px] tracking-[0.2em] uppercase text-[#8c7a6b] font-medium mb-8 border-b border-[#E8D8C8]/50 pb-4">Contact Information</h2>
                  
                  <div className="space-y-8">
                    <div className="relative group">
                      <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full Name" 
                        className="w-full bg-transparent border-b border-[#E8D8C8] pb-4 text-xl text-[#2d1f1f] placeholder:text-[#8c7a6b]/50 focus:outline-none focus:border-[#731625] transition-colors" 
                      />
                    </div>
                    <div className="relative group">
                      <input 
                        type="tel" 
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Phone Number" 
                        className="w-full bg-transparent border-b border-[#E8D8C8] pb-4 text-xl text-[#2d1f1f] placeholder:text-[#8c7a6b]/50 focus:outline-none focus:border-[#731625] transition-colors" 
                      />
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleNextStep}
                  disabled={!name || !phone}
                  className="mt-6 w-full py-5 bg-[#731625] text-white font-medium tracking-[0.15em] uppercase text-xs hover:bg-[#5a111d] transition-all duration-300 rounded-full shadow-[0_10px_30px_rgba(115,22,37,0.25)] hover:shadow-[0_15px_40px_rgba(115,22,37,0.35)] disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  Continue to Payment <ChevronRight size={16} />
                </button>
              </motion.div>
            )}

            {/* STEP 3: PAYMENT METHOD */}
            {step === 3 && (
              <motion.div key="step3" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col gap-6">
                <div className="bg-white/80 backdrop-blur-xl border border-[#E8D8C8]/60 p-6 md:p-10 rounded-[2rem] shadow-[0_20px_60px_rgba(45,31,31,0.04)]">
                  <h2 className="text-[10px] tracking-[0.2em] uppercase text-[#8c7a6b] font-medium mb-8 border-b border-[#E8D8C8]/50 pb-4">Payment Method</h2>
                  
                  <div className="space-y-4">
                    <label className={`flex items-center gap-4 p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${paymentMethod === 'cod' ? 'border-[#731625] bg-[#731625]/5 shadow-sm' : 'border-[#E8D8C8] hover:border-[#8c7a6b]/50 hover:bg-white/50'}`}>
                      <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="hidden" />
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${paymentMethod === 'cod' ? 'border-[#731625]' : 'border-[#8c7a6b]/60'}`}>
                        <motion.div initial={false} animate={{ scale: paymentMethod === 'cod' ? 1 : 0 }} className="w-2.5 h-2.5 bg-[#731625] rounded-full"></motion.div>
                      </div>
                      <Wallet size={20} className={paymentMethod === 'cod' ? 'text-[#731625]' : 'text-[#8c7a6b]'} />
                      <div className="flex flex-col">
                        <span className="text-[#2d1f1f] font-medium">Cash on Delivery</span>
                        <span className="text-[#8c7a6b] text-xs font-light mt-0.5">Pay directly at your doorstep</span>
                      </div>
                    </label>

                    <label className={`flex items-center gap-4 p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${paymentMethod === 'card' ? 'border-[#731625] bg-[#731625]/5 shadow-sm' : 'border-[#E8D8C8] hover:border-[#8c7a6b]/50 hover:bg-white/50'}`}>
                      <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="hidden" />
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${paymentMethod === 'card' ? 'border-[#731625]' : 'border-[#8c7a6b]/60'}`}>
                        <motion.div initial={false} animate={{ scale: paymentMethod === 'card' ? 1 : 0 }} className="w-2.5 h-2.5 bg-[#731625] rounded-full"></motion.div>
                      </div>
                      <CreditCard size={20} className={paymentMethod === 'card' ? 'text-[#731625]' : 'text-[#8c7a6b]'} />
                      <div className="flex flex-col">
                        <span className="text-[#2d1f1f] font-medium">Credit Card</span>
                        <span className="text-[#8c7a6b] text-xs font-light mt-0.5">Secure encrypted transaction</span>
                      </div>
                    </label>
                  </div>
                  
                  <div className="mt-8 flex items-center justify-center gap-2 text-[#8c7a6b]/80">
                    <ShieldCheck size={14} />
                    <span className="text-[10px] uppercase tracking-wider">256-bit Secure Encryption</span>
                  </div>
                </div>

                <div className="flex justify-between items-center px-4 mt-2 mb-2">
                  <span className="text-[#5a443f] font-medium">Total to Pay</span>
                  <span className="text-3xl text-[#2d1f1f] font-light">{totalPrice} MAD</span>
                </div>

                <button 
                  onClick={handleConfirmOrder}
                  disabled={isProcessing}
                  className="w-full py-5 bg-[#2d1f1f] text-white font-medium tracking-[0.15em] uppercase text-xs hover:bg-[#1a1111] transition-all duration-300 rounded-full shadow-[0_10px_30px_rgba(45,31,31,0.25)] hover:shadow-[0_15px_40px_rgba(45,31,31,0.35)] disabled:opacity-70 flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  {isProcessing ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <>
                      <Lock size={16} /> Complete Purchase
                    </>
                  )}
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
