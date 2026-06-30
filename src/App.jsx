import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import StorefrontApp from './StorefrontApp';
import AdminLayout from './pages/admin/AdminLayout';
import DashboardOverview from './pages/admin/DashboardOverview';
import OrdersTable from './pages/admin/OrdersTable';
import InventoryManagement from './pages/admin/InventoryManagement';
import ProductsAnalytics from './pages/admin/ProductsAnalytics';
import Login from './pages/admin/Login';
import ProtectedRoute from './components/admin/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Customer Storefront */}
          <Route path="/*" element={<StorefrontApp />} />
          
          {/* Secure Admin Auth */}
          <Route path="/admin/login" element={<Login />} />
          
          {/* Secure Admin Dashboard */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<DashboardOverview />} />
            <Route path="orders" element={<OrdersTable />} />
            <Route path="inventory" element={<InventoryManagement />} />
            <Route path="products" element={<ProductsAnalytics />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
