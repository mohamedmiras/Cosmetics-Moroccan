import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Package, Clock, CheckCircle2, Truck } from 'lucide-react';
import { ref, onValue } from 'firebase/database';
import { db } from '../lib/firebase';
import { allProducts } from '../data/products';

const getStatusColor = (status) => {
  switch (status) {
    case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Processing': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
    case 'Delivered': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'Delivered - Payment Pending': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'Pending': return <Clock size={16} />;
    case 'Processing': return <Package size={16} />;
    case 'Completed': return <CheckCircle2 size={16} />;
    case 'Delivered': return <Truck size={16} />;
    case 'Delivered - Payment Pending': return <Truck size={16} />;
    case 'Cancelled': return <X size={16} />;
    default: return <Clock size={16} />;
  }
};

const OrderTrackingModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [myOrders, setMyOrders] = useState(null);

  useEffect(() => {
    let unsubscribe;

    if (isSearching && name && phone) {
      const ordersRef = ref(db, 'orders');
      unsubscribe = onValue(ordersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const matchedOrders = Object.entries(data)
            .map(([id, order]) => ({ id, ...order }))
            .filter(order => {
              const safeDbName = (order.customerName || '').replace(/\s+/g, ' ').trim().toLowerCase();
              const safeInputName = name.replace(/\s+/g, ' ').trim().toLowerCase();
              
              const safeDbPhone = (order.phoneNumber || '').replace(/\D/g, '');
              const safeInputPhone = phone.replace(/\D/g, '');

              return safeDbName === safeInputName && safeDbPhone === safeInputPhone;
            })
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Newest first

          setMyOrders(matchedOrders);
        } else {
          setMyOrders([]);
        }
      }, (error) => {
        console.error("Failed to fetch orders:", error);
        setMyOrders(null); // Reset
        setIsSearching(false); // Stop loading
        alert("Could not connect to the database to find orders. Please check database permissions.");
      });
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isSearching, name, phone]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (name.trim() && phone.trim()) {
      setIsSearching(true);
    }
  };

  const handleLogout = () => {
    setIsSearching(false);
    setMyOrders(null);
    setName('');
    setPhone('');
  };

  // Prevent background scrolling
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setTimeout(() => {
        handleLogout();
      }, 300);
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4 bg-black/40 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-[#FAF6F2] border border-[#E8D8C8] rounded-t-[2rem] sm:rounded-[2rem] w-full max-w-xl max-h-[85vh] sm:max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 md:px-10 md:pt-8 md:pb-6 border-b border-[#E8D8C8]/50 flex justify-between items-center shrink-0">
              <h2 className="text-2xl font-light text-[#3A2E2A]">
                {isSearching ? 'My Orders' : 'Track Order'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-[#6B4F4F] hover:text-[#9E3D3D] bg-[#E8D8C8]/30 hover:bg-[#E8D8C8] rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 md:p-10 overflow-y-auto overscroll-contain flex-1">
              {!isSearching ? (
                <form onSubmit={handleSearch} className="space-y-6">
                  <p className="text-[#6B4F4F] font-light mb-8">
                    Enter the exact Name and Phone Number you used during checkout to view your live order status.
                  </p>
                  
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6B4F4F] font-semibold mb-2">Full Name</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                      placeholder="e.g. Sara Ahmed"
                      className="w-full p-4 rounded-xl border border-[#E8D8C8] bg-white text-[#3A2E2A] placeholder-[#6B4F4F]/40 focus:outline-none focus:border-[#9E3D3D] transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6B4F4F] font-semibold mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      required
                      placeholder="e.g. 0612345678"
                      className="w-full p-4 rounded-xl border border-[#E8D8C8] bg-white text-[#3A2E2A] placeholder-[#6B4F4F]/40 focus:outline-none focus:border-[#9E3D3D] transition-colors"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-4 mt-4 bg-[#731625] text-white rounded-xl font-light tracking-wide hover:bg-[#5a111d] transition-colors flex items-center justify-center gap-2"
                  >
                    <Search size={18} /> Find My Orders
                  </button>
                </form>
              ) : (
                <div className="space-y-6">
                  {!myOrders ? (
                    <div className="text-center py-12 text-[#6B4F4F] animate-pulse">
                      Searching for your orders...
                    </div>
                  ) : myOrders.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-[#3A2E2A] font-medium text-lg mb-2">No orders found</p>
                      <p className="text-[#6B4F4F] font-light mb-6">We couldn't find any orders associated with those details.</p>
                      <button onClick={handleLogout} className="text-[#9E3D3D] font-medium hover:underline text-sm uppercase tracking-wider">
                        Try Again
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center mb-6">
                        <p className="text-sm text-[#6B4F4F]">Found {myOrders.length} order{myOrders.length !== 1 ? 's' : ''}</p>
                        <button onClick={handleLogout} className="text-[#9E3D3D] text-xs font-medium uppercase tracking-wider hover:underline">
                          Sign Out
                        </button>
                      </div>

                      {myOrders.map(order => (
                        <div key={order.id} className={`bg-white rounded-2xl p-6 border ${order.status === 'Cancelled' ? 'border-red-200 opacity-75' : 'border-[#E8D8C8]'} shadow-sm relative overflow-hidden transition-all duration-300`}>
                          <div className="flex justify-between items-start mb-4 border-b border-[#E8D8C8]/50 pb-4">
                            <div>
                              <p className="text-xs text-[#6B4F4F] mb-1">
                                {new Date(order.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                              </p>
                              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)} {order.status || 'Pending'}
                              </div>
                            </div>
                            <div className="text-right flex flex-col items-end gap-2">
                              <div>
                                <span className="text-xl font-light text-[#3A2E2A] leading-none block">{order.totalAmount}</span>
                                <span className="text-[10px] font-semibold text-[#9E3D3D] tracking-widest uppercase">MAD</span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            {(order.items || []).map((item, idx) => {
                              const productMatch = allProducts.find(p => p.id === item.id || p.name === item.name);
                              
                              return (
                                <div key={idx} className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-[#F3ECE4] overflow-hidden shrink-0 flex items-center justify-center">
                                    {productMatch?.image ? (
                                      <img src={productMatch.image} alt={item.name} className="w-full h-full object-cover" />
                                    ) : (
                                      <Package size={16} className="text-[#6B4F4F]" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-[#3A2E2A] truncate">{item.name}</p>
                                    <p className="text-xs text-[#6B4F4F]">Qty: {item.quantity}</p>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <p className="text-sm font-medium text-[#3A2E2A]">{item.price * item.quantity} MAD</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OrderTrackingModal;
