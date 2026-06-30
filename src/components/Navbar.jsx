import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, User, Menu, X, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = ({ cartCount, setIsCartOpen, theme, toggleTheme }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-foreground hover:text-primary transition-colors"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu size={24} />
        </button>

        {/* Logo */}
        <div className="flex-1 md:flex-none text-center md:text-left">
          <a href="#" className="text-2xl font-semibold tracking-widest text-gradient uppercase">
            Aura
          </a>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-8 text-sm font-medium tracking-wide uppercase">
          <a href="#" className="text-foreground/80 hover:text-foreground transition-colors">Skincare</a>
          <a href="#" className="text-foreground/80 hover:text-foreground transition-colors">Fragrance</a>
          <a href="#" className="text-foreground/80 hover:text-foreground transition-colors">Makeup</a>
          <a href="#" className="text-foreground/80 hover:text-foreground transition-colors">Collections</a>
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-5 flex-1 md:flex-none justify-end">
          <button 
            className="text-foreground hover:text-primary transition-colors hidden sm:block"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="text-foreground hover:text-primary transition-colors hidden sm:block">
            <Search size={20} />
          </button>
          <button className="text-foreground hover:text-primary transition-colors hidden sm:block">
            <User size={20} />
          </button>
          <button 
            className="text-foreground hover:text-primary transition-colors relative"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center shadow-lg">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-md flex flex-col pt-20 px-6">
          <button 
            className="absolute top-6 left-6 text-foreground"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={24} />
          </button>
          <div className="flex flex-col space-y-6 text-2xl font-light uppercase tracking-wider">
            <a href="#" className="border-b border-white/10 pb-4">Skincare</a>
            <a href="#" className="border-b border-white/10 pb-4">Fragrance</a>
            <a href="#" className="border-b border-white/10 pb-4">Makeup</a>
            <a href="#" className="border-b border-white/10 pb-4">Collections</a>
          </div>
        </div>
      )}
    </motion.nav>
  );
};

export default Navbar;
