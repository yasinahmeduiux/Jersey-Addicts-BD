import React, { useState } from 'react';
import { Search, Heart, ShoppingBag, Menu, X, ShieldCheck, HelpCircle, Phone, ArrowRight, Award, Trash2 } from 'lucide-react';
import { Product, CartItem, User, AppConfig } from '../types';
import { POPULAR_SEARCHES } from '../data/storeData';

interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  wishlist: Product[];
  onSelectProduct: (product: Product) => void;
  onSearch: (query: string) => void;
  onLogout?: () => void;
  currentUser?: User | null;
  appConfig: AppConfig;
  formatPrice: (amount: number) => string;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  setCurrentPage,
  setSelectedCategory,
  cart,
  setCart,
  wishlist,
  onSelectProduct,
  onSearch,
  onLogout,
  currentUser,
  appConfig,
  formatPrice,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      setCurrentPage('listing');
      setShowSearchDropdown(false);
    }
  };

  const handlePopularSearchClick = (term: string) => {
    setSearchQuery(term);
    onSearch(term);
    setCurrentPage('listing');
    setShowSearchDropdown(false);
  };

  const handleCategoryNav = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage('listing');
    setIsMobileMenuOpen(false);
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Promotion Announcement Bar */}
      <div className="bg-emerald-950 text-[10px] sm:text-xs text-emerald-200 font-medium tracking-wider text-center py-2 px-4 border-b border-emerald-900 flex justify-between items-center px-6 md:px-12">
        <div className="hidden md:flex items-center gap-2">
          <Award size={14} className="animate-pulse text-emerald-300" />
          <span>100% AUTHENTIC FOOTBALL JERSEYS</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-emerald-200">
          <span className="hover:text-white cursor-pointer flex items-center gap-1" onClick={() => setCurrentPage('seller')}>
            <ShieldCheck size={14} /> Sell Your Shirts
          </span>
          <span className="hover:text-white cursor-pointer flex items-center gap-1" onClick={() => setCurrentPage('contact')}>
            <Phone size={14} /> Support
          </span>
        </div>
      </div>

      {/* Top Navigation Row */}
      <div className="bg-white border-b border-emerald-100 py-4 px-4 md:px-12 flex justify-between items-center transition-all duration-300">
        
        {/* Brand Logo */}
        <div
          onClick={() => {
            setCurrentPage('home');
            setSelectedCategory('All');
          }}
          className="flex items-center gap-3 cursor-pointer group"
          id="brand-logo"
        >
          {/* Custom Jersey Addicts Logo Graphic */}
          <div className="flex-shrink-0 bg-emerald-50 p-1 rounded-xl border border-emerald-100 group-hover:border-emerald-500 transition-all">
            <svg viewBox="0 0 100 100" className="w-9 h-9">
              {/* Leftmost green triangle pointing down-left */}
              <path d="M 8 44 L 26 44 L 17 60 Z" fill="#059669" />
              {/* Green slanted bar */}
              <path d="M 28 76 L 46 24" stroke="#059669" strokeWidth="12" strokeLinecap="round" />
              {/* Navy slanted bar */}
              <path d="M 48 76 L 66 24" stroke="#10b981" strokeWidth="12" strokeLinecap="round" />
              {/* Navy right triangle pointing up-right */}
              <path d="M 74 56 L 92 56 L 83 40 Z" fill="#10b981" />
            </svg>
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-600 font-sans font-black text-sm md:text-lg tracking-tight leading-none uppercase group-hover:text-emerald-500 transition-colors">
                Jersey
              </span>
              <span className="text-emerald-950 font-sans font-black text-sm md:text-lg tracking-tight leading-none uppercase">
                Addicts
              </span>
              <span className="text-emerald-800 font-mono font-bold text-[9px] md:text-[10px] px-1.5 py-0.5 bg-emerald-50 rounded border border-emerald-200 leading-none">
                BD
              </span>
            </div>
          </div>
        </div>

        {/* Search Bar - Desktop */}
        <div className="relative hidden md:block w-full max-w-lg mx-6">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search David Beckham, Zidane, World Cup jerseys, club, league..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  onSearch(e.target.value);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                className="w-full bg-emerald-50/50 text-emerald-950 placeholder-emerald-800/60 text-sm pl-11 pr-4 py-2.5 rounded-full border border-emerald-100 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/40 transition-all duration-300"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-700 w-4 h-4" />
            </div>
          </form>

          {/* Autocomplete / Popular Searches Dropdown */}
          {showSearchDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-emerald-100 rounded-2xl shadow-2xl p-5 z-50 text-emerald-950 animate-fadeIn">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-emerald-800/80 tracking-wider uppercase">
                  Popular Searches
                </span>
                <button
                  onClick={() => setShowSearchDropdown(false)}
                  className="text-emerald-600 hover:text-emerald-900 text-xs"
                >
                  Close
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {POPULAR_SEARCHES.map((term) => (
                  <button
                    key={term}
                    onClick={() => handlePopularSearchClick(term)}
                    className="bg-emerald-50/50 hover:bg-emerald-100 border border-emerald-100 hover:border-emerald-300 text-xs px-3.5 py-1.5 rounded-full text-emerald-800 hover:text-emerald-950 transition-all cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
              <div className="border-t border-emerald-100 pt-3">
                <span className="text-[11px] text-emerald-600 font-mono flex items-center gap-1">
                  <ShieldCheck size={12} /> Search is secured & real-time
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Icons Right Side */}
        <div className="flex items-center gap-4 text-emerald-950">
          {/* Dynamic Authentication Session Control Bar */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <div className="hidden lg:flex flex-col text-right pr-2">
                <span className="text-[9px] text-emerald-600 font-mono font-bold uppercase tracking-wider">{currentUser.role}</span>
                <span className="text-xs text-emerald-950 font-bold truncate max-w-[100px]">{currentUser.fullName}</span>
              </div>
              
              {currentUser.role === 'Admin' ? (
                <button
                  onClick={() => setCurrentPage('admin')}
                  className="bg-emerald-50 border border-emerald-200 hover:border-emerald-400 text-emerald-800 text-[10px] uppercase font-mono tracking-widest px-3 py-1.5 rounded cursor-pointer transition-colors"
                  id="admin-dashboard-shortcut"
                >
                  Admin Room
                </button>
              ) : (
                <button
                  onClick={() => setCurrentPage('dashboard')}
                  className="bg-emerald-50 border border-emerald-100 hover:border-emerald-300 text-emerald-800 text-[10px] uppercase font-mono tracking-widest px-3 py-1.5 rounded cursor-pointer transition-colors"
                  id="my-account-btn"
                >
                  My Account
                </button>
              )}

              <button
                onClick={() => {
                  if (onLogout) onLogout();
                }}
                className="text-[10px] font-mono text-emerald-700 hover:text-red-600 uppercase tracking-wider px-2 py-1 transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setCurrentPage('auth')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] uppercase tracking-widest px-4 py-2 rounded-full shadow-md cursor-pointer transition-all"
              id="header-sign-in-btn"
            >
              Sign In
            </button>
          )}

          {/* Wishlist Link */}
          <button
            onClick={() => {
              setSelectedCategory('All');
              setCurrentPage('dashboard');
            }}
            className="relative p-2 hover:bg-emerald-50 rounded-full hover:text-emerald-700 transition-all cursor-pointer"
            id="wishlist-btn"
          >
            <Heart size={20} className={wishlist.length > 0 ? 'fill-red-500 text-red-500' : ''} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-600 text-white font-black text-[10px] w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Bag Icon with Preview Dropdown */}
          <div className="relative">
            <button
              onClick={() => setCurrentPage('cart')}
              onMouseEnter={() => setShowCartDropdown(true)}
              className="relative p-2.5 bg-emerald-50 border border-emerald-100 rounded-full hover:border-emerald-300 text-emerald-800 hover:text-emerald-950 transition-all cursor-pointer"
              id="shopping-bag-btn"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white font-black text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Quick Bag Preview Dropdown */}
            {showCartDropdown && cart.length > 0 && (
              <div
                onMouseLeave={() => setShowCartDropdown(false)}
                className="absolute right-0 mt-2 w-80 bg-white border border-emerald-100 rounded-2xl shadow-2xl p-4 z-50 animate-fadeIn text-emerald-950"
              >
                <div className="flex justify-between items-center border-b border-emerald-100 pb-2 mb-3">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    My Jersey Bag ({cartCount})
                  </span>
                  <button
                    onClick={() => setCurrentPage('cart')}
                    className="text-emerald-600 hover:text-emerald-800 text-xs font-semibold"
                  >
                    View Bag
                  </button>
                </div>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {cart.map((item, index) => (
                    <div key={index} className="flex gap-3 text-emerald-950 border-b border-emerald-50 pb-2">
                      <div className="w-12 h-12 bg-emerald-50 rounded p-1 flex items-center justify-center border border-emerald-100/30">
                        {/* Tiny Preview */}
                        <svg viewBox="0 0 200 240" className="w-full h-full">
                          <rect width="200" height="240" rx="10" fill="#f0fdf4" />
                          <circle cx="100" cy="120" r="60" fill="#059669" opacity="0.3" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate hover:text-emerald-700 cursor-pointer" onClick={() => { onSelectProduct(item.product); setCurrentPage('details'); }}>
                          {item.product.name}
                        </p>
                        <p className="text-[10px] text-emerald-700 font-mono">
                          Size: {item.selectedSize} | Qty: {item.quantity}
                        </p>
                        <p className="text-xs font-black text-emerald-800 mt-0.5">
                          {formatPrice(item.product.price)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(index)}
                        className="text-emerald-600 hover:text-red-600 self-center"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="border-t border-emerald-100 pt-3 mt-3">
                  <div className="flex justify-between items-center text-sm font-semibold mb-3">
                    <span className="text-emerald-700">Subtotal:</span>
                    <span className="text-emerald-900 font-black">{formatPrice(cartTotal)}</span>
                  </div>
                  <button
                    onClick={() => {
                      setShowCartDropdown(false);
                      setCurrentPage('checkout');
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-full flex items-center justify-center gap-1.5 uppercase tracking-wider shadow-md cursor-pointer"
                  >
                    Instant Checkout <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Hamburger Menu - Mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 hover:bg-emerald-50 rounded-full text-emerald-950"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Classic & World Cup Mega Menu Categories Row */}
      <nav className="bg-emerald-50 border-b border-emerald-100 py-3 px-4 md:px-12 hidden md:flex items-center justify-center gap-8">
        {[
          { name: 'All Jerseys', id: 'All' },
          { name: 'World Cup Collection', id: 'World Cup' },
          { name: 'England Classic', id: 'England' },
          { name: 'Legends Store', id: 'Legends' },
          { name: 'Current Season', id: 'Current Season' },
          { name: 'Mystery Box', id: 'Mystery' },
          { name: 'Clearance', id: 'Clearance' },
          { name: 'Club Classic', id: 'Classic' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryNav(cat.id)}
            className="text-xs font-sans tracking-widest font-semibold uppercase relative text-emerald-950 hover:text-emerald-700 py-1 transition-colors cursor-pointer group"
          >
            {cat.name}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-600 transition-all duration-300 group-hover:w-full"></span>
          </button>
        ))}
      </nav>

      {/* Mobile Sidebar Navigation */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-emerald-100 shadow-2xl z-50 py-6 px-5 space-y-5 animate-slideDown md:hidden text-emerald-950">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search jerseys..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-emerald-50 text-emerald-950 placeholder-emerald-700 text-sm pl-10 pr-4 py-2 rounded-full border border-emerald-100 focus:outline-none focus:border-emerald-500"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-600 w-4 h-4" />
          </form>

          {/* Navigation Categories */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono tracking-widest text-emerald-600 font-bold uppercase">
              Browse Categories
            </span>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'All Jerseys', id: 'All' },
                { name: 'World Cup', id: 'World Cup' },
                { name: 'England Classic', id: 'England' },
                { name: 'Legends Store', id: 'Legends' },
                { name: 'Current Season', id: 'Current Season' },
                { name: 'Mystery Box', id: 'Mystery' },
                { name: 'Clearance', id: 'Clearance' },
                { name: 'Club Classic', id: 'Classic' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryNav(cat.id)}
                  className="text-left text-sm py-2.5 px-3 bg-emerald-50 border border-emerald-100 rounded-xl hover:border-emerald-500 hover:text-emerald-700 transition-all"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-emerald-100 pt-4 space-y-3">
            <button
              onClick={() => {
                setCurrentPage('dashboard');
                setIsMobileMenuOpen(false);
              }}
              className="w-full bg-emerald-50 hover:bg-emerald-100 py-2.5 rounded-xl text-center text-xs uppercase font-mono tracking-wider font-semibold text-emerald-950"
            >
              My Dashboard
            </button>
            <button
              onClick={() => {
                setCurrentPage('seller');
                setIsMobileMenuOpen(false);
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-center text-xs uppercase tracking-wider font-bold"
            >
              Sell Your Shirts
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
