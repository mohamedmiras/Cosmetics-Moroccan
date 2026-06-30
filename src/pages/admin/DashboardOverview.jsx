import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../../lib/firebase';
import { Package, DollarSign, Users, ShoppingBag, Clock, CheckCircle } from 'lucide-react';

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    totalProductsSold: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ordersRef = ref(db, 'orders');
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setLoading(false);
        return;
      }

      const orders = Object.values(data);
      let revenue = 0;
      let productsSold = 0;
      let pending = 0;
      let completed = 0;
      const customers = new Set();

      orders.forEach(order => {
        revenue += order.totalAmount || 0;
        productsSold += order.totalItems || 0;
        if (order.customerName) customers.add(order.customerName + order.phoneNumber);
        if (order.status === 'Pending') pending++;
        if (order.status === 'Completed' || order.status === 'Delivered') completed++;
      });

      setStats({
        totalOrders: orders.length,
        totalRevenue: revenue,
        totalCustomers: customers.size,
        totalProductsSold: productsSold,
        pendingOrders: pending,
        completedOrders: completed
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const statCards = [
    { title: 'Total Revenue', value: `${stats.totalRevenue} MAD`, icon: DollarSign },
    { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag },
    { title: 'Customers', value: stats.totalCustomers, icon: Users },
    { title: 'Products Sold', value: stats.totalProductsSold, icon: Package },
    { title: 'Pending Orders', value: stats.pendingOrders, icon: Clock },
    { title: 'Completed', value: stats.completedOrders, icon: CheckCircle },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-light tracking-wide text-[#3A2E2A] mb-2">Overview</h1>
          <p className="text-[#6B4F4F]/70 text-sm tracking-wide">Monitor your store's performance</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-[#FAF6F2] border border-[#E8D8C8]/60 rounded-3xl p-6 h-32 animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-[#FAF6F2] border border-[#E8D8C8]/60 rounded-3xl p-6 shadow-[0_8px_30px_rgba(107,79,79,0.03)] hover:shadow-[0_12px_40px_rgba(107,79,79,0.06)] transition-shadow duration-300 group"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-[11px] tracking-[0.2em] uppercase text-[#6B4F4F] font-semibold">{stat.title}</h3>
                  <div className="p-2 bg-[#E8D8C8]/30 rounded-xl text-[#9E3D3D] group-hover:bg-[#9E3D3D] group-hover:text-white transition-colors duration-300">
                    <Icon size={18} />
                  </div>
                </div>
                <p className="text-3xl font-light text-[#3A2E2A] tracking-tight">{stat.value}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DashboardOverview;
