import React, { useState, useMemo } from 'react';
import { PRODUCTS, CUSTOMER_REVIEWS, SELLER_REQUESTS } from './data/storeData';
import { Product, CartItem, SellerRequest, Order, CarouselSlide, User, AppConfig } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductDetails } from './components/ProductDetails';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';
import { AdminPanel } from './components/AdminPanel';
import { CustomerDashboard } from './components/CustomerDashboard';
import { SellerModule } from './components/SellerModule';
import { InfoPages } from './components/InfoPages';
import { Footer } from './components/Footer';
import { AuthScreen } from './components/AuthScreen';
import { SlidersHorizontal, ArrowRight, CheckCircle, ShieldCheck, Heart, Sparkles, MessageSquare, BookOpen, Star, RotateCcw } from 'lucide-react';

const INITIAL_SLIDES: CarouselSlide[] = [
  {
    id: 'slide-1',
    title: 'WORLD CUP 2026 EDITION',
    subtitle: 'The Grandest Stage of Football',
    description: 'Explore the official jerseys, limited-edition jerseys, and exclusive fan collections for the upcoming FIFA World Cup 2026. Support your nation in style!',
    badge: 'WORLD CUP 2026 EXCLUSIVE',
    primaryColor: 'from-[#0b3c5d] to-[#041c2c]',
    productId: 'shirt-5',
    customImage: 'https://images.unsplash.com/photo-1431324155629-1a6edd1dec1d?auto=format&fit=crop&q=80&w=1600'
  },
  {
    id: 'slide-2',
    title: 'BECKHAM EURO 2004',
    subtitle: 'England Timeless Home Classics',
    description: 'The iconic Umbro shoulder stripe returns. Mint condition deadstock with original certificate of vintage authentication.',
    badge: 'GOLDEN GENERATION',
    primaryColor: 'from-[#1e3a8a] to-[#0f172a]',
    productId: 'shirt-2',
  },
  {
    id: 'slide-3',
    title: 'PREMIUM SURPRISE VAULT',
    subtitle: 'The Ultimate Mystery Shirt Experience',
    description: 'Choose your size, and let our curators surprise you with a 100% genuine vintage or current season official kit in a premium presentation pack.',
    badge: 'TOP SELLING ANNUALLY',
    primaryColor: 'from-[#064e3b] to-[#022c22]',
    productId: 'shirt-7',
  }
];

const INITIAL_USERS: User[] = [
  {
    id: 'admin-dhaka',
    email: 'admin.dhaka@vault.bd',
    fullName: 'Kazi Yasin Ahmed (Bangladesh Director)',
    role: 'Admin',
    password: '01840990700',
    simulatedIp: '103.230.104.5',
    location: 'Dhaka, Bangladesh'
  },
  {
    id: 'admin-gattuso',
    email: 'admin@vault.com',
    fullName: 'Gennaro Gattuso (Director)',
    role: 'Admin',
    password: '01840990700',
    simulatedIp: '192.168.1.1',
    location: 'Milan, Italy'
  },
  {
    id: 'customer-marcus',
    email: 'customer@vault.com',
    fullName: 'Marcus Rashford',
    role: 'Customer',
    password: 'password',
    simulatedIp: '82.165.122.9',
    location: 'Manchester, UK'
  }
];

const DEFAULT_APP_CONFIG: AppConfig = {
  logoText: 'Jersey Addicts BD',
  logoSubtext: '',
  theme: 'bengal',
  footerAbout: "The world's premium destination for verified original vintage football jerseys. Founded by obsessive collectors, for obsessive collectors. Every kit undergoes a rigorous 12-point authentication process in our physical workshops in Dhaka, Bangladesh.",
  footerLocations: [
    { city: 'Dhaka HQ', address: 'Shop No. 8, 3rd Floor, AQP Shopping Mall, 143/2 New Bailey Road, Dhaka 1217, Bangladesh', phone: '+880 1840-990700' }
  ],
  footerCopyright: '© 2026 Jersey Addicts BD. All rights reserved. Registered trademark. Crafted for Bangladeshi Fans.',
  currencySymbol: '৳',
  currencyCode: 'BDT',
  exchangeRate: 115,
  timerTeam1: 'ESP',
  timerTeam1Emoji: '🇪🇸',
  timerTeam2: 'BEL',
  timerTeam2Emoji: '🇧🇪',
  timerLabel: 'QUARTER-FINAL',
  timerTargetHours: 20,
  timerEnabled: true
};

