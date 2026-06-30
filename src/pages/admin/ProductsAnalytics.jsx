import React, { useState, useEffect } from 'react';
import { ref, onValue, remove } from 'firebase/database';
import { db } from '../../lib/firebase';
import { ChevronDown, ChevronUp, Users, Package } from 'lucide-react';
import { allProducts } from '../../data/products';

const ProductsAnalytics = () => {
  const [productMap, setProductMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const ordersRef = ref(db, 'orders');
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setLoading(false);
        return;
      }

      // AUTO-CLEANUP: Remove old items as requested by user
      const itemsToRemove = ["Savon Noir À Nila", "Crimson Rose Cream", "Savon Noir Beldi"];
      Object.entries(data).forEach(([orderId, order]) => {
        const hasOldItems = (order.items || []).some(item => itemsToRemove.includes(item.name));
        if (hasOldItems) {
          remove(ref(db, `orders/${orderId}`));
        }
      });

      // Build a map: productName -> { totalQty, totalRevenue, customers: [], image }
      const map = {};
      
      // Initialize with all existing products so they always show up
      allProducts.forEach(product => {
        map[product.name] = { totalQty: 0, totalRevenue: 0, customers: [], image: product.image };
      });

      Object.values(data).forEach(order => {
        (order.items || []).forEach(item => {
          if (!map[item.name]) {
            map[item.name] = { totalQty: 0, totalRevenue: 0, customers: [], image: null };
          }
          map[item.name].totalQty += item.quantity;
          map[item.name].totalRevenue += item.price * item.quantity;
          map[item.name].customers.push({
            name: order.customerName,
            phone: order.phoneNumber,
            quantity: item.quantity,
            paid: item.price * item.quantity,
            date: order.createdAt
          });
        });
      });

      setProductMap(map);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const products = Object.entries(productMap).sort((a, b) => b[1].totalQty - a[1].totalQty);
  const toggle = (name) => setExpanded(prev => prev === name ? null : name);

  const totalRevenue = products.reduce((sum, [, d]) => sum + d.totalRevenue, 0);
  const totalQty = products.reduce((sum, [, d]) => sum + d.totalQty, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-light tracking-wide text-[#3A2E2A] mb-2">Products</h1>
        <p className="text-[#6B4F4F]/70 text-sm tracking-wide">See which customers ordered each product</p>
      </div>

      {/* Summary Stats */}
      {!loading && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#FAF6F2] border border-[#E8D8C8]/60 rounded-3xl p-6 shadow-[0_8px_30px_rgba(107,79,79,0.03)] flex flex-col gap-2">
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#6B4F4F] font-semibold">Total Revenue</p>
            <p className="text-3xl font-light text-[#3A2E2A] tracking-tight">{totalRevenue} <span className="text-base font-medium text-[#9E3D3D]">MAD</span></p>
          </div>
          <div className="bg-[#FAF6F2] border border-[#E8D8C8]/60 rounded-3xl p-6 shadow-[0_8px_30px_rgba(107,79,79,0.03)] flex flex-col gap-2">
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#6B4F4F] font-semibold">Total Qty Sold</p>
            <p className="text-3xl font-light text-[#3A2E2A] tracking-tight">{totalQty} <span className="text-base font-medium text-[#9E3D3D]">Units</span></p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-[#FAF6F2] border border-[#E8D8C8]/60 rounded-3xl p-6 h-20 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-[#FAF6F2] border border-[#E8D8C8]/60 rounded-3xl p-12 text-center text-[#6B4F4F]/60">
          No orders yet. Place a test order from the storefront!
        </div>
      ) : (
        <div className="space-y-4">
          {products.map(([productName, data]) => (
            <div
              key={productName}
              className="bg-[#FAF6F2] border border-[#E8D8C8]/60 rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(107,79,79,0.03)] transition-all duration-300"
            >
              {/* Product Header Row — clickable to expand */}
              <button
                onClick={() => toggle(productName)}
                className="w-full flex items-center justify-between p-5 md:p-6 text-left hover:bg-[#F3ECE4]/40 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-[#E8D8C8]/50 flex items-center justify-center flex-shrink-0 text-[#9E3D3D] overflow-hidden">
                    {data.image ? (
                      <img src={data.image} alt={productName} className="w-full h-full object-cover" />
                    ) : (
                      <Package size={18} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm md:text-base md:text-[1.05rem] text-[#3A2E2A] truncate" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, letterSpacing: "0.3px" }}>{productName}</h3>
                    <p className="text-xs text-[#6B4F4F]/70 mt-0.5">
                      {data.customers.length} order{data.customers.length !== 1 ? 's' : ''} · {data.totalQty} units sold
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 md:gap-8 flex-shrink-0 ml-4">
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-widest text-[#6B4F4F]/60 mb-0.5">Revenue</p>
                    <p className="text-sm font-light text-[#3A2E2A]">{data.totalRevenue} MAD</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-widest text-[#6B4F4F]/60 mb-0.5">Qty Sold</p>
                    <p className="text-sm font-light text-[#3A2E2A]">{data.totalQty} <span className="text-xs text-[#6B4F4F]/60">units</span></p>
                  </div>
                  <div className="flex items-center gap-1 text-[#6B4F4F]/60">
                    <Users size={14} />
                    <span className="text-xs font-medium">{data.customers.length}</span>
                  </div>
                  <div className="text-[#9E3D3D]">
                    {expanded === productName ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>
              </button>

              {/* Expandable Customer List */}
              {expanded === productName && (
                <div className="border-t border-[#E8D8C8]/60 px-5 md:px-6 pb-5 md:pb-6 pt-4">
                  {/* Mobile revenue row */}
                  <div className="sm:hidden flex justify-between mb-4 px-1 text-sm text-[#6B4F4F]">
                    <span>Total Revenue</span>
                    <span className="font-medium text-[#3A2E2A]">{data.totalRevenue} MAD</span>
                  </div>

                  {/* Table header */}
                  <div className="hidden md:grid grid-cols-4 gap-4 pb-3 mb-2 border-b border-[#E8D8C8]/40">
                    <span className="text-[10px] tracking-[0.15em] uppercase text-[#6B4F4F]/60 font-semibold">Customer</span>
                    <span className="text-[10px] tracking-[0.15em] uppercase text-[#6B4F4F]/60 font-semibold">Phone</span>
                    <span className="text-[10px] tracking-[0.15em] uppercase text-[#6B4F4F]/60 font-semibold">Qty</span>
                    <span className="text-[10px] tracking-[0.15em] uppercase text-[#6B4F4F]/60 font-semibold text-right">Paid</span>
                  </div>

                  <div className="space-y-3">
                    {data.customers.map((customer, idx) => (
                      <div key={idx} className="bg-[#F3ECE4]/50 rounded-2xl p-4 border border-[#E8D8C8]/30">
                        {/* Mobile layout */}
                        <div className="md:hidden space-y-1">
                          <div className="flex justify-between">
                            <span className="font-medium text-[#3A2E2A] text-sm">{customer.name}</span>
                            <span className="text-[#9E3D3D] font-medium text-sm">{customer.paid} MAD</span>
                          </div>
                          <div className="flex justify-between text-xs text-[#6B4F4F]">
                            <span>{customer.phone}</span>
                            <span>{customer.quantity} unit{customer.quantity !== 1 ? 's' : ''}</span>
                          </div>
                        </div>
                        {/* Desktop layout */}
                        <div className="hidden md:grid grid-cols-4 gap-4 items-center">
                          <span className="font-medium text-[#3A2E2A] text-sm">{customer.name}</span>
                          <span className="text-[#6B4F4F] text-sm">{customer.phone}</span>
                          <span className="text-[#6B4F4F] text-sm">{customer.quantity}×</span>
                          <span className="text-[#3A2E2A] font-medium text-sm text-right">{customer.paid} MAD</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


export default ProductsAnalytics;
