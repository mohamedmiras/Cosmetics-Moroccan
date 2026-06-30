import React, { useState, useEffect } from 'react';
import { ref, onValue, update, remove, increment as incrementFirebase } from 'firebase/database';
import { db } from '../../lib/firebase';
import { Search, Filter, X, ChevronRight, Copy, Trash2, Package, Save, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { allProducts } from '../../data/products';

const OrderItemRow = ({ orderId, item, idx, handleUpdateOrderItem }) => {
  const [qty, setQty] = useState(item.quantity);
  const isChanged = qty !== item.quantity && qty > 0;

  useEffect(() => {
    setQty(item.quantity);
  }, [item.quantity]);

  return (
    <div className="flex flex-row items-center justify-between p-3 sm:p-4 bg-[#F3ECE4]/50 rounded-2xl border border-[#E8D8C8]/40 gap-2 sm:gap-4">
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-[#E8D8C8]/50 flex-shrink-0 overflow-hidden flex items-center justify-center text-[#9E3D3D]">
          {(() => {
            const match = allProducts.find(p => p.name === item.name || p.id === item.id);
            return match && match.image ? (
              <img src={match.image} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <Package size={14} />
            );
          })()}
        </div>
        <span className="text-[#3A2E2A] font-medium text-xs sm:text-sm truncate" title={item.name}>
          {item.name}
        </span>
      </div>

      <div className="flex items-center justify-end gap-3 sm:gap-4 shrink-0">
        <div className="flex items-center shrink-0 gap-2">
          <input
            type="number"
            min="1"
            value={qty}
            onChange={(e) => setQty(parseInt(e.target.value) || '')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && isChanged) {
                handleUpdateOrderItem(orderId, idx, qty);
              }
            }}
            title="Edit quantity"
            className="w-12 h-8 bg-white border border-[#E8D8C8] hover:border-[#9E3D3D]/50 rounded-lg text-center text-sm text-[#3A2E2A] font-medium focus:outline-none focus:border-[#9E3D3D] transition-colors"
          />
          {isChanged && (
            <button
              onClick={() => handleUpdateOrderItem(orderId, idx, qty)}
              className="h-8 px-3 bg-[#731625] text-white rounded-lg text-xs font-medium hover:bg-[#5a111d] transition-colors shadow-sm flex items-center gap-1"
            >
              <Save size={12} /> Update
            </button>
          )}
        </div>
        <span className="text-[#3A2E2A] font-medium text-xs sm:text-sm whitespace-nowrap min-w-[60px] text-right">
          {item.price * item.quantity} MAD
        </span>
        <button 
          onClick={() => handleUpdateOrderItem(orderId, idx, 0)}
          className="p-1.5 text-[#6B4F4F]/60 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors shrink-0"
          title="Remove item"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const ordersRef = ref(db, 'orders');
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setOrders([]);
        setLoading(false);
        return;
      }
      // Convert object to array, preserving the key as `id`
      const ordersArray = Object.entries(data)
        .map(([id, val]) => ({ id, ...val }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setOrders(ordersArray);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedOrder) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedOrder]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    setIsUpdating(true);
    try {
      await update(ref(db, `orders/${orderId}`), { status: newStatus });
      setSelectedOrder(prev => ({ ...prev, status: newStatus }));
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to permanently delete this order? This action cannot be undone and it will be removed from the customer tracking portal as well.")) return;
    try {
      const orderToDelete = orders.find(o => o.id === orderId);
      if (orderToDelete && orderToDelete.items) {
        // Return stock back to inventory
        const stockPromises = orderToDelete.items.map(item => {
          return update(ref(db), {
            [`products/${item.id}/quantity`]: incrementFirebase(item.quantity)
          }).catch(err => console.warn("Failed to restore stock for", item.id, err));
        });
        await Promise.all(stockPromises);
      }

      await remove(ref(db, `orders/${orderId}`));
      setSelectedOrder(null);
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Failed to delete order");
    }
  };

  const handleUpdateOrderItem = async (orderId, itemIndex, newQuantity) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    let newItems = [...(order.items || [])];
    
    if (newQuantity <= 0) {
      if (!window.confirm("Are you sure you want to remove this item from the order?")) return;
      newItems.splice(itemIndex, 1);
    } else {
      newItems[itemIndex] = { ...newItems[itemIndex], quantity: newQuantity };
    }
    
    const newTotalItems = newItems.reduce((acc, item) => acc + item.quantity, 0);
    const newTotalAmount = newItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    
    try {
      // Adjust stock inventory based on the difference
      const oldItem = order.items[itemIndex];
      const quantityDiff = oldItem.quantity - newQuantity; // Positive if returning stock, negative if taking more
      
      if (quantityDiff !== 0) {
        await update(ref(db), {
          [`products/${oldItem.id}/quantity`]: incrementFirebase(quantityDiff)
        });
      }

      await update(ref(db, `orders/${orderId}`), {
        items: newItems,
        totalItems: newTotalItems,
        totalAmount: newTotalAmount
      });
      setSelectedOrder(prev => ({
        ...prev,
        items: newItems,
        totalItems: newTotalItems,
        totalAmount: newTotalAmount
      }));
    } catch (error) {
      console.error("Error updating order items:", error);
      alert("Failed to update order items");
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      (order.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.phoneNumber || '').includes(searchTerm);
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const exportToCSV = () => {
    // Determine headers
    const productNames = allProducts.map(p => p.name);
    const headers = ["Name", "Phone Number", "Status", "Order Date", ...productNames];

    // Generate rows
    const csvRows = filteredOrders.map(order => {
      // Map items to an easily searchable object by name
      const itemQtyMap = {};
      (order.items || []).forEach(item => {
        itemQtyMap[item.name] = (itemQtyMap[item.name] || 0) + item.quantity;
      });

      // Build the row array
      const row = [
        `"${(order.customerName || '').replace(/"/g, '""')}"`,
        `"${order.phoneNumber || ''}"`,
        `"${order.status || 'Pending'}"`,
        `"${order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}"`
      ];

      // Add product quantities
      productNames.forEach(prodName => {
        row.push(itemQtyMap[prodName] || 0);
      });

      return row.join(",");
    });

    // Combine headers and rows
    const csvContent = [headers.join(","), ...csvRows].join("\n");

    // Trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'Delivered': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Delivered - Payment Pending': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-light tracking-wide text-[#3A2E2A] mb-1">Orders</h1>
          <p className="text-[#6B4F4F]/70 text-sm tracking-wide">Manage customer orders and status</p>
        </div>
      </div>

      {/* Search + Filter — stack on mobile, row on desktop */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B4F4F]/40" size={16} />
            <input
              type="text"
              placeholder="Search name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#FAF6F2] border border-[#E8D8C8] rounded-xl text-sm focus:outline-none focus:border-[#9E3D3D] transition-colors"
            />
          </div>

          <div className="relative flex items-center bg-[#FAF6F2] border border-[#E8D8C8] rounded-xl px-3 py-2.5">
            <Filter className="text-[#6B4F4F]/40 mr-2 flex-shrink-0" size={16} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-sm text-[#3A2E2A] focus:outline-none cursor-pointer appearance-none w-full"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Completed">Completed</option>
              <option value="Delivered">Delivered</option>
              <option value="Delivered - Payment Pending">Delivered - Payment Pending</option>
            </select>
          </div>

          <button
            onClick={exportToCSV}
            className="flex items-center justify-center gap-2 bg-[#FAF6F2] text-[#3A2E2A] px-4 py-2.5 rounded-xl border border-[#E8D8C8] hover:bg-[#E8D8C8]/60 transition-colors shadow-sm font-medium text-sm flex-shrink-0"
            title="Export to CSV"
          >
            <Download size={16} className="text-[#9E3D3D]" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      {/* ── MOBILE: Card List ── */}
      <div className="md:hidden space-y-3">
        {loading ? (
          [1,2,3].map(i => <div key={i} className="bg-[#FAF6F2] border border-[#E8D8C8]/60 rounded-2xl h-24 animate-pulse" />)
        ) : filteredOrders.length === 0 ? (
          <div className="bg-[#FAF6F2] border border-[#E8D8C8]/60 rounded-2xl py-12 text-center text-[#6B4F4F]/60 text-sm">
            No orders found.
          </div>
        ) : (
          filteredOrders.map(order => (
            <button
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className="w-full text-left bg-[#FAF6F2] border border-[#E8D8C8]/60 rounded-2xl p-4 shadow-[0_4px_16px_rgba(107,79,79,0.03)] hover:shadow-[0_6px_20px_rgba(107,79,79,0.07)] transition-shadow active:scale-[0.99]"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-medium text-[#3A2E2A] text-sm">{order.customerName}</p>
                  <p className="text-xs text-[#6B4F4F] mt-0.5">{order.phoneNumber}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                  {order.status || 'Pending'}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-[#E8D8C8]/40">
                <span className="text-xs text-[#6B4F4F]">{order.totalItems} items · {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}</span>
                <span className="text-sm font-medium text-[#3A2E2A]">{order.totalAmount} MAD</span>
              </div>
            </button>
          ))
        )}
      </div>

      {/* ── DESKTOP: Table ── */}
      <div className="hidden md:block bg-[#FAF6F2] border border-[#E8D8C8]/60 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(107,79,79,0.03)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E8D8C8]/60 bg-[#F3ECE4]/50">
                <th className="py-4 px-6 text-[10px] tracking-[0.2em] uppercase text-[#6B4F4F] font-semibold">Customer</th>
                <th className="py-4 px-6 text-[10px] tracking-[0.2em] uppercase text-[#6B4F4F] font-semibold">Contact</th>
                <th className="py-4 px-6 text-[10px] tracking-[0.2em] uppercase text-[#6B4F4F] font-semibold">Items</th>
                <th className="py-4 px-6 text-[10px] tracking-[0.2em] uppercase text-[#6B4F4F] font-semibold">Total</th>
                <th className="py-4 px-6 text-[10px] tracking-[0.2em] uppercase text-[#6B4F4F] font-semibold">Date</th>
                <th className="py-4 px-6 text-[10px] tracking-[0.2em] uppercase text-[#6B4F4F] font-semibold">Status</th>
                <th className="py-4 px-6 text-[10px] tracking-[0.2em] uppercase text-[#6B4F4F] font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8D8C8]/40">
              {loading ? (
                <tr><td colSpan="7" className="py-12 text-center text-[#6B4F4F]/60">Loading orders...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan="7" className="py-12 text-center text-[#6B4F4F]/60">No orders found.</td></tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-[#F3ECE4]/30 transition-colors group">
                    <td className="py-4 px-6 text-sm font-medium text-[#3A2E2A]">{order.customerName}</td>
                    <td className="py-4 px-6 text-sm text-[#6B4F4F]">{order.phoneNumber}</td>
                    <td className="py-4 px-6 text-sm text-[#6B4F4F]">{order.totalItems} items</td>
                    <td className="py-4 px-6 text-sm font-medium text-[#3A2E2A]">{order.totalAmount} MAD</td>
                    <td className="py-4 px-6 text-sm text-[#6B4F4F]">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {order.status || 'Pending'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-[#6B4F4F] hover:text-[#9E3D3D] hover:bg-[#E8D8C8]/30 rounded-lg transition-colors inline-flex items-center justify-center"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/20 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-[#FAF6F2] border border-[#E8D8C8] rounded-t-[2rem] sm:rounded-[2rem] w-full max-w-2xl max-h-[85vh] sm:max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden"
            >

              {/* Sticky Header */}
              <div className="p-6 md:px-10 md:pt-8 md:pb-6 border-b border-[#E8D8C8]/50 flex justify-between items-center shrink-0">
                <h2 className="text-2xl font-light text-[#3A2E2A]">Order Details</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 text-[#6B4F4F] hover:text-[#9E3D3D] bg-[#E8D8C8]/30 hover:bg-[#E8D8C8] rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="p-6 md:p-10 overflow-y-auto overscroll-contain flex-1">


              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[10px] tracking-[0.2em] uppercase text-[#6B4F4F] font-semibold">Customer Info</h3>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(`Name: ${selectedOrder.customerName}\nPhone: ${selectedOrder.phoneNumber}`);
                        alert("Customer details copied to clipboard!");
                      }}
                      className="text-[#6B4F4F] hover:text-[#9E3D3D] transition-colors flex items-center gap-1.5 text-xs font-medium bg-[#E8D8C8]/30 px-2 py-1 rounded-md"
                      title="Copy Details"
                    >
                      <Copy size={12} /> Copy
                    </button>
                  </div>
                  <p className="text-[#3A2E2A] font-medium text-lg">{selectedOrder.customerName}</p>
                  <p className="text-[#6B4F4F]">{selectedOrder.phoneNumber}</p>
                  <p className="text-[#6B4F4F] text-sm mt-2">
                    Ordered on: {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : 'N/A'}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E8D8C8]/40 border border-[#E8D8C8] rounded-md">
                    <span className="text-[10px] tracking-[0.1em] uppercase text-[#6B4F4F] font-semibold">Payment:</span>
                    <span className="text-xs font-semibold text-[#731625]">
                      {selectedOrder.paymentMethod === 'card' ? 'Credit Card' : 'Cash on Delivery'}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] tracking-[0.2em] uppercase text-[#6B4F4F] font-semibold mb-3">Order Status</h3>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                    disabled={isUpdating}
                    className={`w-full p-3 rounded-xl border appearance-none font-medium text-sm focus:outline-none transition-colors ${getStatusColor(selectedOrder.status)}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Completed">Completed</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Delivered - Payment Pending">Delivered - Payment Pending</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-[#E8D8C8] pt-8">
                <h3 className="text-[10px] tracking-[0.2em] uppercase text-[#6B4F4F] font-semibold mb-4">Products</h3>
                <div className="space-y-4">
                  {(selectedOrder.items || []).map((item, idx) => (
                    <OrderItemRow 
                      key={idx} 
                      orderId={selectedOrder.id} 
                      item={item} 
                      idx={idx} 
                      handleUpdateOrderItem={handleUpdateOrderItem} 
                    />
                  ))}
                  {(selectedOrder.items || []).length === 0 && (
                    <div className="text-center py-6 text-[#6B4F4F]/60 text-sm">
                      No items in this order.
                    </div>
                  )}
                </div>
              </div>

              </div>

              {/* Sticky Footer */}
              <div className="p-6 md:px-10 md:py-6 border-t border-[#E8D8C8]/50 bg-[#FAF6F2] shrink-0 flex justify-between items-end">
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[#6B4F4F] font-semibold mb-1">Total Amount</p>
                    <p className="text-[#6B4F4F] text-sm">{selectedOrder.totalItems} items</p>
                  </div>
                  <button 
                    onClick={() => handleDeleteOrder(selectedOrder.id)}
                    className="text-red-600 hover:text-red-800 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                  >
                    <Trash2 size={14} /> Delete Order
                  </button>
                </div>
                <div className="text-right flex items-end gap-1.5">
                  <span className="text-3xl font-light text-[#3A2E2A] leading-none">{selectedOrder.totalAmount}</span>
                  <span className="text-sm font-semibold text-[#9E3D3D] tracking-widest uppercase mb-0.5">MAD</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrdersTable;
