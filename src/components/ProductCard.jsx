import React from 'react';
import { useCart } from '../context/CartContext';
import { Leaf, Droplet, Sun, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  const { increment, decrement, getQuantity, catalog } = useCart();
  
  const count = getQuantity(product.id);
  const catalogItem = catalog[product.id] || { quantity: 50, maxQuantity: 50 };
  const livePrice = product.price; // Strictly use the local price (6 MAD)
  const availableQty = catalogItem.quantity ?? 50;
  const isOutOfStock = availableQty <= 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full flex flex-col group relative bg-[#FAF6F2] rounded-3xl border border-[#E8D8C8]/60 overflow-hidden transition-shadow duration-700 hover:shadow-[0_20px_60px_rgba(45,31,31,0.08)] flex-shrink-0 md:w-[450px] transform-gpu"
    >
      
      {/* Image Container - Premium Framed Image */}
      <div className="relative w-full aspect-[4/3] bg-[#FAF6F2] p-4 pb-8">
        <div className="w-full h-full relative rounded-2xl overflow-hidden border-2 border-[#E8D8C8]/60 shadow-sm">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover transform-gpu transition-transform duration-700 ease-out group-hover:scale-105 z-10 will-change-transform"
          />
          
          {/* Subtle Inner Ring */}
          <div className="absolute inset-0 border border-white/40 rounded-2xl pointer-events-none z-20 mix-blend-overlay"></div>
        </div>
        
        {/* Decorative Badge (e.g., 100% Natural) */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-[#8c7a6b]/30 flex flex-col items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 mix-blend-multiply">
           <span className="text-[9px] text-[#5a443f] font-medium leading-tight text-center tracking-wider">100%<br/>NATURAL</span>
        </div>
      </div>

      {/* Content Container */}
      <div className="flex flex-col flex-1 p-8 pt-6 z-10 bg-white rounded-t-[2.5rem] border-t border-[#F3ECE4] -mt-6 shadow-[0_-10px_20px_rgba(45,31,31,0.02)] overflow-hidden">
        
        {/* Subtitle & Tag */}
        <motion.div 
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="flex items-center gap-2 mb-3"
        >
          <Sun className="w-3 h-3 text-[#8c7a6b]" />
          <span className="text-[10px] tracking-[0.2em] uppercase text-[#8c7a6b] font-medium">{product.tag || 'Luxury Collection'}</span>
        </motion.div>

        {/* Title Row */}
        <motion.div 
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, delay: 0.02, ease: "easeOut" }}
          className="mb-4"
        >
          <h3 className="text-3xl font-normal text-[#2d1f1f] leading-tight">
            {product.name}
          </h3>
        </motion.div>
        
        <motion.div 
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.3, delay: 0.04, ease: "circOut" }}
          className="w-12 h-[1px] bg-[#E8D8C8] mb-4"
        ></motion.div>
        
        {/* Description */}
        <motion.p 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05, ease: "easeOut" }}
          className="text-[#5a443f] font-light leading-relaxed text-sm mb-6"
        >
          {product.description}
        </motion.p>
        
        {/* Stock Info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.06 }}
          className="flex justify-between items-center text-[10px] uppercase tracking-widest text-[#8c7a6b] font-medium mb-6"
        >
          <span>{isOutOfStock ? 'Sold Out' : 'Available Stock'}</span>
          {!isOutOfStock && <span className="text-[#731625]">{availableQty} Units</span>}
        </motion.div>

        {/* 3 Features Block */}
        <div className="flex justify-between items-center bg-[#F3ECE4]/50 rounded-2xl p-4 mb-8">
          <div className="flex flex-col items-center text-center gap-2 flex-1">
            <Leaf className="w-5 h-5 text-[#8c7a6b] stroke-[1.5]" />
            <div>
              <p className="text-[10px] font-semibold text-[#2d1f1f]">Natural Ingredients</p>
              <p className="text-[9px] text-[#5a443f]">Pure & Safe</p>
            </div>
          </div>
          <div className="w-[1px] h-8 bg-[#E8D8C8]"></div>
          <div className="flex flex-col items-center text-center gap-2 flex-1">
            <Droplet className="w-5 h-5 text-[#8c7a6b] stroke-[1.5]" />
            <div>
              <p className="text-[10px] font-semibold text-[#2d1f1f]">Brightens</p>
              <p className="text-[9px] text-[#5a443f]">Healthy Glow</p>
            </div>
          </div>
          <div className="w-[1px] h-8 bg-[#E8D8C8]"></div>
          <div className="flex flex-col items-center text-center gap-2 flex-1">
            <Sun className="w-5 h-5 text-[#8c7a6b] stroke-[1.5]" />
            <div>
              <p className="text-[10px] font-semibold text-[#2d1f1f]">Multi-use</p>
              <p className="text-[9px] text-[#5a443f]">Versatile</p>
            </div>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="mt-auto">
          {/* Price */}
          <div className="flex justify-between items-center mb-4 border-b border-[#E8D8C8]/50 pb-4">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#8c7a6b] font-medium">Market Price</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-light text-[#731625]">{livePrice}</span>
              <span className="text-sm font-medium text-[#731625] uppercase">MAD</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Quantity Selector */}
            <div className="flex items-center justify-between border border-[#E8D8C8] rounded-full px-2 py-1 w-28 bg-white transition-colors duration-500">
              <button 
                onClick={() => decrement(product.id)}
                className="text-[#8c7a6b] hover:text-[#2d1f1f] w-8 h-10 flex items-center justify-center disabled:opacity-30 transition-colors"
                disabled={count === 0}
              >
                -
              </button>
              <span className="text-[#2d1f1f] font-medium min-w-[20px] text-center">{count}</span>
              <button 
                onClick={() => increment(product.id, livePrice, product.name)}
                className="text-[#8c7a6b] hover:text-[#2d1f1f] w-8 h-10 flex items-center justify-center disabled:opacity-30 transition-colors"
                disabled={isOutOfStock || count >= availableQty}
              >
                +
              </button>
            </div>

            {/* Add to Cart Button */}
            <button 
              onClick={() => increment(product.id, livePrice, product.name)}
              disabled={isOutOfStock || count >= availableQty}
              className="flex-1 flex items-center justify-center gap-2 bg-[#731625] text-white py-4 rounded-full font-light tracking-wide hover:bg-[#5a111d] transition-colors disabled:bg-gray-300 group"
            >
              <span className="text-sm">Add to Cart</span>
              <svg className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-center gap-4 mt-6 text-[9px] text-[#8c7a6b] uppercase tracking-wider font-medium">
          <div className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> 100% Original</div>
          <span>|</span>
          <div>Made in Morocco</div>
        </div>

      </div>
    </motion.div>
  );
};

export default ProductCard;
