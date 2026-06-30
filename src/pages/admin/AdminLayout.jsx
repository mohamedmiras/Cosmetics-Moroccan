import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, ShoppingBag, Package, LogOut, Menu, X, ClipboardList } from 'lucide-react';

const AdminLayout = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const navItems = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Inventory', path: '/admin/inventory', icon: ClipboardList },
    { name: 'Products', path: '/admin/products', icon: Package },
  ];

  const NavLinks = ({ onClose }) => (
    <>
      <nav className="p-4 md:p-6 space-y-2 flex-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                isActive
                  ? 'bg-[#E8D8C8]/50 text-[#9E3D3D] font-medium'
                  : 'text-[#6B4F4F] hover:bg-[#E8D8C8]/20 hover:text-[#3A2E2A]'
              }`}
            >
              <Icon size={18} />
              <span className="text-sm tracking-wide">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 md:p-6 border-t border-[#E8D8C8]/60">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-[#6B4F4F] hover:text-[#9E3D3D] hover:bg-[#E8D8C8]/20 rounded-2xl transition-all duration-300"
        >
          <LogOut size={18} />
          <span className="text-sm tracking-wide">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#F3ECE4] font-sans flex">

      {/* ── MOBILE OVERLAY ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── SIDEBAR (desktop: always visible | mobile: slide-in drawer) ── */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-40 flex flex-col
          w-64 bg-[#FAF6F2] border-r border-[#E8D8C8]/60
          shadow-[10px_0_30px_rgba(107,79,79,0.04)]
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:z-20
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 md:p-8 border-b border-[#E8D8C8]/60">
          <h2 className="text-lg md:text-xl font-light tracking-[0.2em] uppercase text-[#3A2E2A]">Aura Admin</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-[#6B4F4F] hover:text-[#9E3D3D] p-1"
          >
            <X size={20} />
          </button>
        </div>

        <NavLinks onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-0">
        {/* Mobile Top Bar */}
        <header className="md:hidden sticky top-0 z-20 bg-[#FAF6F2]/90 backdrop-blur-md border-b border-[#E8D8C8]/60 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-[#6B4F4F] hover:text-[#9E3D3D] hover:bg-[#E8D8C8]/30 rounded-xl transition-colors"
          >
            <Menu size={20} />
          </button>
          <h2 className="text-base font-light tracking-[0.2em] uppercase text-[#3A2E2A]">Aura Admin</h2>
        </header>

        <main className="flex-1 relative overflow-y-auto">
          {/* Soft Ambient Background */}
          <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
            <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-[#FAF6F2] rounded-full blur-[120px] opacity-60"></div>
          </div>

          <div className="relative z-10 p-4 md:p-8 lg:p-12">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