export default function App() {
  // Navigation State
  const [currentPage, setCurrentPage] = useState<string>('home'); // home, listing, details, cart, checkout, admin, dashboard, seller, faq, about, contact, etc.
  
  // Data State (allowing live edits by admin/seller modules to propagate, loaded from localStorage if custom card uploads occur!)
  const [products, setProducts] = useState<Product[]>(() => {
    const stored = localStorage.getItem('vault_custom_products');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return PRODUCTS;
      }
    }
    return PRODUCTS;
  });

  const [sellerRequests, setSellerRequests] = useState<SellerRequest[]>(SELLER_REQUESTS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  
  // Selected Detail product
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Last Order Confirmation Screen
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // App customization configuration state
  const [appConfig, setAppConfig] = useState<AppConfig>(() => {
    const stored = localStorage.getItem('vault_app_config');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.logoText === 'THE VAULT BD' || parsed.logoText === 'Jersey Addicts BD') {
          parsed.logoText = 'Jersey Addicts BD';
        }
        parsed.logoSubtext = '';
        parsed.footerLocations = [
          { city: 'Dhaka HQ', address: 'Shop No. 8, 3rd Floor, AQP Shopping Mall, 143/2 New Bailey Road, Dhaka 1217, Bangladesh', phone: '+880 1840-990700' }
        ];
        return parsed;
      } catch (e) {
        return DEFAULT_APP_CONFIG;
      }
    }
    return DEFAULT_APP_CONFIG;
  });

  const handleUpdateConfig = (newConfig: AppConfig) => {
    setAppConfig(newConfig);
    localStorage.setItem('vault_app_config', JSON.stringify(newConfig));
  };

  // Carousel Slides state
  const [slides, setSlides] = useState<CarouselSlide[]>(() => {
    const stored = localStorage.getItem('vault_carousel_slides');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.map((s: CarouselSlide) => {
          if (s.id === 'slide-1' && (s.title === 'THE 1998 FRANCE VAULT' || s.title === 'WORLD CUP 2026 EDITION')) {
            return INITIAL_SLIDES[0];
          }
          return s;
        });
      } catch (e) {}
    }
    return INITIAL_SLIDES;
  });

  // Auth & Session state
  const [usersList, setUsersList] = useState<User[]>(() => {
    const stored = localStorage.getItem('vault_users_list');
    if (stored) {
      try {
        const parsed: User[] = JSON.parse(stored);
        return parsed.map((u) => {
          const match = INITIAL_USERS.find((du) => du.id === u.id || du.email.toLowerCase() === u.email.toLowerCase());
          if (match) {
            return { ...u, password: match.password, role: match.role };
          }
          return u;
        });
      } catch (e) {
        return INITIAL_USERS;
      }
    }
    return INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('vault_current_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const handleSetSlides = (newSlides: CarouselSlide[] | ((prev: CarouselSlide[]) => CarouselSlide[])) => {
    setSlides((prev) => {
      const next = typeof newSlides === 'function' ? newSlides(prev) : newSlides;
      localStorage.setItem('vault_carousel_slides', JSON.stringify(next));
      return next;
    });
  };

  const handleRegisterUser = (newUser: User) => {
    setUsersList((prev) => {
      const next = [...prev, newUser];
      localStorage.setItem('vault_users_list', JSON.stringify(next));
      return next;
    });
  };

  const handleLoginSuccess = (user: User, autoSave: boolean) => {
    setCurrentUser(user);
    if (autoSave) {
      localStorage.setItem('vault_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('vault_current_user');
    }
    
    // Redirect role-based
    if (user.role === 'Admin') {
      setCurrentPage('admin');
    } else {
      setCurrentPage('dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('vault_current_user');
    setCurrentPage('home');
  };

  const handleUpdateProductImage = (productId: string, base64: string) => {
    setProducts((prev) => {
      const next = prev.map((p) => (p.id === productId ? { ...p, uploadedImage: base64 } : p));
      localStorage.setItem('vault_custom_products', JSON.stringify(next));
      return next;
    });
  };

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCondition, setSelectedCondition] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('featured'); // featured, price-low, price-high, year-old, year-new, rating
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Add to Cart
  const handleAddToCart = (item: CartItem) => {
    setCart((prev) => {
      // Check if item with same configuration (id + size + print name + print number) already exists
      const existingIdx = prev.findIndex((i) => {
        const matchProd = i.product.id === item.product.id;
        const matchSize = i.selectedSize === item.selectedSize;
        const matchPrint = JSON.stringify(i.customPrint) === JSON.stringify(item.customPrint);
        const matchBadge = i.addBadge === item.addBadge;
        return matchProd && matchSize && matchPrint && matchBadge;
      });

      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx].quantity += item.quantity;
        return copy;
      }
      return [...prev, item];
    });
  };

  // Quick Add helper (adds standard first size with no custom nameset)
  const handleQuickAdd = (product: Product) => {
    const standardSize = product.sizes[0] || 'M';
    const item: CartItem = {
      product,
      selectedSize: standardSize,
      quantity: 1,
    };
    handleAddToCart(item);
    alert(`✓ Added ${product.name} (Size ${standardSize}) to your Bag!`);
  };

  // Wishlist heart toggler
  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const isFav = prev.some((p) => p.id === product.id);
      if (isFav) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const handleRemoveWishlist = (product: Product) => {
    setWishlist((prev) => prev.filter((p) => p.id !== product.id));
  };

  // Add seller request from user form
  const handleAddSellerRequest = (req: SellerRequest) => {
    setSellerRequests((prev) => [req, ...prev]);
  };

  // Successful Order submission
  const handleOrderSuccess = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
    setLastPlacedOrder(order);
    setCurrentPage('order-success');
  };

  // Compute filtered/sorted product catalog array
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.sku && p.sku.toLowerCase().includes(q))
      );
    }

    // Brand filter
    if (selectedBrand !== 'All') {
      result = result.filter((p) => p.brand.toLowerCase() === selectedBrand.toLowerCase());
    }

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Condition filter
    if (selectedCondition !== 'All') {
      result = result.filter((p) => p.condition.toLowerCase() === selectedCondition.toLowerCase());
    }

    // Sorting operations
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'year-new') {
      result.sort((a, b) => b.year - a.year);
    } else if (sortBy === 'year-old') {
      result.sort((a, b) => a.year - b.year);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, searchQuery, selectedBrand, selectedCategory, selectedCondition, sortBy]);

  // Compute related items for Details screen
  const relatedJerseys = useMemo(() => {
    if (!selectedProduct) return [];
    return products.filter(
      (p) =>
        p.id !== selectedProduct.id &&
        (p.brand === selectedProduct.brand || p.category === selectedProduct.category)
    );
  }, [products, selectedProduct]);

  // Reset all catalog filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedBrand('All');
    setSelectedCategory('All');
    setSelectedCondition('All');
    setSortBy('featured');
  };

  const getThemeBgClass = () => {
    return 'bg-white';
  };

  const formatPrice = (amount: number): string => {
    const converted = Math.round(amount * appConfig.exchangeRate);
    return `${appConfig.currencySymbol}${converted.toLocaleString()}`;
  };

  return (
    <div className={`min-h-screen bg-white text-emerald-950 selection:bg-emerald-800 selection:text-white flex flex-col justify-between`}>
      
      {/* Embedded Sticky Header */}
      <Header
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        cart={cart}
        setCart={setCart}
        wishlist={wishlist}
        onSelectProduct={(p) => {
          setSelectedProduct(p);
          setCurrentPage('details');
        }}
        onSearch={(query) => {
          setSearchQuery(query);
        }}
        currentUser={currentUser}
        onLogout={handleLogout}
        appConfig={appConfig}
        formatPrice={formatPrice}
      />

      {/* MAIN BODY DISPLAY */}
      <main className="flex-grow">
        
        {/* ROUTE 1: LANDING HOME VIEW */}
        {currentPage === 'home' && (
          <div className="space-y-16 pb-16">
            
            {/* Visual Hero Screen */}
            <Hero
              onExplore={(cat) => {
                setSelectedCategory(cat);
                setCurrentPage('listing');
              }}
              featuredProducts={products.filter((p) => p.isFeatured)}
              onSelectProduct={(p) => {
                setSelectedProduct(p);
                setCurrentPage('details');
              }}
              setCurrentPage={setCurrentPage}
              slides={slides}
              appConfig={appConfig}
            />

            {/* Visual Highlight Brand Category Cards */}
            <section className="max-w-7xl mx-auto px-6 md:px-12 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
                <div>
                  <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-emerald-950 font-display">
                    Historical Sourced Collections
                  </h2>
                  <p className="text-xs text-emerald-800 font-mono">Select curated labels of heritage football aesthetics</p>
                </div>
                <button
                  onClick={() => { resetFilters(); setCurrentPage('listing'); }}
                  className="text-xs text-emerald-700 font-bold uppercase tracking-wider flex items-center gap-1 hover:text-emerald-950 transition-colors cursor-pointer"
                >
                  View All Jerseys <ArrowRight size={14} />
                </button>
              </div>

              {/* Grid of beautiful visual cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: 'World Cup Legends', count: '10 Models', cat: 'Legends', bg: 'from-blue-50/50 to-white border-blue-100 hover:border-blue-300' },
                  { title: '90s Club Classics', count: '14 Models', cat: 'Club Jerseys', bg: 'from-emerald-50/50 to-white border-emerald-100 hover:border-emerald-300' },
                  { title: 'International Icons', count: '8 Models', cat: 'International', bg: 'from-amber-50/50 to-white border-amber-100 hover:border-amber-300' },
                  { title: 'Verified Mint Deadstock', count: '12 Models', cat: 'Legends', bg: 'from-purple-50/50 to-white border-purple-100 hover:border-purple-300' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedCategory(item.cat);
                      setCurrentPage('listing');
                    }}
                    className={`bg-gradient-to-br ${item.bg} border rounded-2xl p-6 cursor-pointer transition-all group relative overflow-hidden shadow-sm hover:shadow-md`}
                  >
                    <div className="space-y-1">
                      <h3 className="text-emerald-950 font-black uppercase tracking-tight text-lg group-hover:text-emerald-700 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-emerald-800 text-xs font-mono">{item.count}</p>
                    </div>
                    <div className="mt-8 flex justify-end text-emerald-600 group-hover:text-emerald-800 group-hover:translate-x-1.5 transition-all">
                      <ArrowRight size={18} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Curated Hot Showcase (Top 4 rated shirts) */}
            <section className="max-w-7xl mx-auto px-6 md:px-12 space-y-6">
              <div className="flex justify-between items-end border-b border-emerald-100 pb-3">
                <div>
                  <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-emerald-950 font-display">
                    Rare Vault Restocks
                  </h2>
                  <p className="text-xs text-emerald-800 font-mono">Highly limited original vintage shirts secured this week</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.slice(0, 4).map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onSelect={(p) => {
                      setSelectedProduct(p);
                      setCurrentPage('details');
                    }}
                    onToggleWishlist={handleToggleWishlist}
                    isWishlisted={wishlist.some((w) => w.id === prod.id)}
                    onQuickAdd={handleQuickAdd}
                    onUpdateImage={handleUpdateProductImage}
                    formatPrice={formatPrice}
                  />
                ))}
              </div>
            </section>

            {/* Corporate Authenticity Ribbon banner */}
            <section className="bg-emerald-50 py-12 border-t border-b border-emerald-100">
              <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                <div className="space-y-2">
                  <span className="text-emerald-700 font-mono text-xs font-bold uppercase block">12-POINT AUDIT</span>
                  <h4 className="text-emerald-950 font-bold uppercase">Physical Verification Lab</h4>
                  <p className="text-emerald-800 text-xs leading-relaxed">Every kit passes physical wash care tag audits and crest thread checks inside our clean verification suites.</p>
                </div>
                <div className="space-y-2">
                  <span className="text-emerald-700 font-mono text-xs font-bold uppercase block">SECURE TRANSPARENCY</span>
                  <h4 className="text-emerald-950 font-bold uppercase">No Modern replicas</h4>
                  <p className="text-emerald-800 text-xs leading-relaxed">We hold zero tolerance policies for counterfeit remakes. The Vault only issues genuine manufacturer products.</p>
                </div>
                <div className="space-y-2">
                  <span className="text-emerald-700 font-mono text-xs font-bold uppercase block">SAFE DELIVERIES</span>
                  <h4 className="text-emerald-950 font-bold uppercase">Vacuum Case Sealed</h4>
                  <p className="text-emerald-800 text-xs leading-relaxed">Jerseys are chemical-cleaned, folded inside premium sealed cases, and insured with logistics tracking.</p>
                </div>
              </div>
            </section>

            {/* Testimonials Slider */}
            <section className="max-w-7xl mx-auto px-6 md:px-12 space-y-6">
              <div className="text-center">
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-emerald-950 font-display">Verified Collector reviews</h2>
                <p className="text-xs text-emerald-800 font-mono mt-1">What global kit enthusiasts declare about our platform</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {CUSTOMER_REVIEWS.map((rev) => (
                  <div key={rev.id} className="bg-white border border-emerald-100 p-5 rounded-2xl space-y-3 relative shadow-sm">
                    <div className="flex gap-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={11} className="fill-amber-500 text-amber-500" />
                      ))}
                    </div>
                    <p className="text-emerald-800 text-[11.5px] italic leading-relaxed">"{rev.comment}"</p>
                    <div className="border-t border-emerald-100 pt-2 flex justify-between items-center text-[10px] font-mono">
                      <span className="text-emerald-950 font-bold">{rev.userName.toUpperCase()}</span>
                      <span className="text-emerald-700 font-bold">✓ PURCHASE VERIFIED</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        )}

        {/* ROUTE 2: CATALOG LISTING */}
        {currentPage === 'listing' && (
          <section className="max-w-7xl mx-auto px-4 md:px-12 py-10 min-h-screen">
            
            {/* Catalog Banner */}
            <div className="border-b border-emerald-100 pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h1 className="text-3xl font-black uppercase tracking-tight text-emerald-950 font-display">Historical Jersey Vault</h1>
                <p className="text-xs text-emerald-700 font-mono mt-1">
                  Showing {filteredProducts.length} verified original jerseys
                </p>
              </div>

              {/* Reset filter tag */}
              {(selectedBrand !== 'All' || selectedCategory !== 'All' || selectedCondition !== 'All' || searchQuery !== '') && (
                <button
                  onClick={resetFilters}
                  className="bg-red-50 border border-red-200 text-red-700 text-[11px] font-mono px-3.5 py-1.5 rounded-full flex items-center gap-1.5 cursor-pointer hover:bg-red-100"
                >
                  <RotateCcw size={11} /> Clear All Filter Parameters
                </button>
              )}
            </div>

            {/* Catalog Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Filter Sidebar */}
              <div className="lg:col-span-3 bg-white border border-emerald-100 rounded-2xl p-6 space-y-6 shadow-sm">
                
                <div className="flex justify-between items-center border-b border-emerald-100 pb-2">
                  <h3 className="text-xs font-mono font-black text-emerald-700 uppercase tracking-widest flex items-center gap-1.5">
                    <SlidersHorizontal size={13} /> Filter Engine
                  </h3>
                  <button onClick={resetFilters} className="text-[10px] text-emerald-600 hover:text-emerald-800 font-mono uppercase">
                    Reset
                  </button>
                </div>

                {/* Search */}
                <div className="space-y-2">
                  <span className="text-[10px] text-emerald-800 font-mono font-bold uppercase tracking-wider block">Keyword Search:</span>
                  <input
                    type="text"
                    placeholder="Search player, club, SKU..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-emerald-50/50 border border-emerald-100 rounded-xl py-2 px-3 text-emerald-950 placeholder-emerald-800/45 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono"
                  />
                </div>

                {/* Brands */}
                <div className="space-y-2">
                  <span className="text-[10px] text-emerald-800 font-mono font-bold uppercase tracking-wider block">Brands:</span>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {['All', 'Adidas', 'Nike', 'Umbro', 'Kappa', 'Puma'].map((b) => (
                      <div
                        key={b}
                        onClick={() => setSelectedBrand(b)}
                        className={`text-xs px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                          selectedBrand === b ? 'bg-emerald-600 text-white font-extrabold shadow-sm' : 'hover:bg-emerald-50 text-emerald-900'
                        }`}
                      >
                        {b}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-2">
                  <span className="text-[10px] text-emerald-800 font-mono font-bold uppercase tracking-wider block">Category:</span>
                  <div className="space-y-1.5">
                    {['All', 'Legends', 'Club Jerseys', 'Training', 'International'].map((cat) => (
                      <div
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`text-xs px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                          selectedCategory === cat ? 'bg-emerald-600 text-white font-extrabold shadow-sm' : 'hover:bg-emerald-50 text-emerald-900'
                        }`}
                      >
                        {cat}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Conditions */}
                <div className="space-y-2">
                  <span className="text-[10px] text-emerald-800 font-mono font-bold uppercase tracking-wider block">Condition Matrix:</span>
                  <div className="space-y-1.5">
                    {['All', 'Mint', 'Excellent', 'Very Good'].map((cond) => (
                      <div
                        key={cond}
                        onClick={() => setSelectedCondition(cond)}
                        className={`text-xs px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                          selectedCondition === cond ? 'bg-emerald-600 text-white font-extrabold shadow-sm' : 'hover:bg-emerald-50 text-emerald-900'
                        }`}
                      >
                        {cond}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sorting Select */}
                <div className="space-y-2">
                  <span className="text-[10px] text-emerald-800 font-mono font-bold uppercase tracking-wider block">Sort Catalogue:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-emerald-50/50 border border-emerald-100 rounded-xl py-2 px-3 text-emerald-950 text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="featured">Sourced Featured</option>
                    <option value="price-low">Price: Low-to-High</option>
                    <option value="price-high">Price: High-to-Low</option>
                    <option value="year-new">Year: Modern-to-Old</option>
                    <option value="year-old">Year: Old-to-Modern</option>
                    <option value="rating">User Rating Score</option>
                  </select>
                </div>

              </div>

              {/* Right Column: Active catalog items matching filters */}
              <div className="lg:col-span-9">
                {filteredProducts.length === 0 ? (
                  <div className="bg-white border border-emerald-100 rounded-2xl p-12 text-center space-y-4 shadow-sm">
                    <p className="text-emerald-800 text-sm max-w-sm mx-auto">
                      No vintage jerseys found matching the selected search query or category parameters inside the database.
                    </p>
                    <button
                      onClick={resetFilters}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-widest px-6 py-2.5 rounded-full cursor-pointer transition-all shadow-md shadow-emerald-600/10"
                    >
                      Clear Active Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProducts.map((prod) => (
                      <ProductCard
                        key={prod.id}
                        product={prod}
                        onSelect={(p) => {
                          setSelectedProduct(p);
                          setCurrentPage('details');
                        }}
                        onToggleWishlist={handleToggleWishlist}
                        isWishlisted={wishlist.some((w) => w.id === prod.id)}
                        onQuickAdd={handleQuickAdd}
                        onUpdateImage={handleUpdateProductImage}
                        formatPrice={formatPrice}
                      />
                    ))}
                  </div>
                )}
              </div>

            </div>
          </section>
        )}

        {/* ROUTE 3: DETAILED VIEW */}
        {currentPage === 'details' && selectedProduct && (
          <ProductDetails
            product={selectedProduct}
            onBackToCatalog={() => setCurrentPage('listing')}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleToggleWishlist}
            isWishlisted={wishlist.some((w) => w.id === selectedProduct.id)}
            relatedProducts={relatedJerseys}
            onSelectProduct={(p) => {
              setSelectedProduct(p);
              window.scrollTo(0,0);
            }}
            formatPrice={formatPrice}
          />
        )}

        {/* ROUTE 4: SHOPPING BAG */}
        {currentPage === 'cart' && (
          <Cart
            cart={cart}
            setCart={setCart}
            onCheckout={() => setCurrentPage('checkout')}
            onBackToCatalog={() => setCurrentPage('listing')}
            formatPrice={formatPrice}
          />
        )}

        {/* ROUTE 5: CHECKOUT GATEWAYS */}
        {currentPage === 'checkout' && (
          <Checkout
            cart={cart}
            setCart={setCart}
            onOrderSuccess={handleOrderSuccess}
            onBackToCart={() => setCurrentPage('cart')}
            onBackToCatalog={() => setCurrentPage('listing')}
            formatPrice={formatPrice}
            appConfig={appConfig}
          />
        )}
        {currentPage === 'order-success' && lastPlacedOrder && (
          <section className="max-w-xl mx-auto px-6 py-16 text-center space-y-6 text-emerald-950 animate-fadeIn">
            <div className="w-20 h-20 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle size={38} className="text-emerald-800" />
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-black uppercase tracking-tight">Secured Order Confirmed</h1>
              <p className="text-xs text-emerald-800 font-mono">Reference ID: {lastPlacedOrder.id} • Authenticating...</p>
            </div>

            <div className="bg-emerald-50/50 border border-emerald-100 p-6 rounded-2xl text-xs text-left space-y-3 font-mono">
              <p className="flex justify-between border-b border-emerald-100 pb-2">
                <span className="text-emerald-700 font-bold">RECIPIENT NAME:</span>
                <span className="text-emerald-950 font-bold">{lastPlacedOrder.shippingAddress.fullName}</span>
              </p>
              <p className="flex justify-between border-b border-emerald-100 pb-2">
                <span className="text-emerald-700 font-bold">SHIPPING TRACKER:</span>
                <span className="text-emerald-950 font-bold">{lastPlacedOrder.trackingNumber}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-emerald-700 font-bold">GRAND TOTAL PAID:</span>
                <span className="text-emerald-950 font-extrabold">{formatPrice(lastPlacedOrder.total)}</span>
              </p>
            </div>

            <p className="text-emerald-800 text-xs leading-relaxed max-w-sm mx-auto">
              We have dispatched vacuum packaging boxes to your destination address. Track your authentic shipping milestones inside your profile dashboard room.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={() => setCurrentPage('dashboard')}
                className="flex-1 bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-widest py-3.5 rounded-full cursor-pointer transition-all"
              >
                Track Live Logistics
              </button>
              <button
                onClick={() => setCurrentPage('listing')}
                className="flex-1 bg-white hover:bg-emerald-50 text-emerald-800 font-bold text-xs uppercase tracking-wider py-3.5 rounded-full cursor-pointer transition-all border border-emerald-100"
              >
                Continue Collecting
              </button>
            </div>
          </section>
        )}

        {/* ROUTE 7: ADMIN CONTROL ROOM */}
        {currentPage === 'admin' && (
          currentUser?.role === 'Admin' ? (
            <AdminPanel
              products={products}
              setProducts={setProducts}
              sellerRequests={sellerRequests}
              setSellerRequests={setSellerRequests}
              orders={orders}
              onBackToCatalog={() => setCurrentPage('listing')}
              slides={slides}
              setSlides={handleSetSlides}
              appConfig={appConfig}
              onUpdateConfig={handleUpdateConfig}
              formatPrice={formatPrice}
            />
          ) : (
            <div className="max-w-md mx-auto my-16 text-center space-y-6 bg-white border border-emerald-100 p-8 rounded-3xl text-emerald-950 shadow-sm">
              <span className="text-4xl">🛠</span>
              <h3 className="text-lg font-black uppercase tracking-tight text-emerald-800">Restricted Access Control Room</h3>
              <p className="text-xs text-emerald-700 font-mono">You must authenticate using administrator credentials to manage inventory and customize slides.</p>
              <button
                onClick={() => setCurrentPage('auth')}
                className="w-full bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-widest py-3 rounded-xl transition-all cursor-pointer"
              >
                Sign In as Admin
              </button>
            </div>
          )
        )}

        {/* ROUTE 8: CUSTOMER COCKPIT */}
        {currentPage === 'dashboard' && (
          currentUser ? (
            <CustomerDashboard
              orders={orders}
              wishlist={wishlist}
              onRemoveWishlist={handleRemoveWishlist}
              onSelectProduct={(p) => {
                setSelectedProduct(p);
                setCurrentPage('details');
              }}
              setCurrentPage={setCurrentPage}
              formatPrice={formatPrice}
            />
          ) : (
            <div className="max-w-md mx-auto my-16 text-center space-y-6 bg-white border border-emerald-100 p-8 rounded-3xl text-emerald-950 shadow-sm">
              <span className="text-4xl">🔐</span>
              <h3 className="text-lg font-black uppercase tracking-tight text-emerald-800">Locked Vault Access</h3>
              <p className="text-xs text-emerald-700 font-mono">Sign in with your email or register to view your custom locker room, orders, and wishlist details.</p>
              <button
                onClick={() => setCurrentPage('auth')}
                className="w-full bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-widest py-3 rounded-xl transition-all cursor-pointer"
              >
                Sign In To Account
              </button>
            </div>
          )
        )}

        {/* ROUTE AUTHENTICATION */}
        {currentPage === 'auth' && (
          <AuthScreen
            onLoginSuccess={handleLoginSuccess}
            usersList={usersList}
            onRegisterUser={handleRegisterUser}
            onCancel={() => setCurrentPage('home')}
          />
        )}

        {/* ROUTE 9: SELL SHIRT PORTAL */}
        {currentPage === 'seller' && (
          <SellerModule onAddRequest={handleAddSellerRequest} />
        )}

        {/* ROUTE 10+: INFORMATION COMPLIANCE PAGES */}
        {(currentPage === 'faq' ||
          currentPage === 'about' ||
          currentPage === 'contact' ||
          currentPage === 'privacy' ||
          currentPage === 'refund' ||
          currentPage === 'terms' ||
          currentPage === 'shipping') && (
          <InfoPages pageType={currentPage} onBack={() => setCurrentPage('listing')} />
        )}

      </main>

      {/* Embedded Brand Footer */}
      <Footer currentPage={currentPage} setCurrentPage={setCurrentPage} appConfig={appConfig} />

    </div>
  );
}
