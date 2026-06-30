import React, { useState, useEffect } from 'react';
import { ref, onValue, update, set } from 'firebase/database';
import { db } from '../../lib/firebase';
import { Package, RefreshCw, Save } from 'lucide-react';

import { allProducts } from '../../data/products';

// Auto-generate initial catalog from the master list
const INITIAL_CATALOG = {};
allProducts.forEach(p => {
  INITIAL_CATALOG[p.id] = { name: p.name, price: p.price, quantity: 50, maxQuantity: 50 };
});

const InventoryManagement = () => {
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Local state to hold unsaved edits
  const [edits, setEdits] = useState({});

  const [error, setError] = useState(null);

  useEffect(() => {
    const productsRef = ref(db, 'products');
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setProducts(data);
        setLoading(false);
      } else {
        // Auto-initialize if empty
        set(ref(db, 'products'), INITIAL_CATALOG)
          .then(() => {
            console.log('Database initialized with default products.');
          })
          .catch((err) => {
            console.error('Failed to auto-initialize database:', err);
            setError(err.message);
            setLoading(false);
          });
      }
    }, (err) => {
      console.error("Database listener failed:", err);
      setError(err.message);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleEdit = (key, field, value) => {
    setEdits(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: Number(value)
      }
    }));
  };

  const handleSave = async (key) => {
    if (!edits[key]) return;
    setSaving(true);
    try {
      const updates = {};
      
      // If admin updates quantity, we automatically sync maxQuantity so the progress bar looks correct
      if (edits[key].quantity !== undefined) {
        updates[`products/${key}/quantity`] = edits[key].quantity;
        updates[`products/${key}/maxQuantity`] = edits[key].quantity; // Reset the full bar capacity
      }
      if (edits[key].price !== undefined) {
        updates[`products/${key}/price`] = edits[key].price;
      }
      
      await update(ref(db), updates);
      
      // Clear edits for this item
      setEdits(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const productEntries = Object.entries(products);

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-light tracking-wide text-[#3A2E2A] mb-2">Inventory Management</h1>
          <p className="text-[#6B4F4F]/80 font-light">Monitor live stock levels and adjust pricing instantly.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={async () => {
              if(window.confirm("This will add any missing products from the default catalog to your database. Continue?")) {
                try {
                  const updates = {};
                  Object.entries(INITIAL_CATALOG).forEach(([k, v]) => {
                    if (!products[k]) {
                      updates[k] = v;
                    }
                  });
                  if (Object.keys(updates).length > 0) {
                    await update(ref(db, 'products'), updates);
                    alert("Added " + Object.keys(updates).length + " new products!");
                  } else {
                    alert("No missing products to add.");
                  }
                } catch(e) {
                  alert("Failed: " + e.message);
                }
              }
            }}
            className="flex items-center gap-2 bg-[#FAF6F2] text-[#3A2E2A] px-6 py-3 rounded-full hover:bg-[#E8D8C8]/60 transition-colors border border-[#E8D8C8]/60 shadow-sm"
          >
            <RefreshCw size={18} />
            <span>Add Missing Products</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-2xl text-sm">
          <p className="font-semibold">Database Error</p>
          <p>{error}</p>
          <p className="mt-2 text-xs text-red-700/80">Please verify your Firebase Realtime Database rules allow read/write access.</p>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1,2,3,4].map(i => <div key={i} className="h-20 bg-[#FAF6F2] rounded-3xl animate-pulse" />)}
        </div>
      ) : error ? null : productEntries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {productEntries.map(([key, data]) => {
            const currentEdits = edits[key] || {};
            const displayPrice = currentEdits.price !== undefined ? currentEdits.price : data.price;
            const displayQty = currentEdits.quantity !== undefined ? currentEdits.quantity : data.quantity;
            const hasChanges = Object.keys(currentEdits).length > 0;

            // Calculate current percentage for visual reference
            const pct = Math.min(100, Math.max(0, (displayQty / (data.maxQuantity || 1)) * 100));

            return (
              <div key={key} className="bg-[#FAF6F2] border border-[#E8D8C8]/60 rounded-3xl p-6 shadow-[0_8px_30px_rgba(107,79,79,0.03)] flex flex-col gap-6 relative group">
                
                {/* Delete Button */}
                <button 
                  onClick={() => {
                    if(window.confirm(`Are you sure you want to permanently delete ${data.name}?`)) {
                      set(ref(db, `products/${key}`), null).catch(err => alert("Failed to delete product."));
                    }
                  }}
                  className="absolute top-4 right-4 p-2 text-[#6B4F4F]/40 hover:text-[#9E3D3D] hover:bg-[#9E3D3D]/10 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete Product"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                </button>

                {/* Header */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#E8D8C8]/50 flex items-center justify-center flex-shrink-0 text-[#9E3D3D] overflow-hidden">
                    {(() => {
                      // Try to match by ID first, then by name
                      const match = allProducts.find(p => p.id === key || p.name === data.name);
                      if (match && match.image) {
                        return <img src={match.image} alt={data.name} className="w-full h-full object-cover" />;
                      }
                      return <Package size={20} />;
                    })()}
                  </div>
                  <div className="pr-8">
                    <h3 className="font-medium text-[#3A2E2A] text-lg leading-tight">{data.name}</h3>
                    <p className="text-xs text-[#6B4F4F]/70 tracking-widest uppercase mt-1">ID: {key}</p>
                  </div>
                </div>

                {/* Controls */}
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] tracking-[0.2em] uppercase text-[#6B4F4F] font-semibold mb-2 block">Price (MAD)</label>
                    <input 
                      type="number"
                      min="0"
                      value={displayPrice}
                      onChange={(e) => handleEdit(key, 'price', e.target.value)}
                      className="w-full bg-[#F3ECE4]/50 border border-[#E8D8C8] rounded-xl px-4 py-2.5 text-[#3A2E2A] focus:outline-none focus:border-[#9E3D3D] transition-colors"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <label className="text-[10px] tracking-[0.2em] uppercase text-[#6B4F4F] font-semibold flex flex-col gap-1">
                        <span>Available Stock</span>
                        <span className="text-xs font-bold text-[#3A2E2A] lowercase tracking-normal">
                          value: {displayQty * displayPrice} MAD
                        </span>
                      </label>
                      <span className={displayQty <= 5 ? "text-[#9E3D3D] text-[10px] uppercase font-semibold" : "text-[10px] uppercase font-semibold"}>{displayQty} units</span>
                    </div>
                    <input 
                      type="number"
                      value={displayQty}
                      onChange={(e) => handleEdit(key, 'quantity', e.target.value)}
                      className="w-full bg-[#F3ECE4]/50 border border-[#E8D8C8] rounded-xl px-4 py-2.5 text-[#3A2E2A] focus:outline-none focus:border-[#9E3D3D] transition-colors mb-2"
                    />
                    
                    {/* Visual Bar inside admin - clamp to 0 for display */}
                    <div className="h-1.5 w-full bg-[#E8D8C8]/40 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${displayQty < 0 ? 'bg-red-500' : pct <= 20 ? 'bg-[#9E3D3D]' : 'bg-[#6B4F4F]'}`} 
                        style={{ width: displayQty < 0 ? '100%' : `${pct}%` }} 
                      />
                    </div>
                    {displayQty < 0 && (
                      <p className="text-xs text-red-600 font-semibold mt-1">⚠ Oversold by {Math.abs(displayQty)} unit{Math.abs(displayQty) !== 1 ? 's' : ''}</p>
                    )}
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-2">
                  <button
                    disabled={!hasChanges || saving}
                    onClick={() => handleSave(key)}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium tracking-wide uppercase transition-all duration-300 ${
                      hasChanges 
                        ? 'bg-[#9E3D3D] text-white shadow-lg shadow-[#9E3D3D]/20 hover:bg-[#823232]' 
                        : 'bg-[#E8D8C8]/30 text-[#6B4F4F]/50 cursor-not-allowed'
                    }`}
                  >
                    <Save size={16} />
                    {saving ? 'Saving...' : hasChanges ? 'Save Changes' : 'Up to Date'}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 text-[#6B4F4F]/60">
          No inventory found. Click 'Initialize Catalog' above.
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;
