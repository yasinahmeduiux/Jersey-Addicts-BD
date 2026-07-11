import React, { useState } from 'react';
import { AreaChart, Users, Shirt, ShoppingBag, Check, X, ShieldAlert, BadgeCheck, FileText, Plus, Save, Sparkles, Download, Upload, AlertTriangle, Image, Trash2, Edit, Search, Smartphone, Monitor, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { Product, SellerRequest, Order, CarouselSlide, AppConfig } from '../types';
import { JerseyRenderer } from './JerseyRenderer';
import { InventoryEditor } from './InventoryEditor';
import { TEAMS_LIST, RIVALRY_PRESETS, TeamItem } from '../data/teamsData';

interface AdminPanelProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  sellerRequests: SellerRequest[];
  setSellerRequests: React.Dispatch<React.SetStateAction<SellerRequest[]>>;
  orders: Order[];
  onBackToCatalog: () => void;
  slides: CarouselSlide[];
  setSlides: React.Dispatch<React.SetStateAction<CarouselSlide[]>>;
  appConfig: AppConfig;
  onUpdateConfig: (newConfig: AppConfig) => void;
  formatPrice: (amount: number) => string;
}

const CAROUSEL_PRESETS = [
  { name: 'WC 2026 Arena', url: 'https://images.unsplash.com/photo-1431324155629-1a6edd1dec1d?auto=format&fit=crop&q=80&w=1600' },
  { name: 'Stadium Lamps', url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=1600' },
  { name: 'Match Battle', url: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&q=80&w=1600' },
  { name: 'Sunset Field', url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=1600' },
  { name: 'Fan Festival', url: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80&w=1600' },
  { name: 'Green Pitch', url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=1600' }
];

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  setProducts,
  sellerRequests,
  setSellerRequests,
  orders,
  onBackToCatalog,
  slides,
  setSlides,
  appConfig,
  onUpdateConfig,
  formatPrice,
}) => {
  // Tabs: 'dashboard' | 'inventory' | 'seller-requests' | 'homepage-builder' | 'coupons'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'seller-requests' | 'homepage-builder' | 'coupons'>('dashboard');

  // Coupon Generator State
  const [coupons, setCoupons] = useState([
    { code: 'CLASSIC10', discount: 10, limit: 100, active: true },
    { code: 'WORLDCUP26', discount: 15, limit: 50, active: true },
  ]);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState(20);

  // Homepage customizer
  const [heroTitle, setHeroTitle] = useState('WORLD CUP 2026 EDITION');
  const [activePromoBanner, setActivePromoBanner] = useState(true);
  const [selectedSlideIdx, setSelectedSlideIdx] = useState(0);
  const [previewDeviceMode, setPreviewDeviceMode] = useState<'desktop' | 'mobile'>('desktop');

  // Countdown search states
  const [team1Search, setTeam1Search] = useState('');
  const [team2Search, setTeam2Search] = useState('');
  const [team1Category, setTeam1Category] = useState('All');
  const [team2Category, setTeam2Category] = useState('All');

  // Image uploader state for quick stock addition
  const [quickAddImage, setQuickAddImage] = useState<string>('');

  const handleUpdateSlide = (updatedSlide: CarouselSlide) => {
    setSlides((prev) => prev.map((s) => (s.id === updatedSlide.id ? updatedSlide : s)));
  };

  const handleAddSlide = () => {
    if (slides.length >= 5) return; // limit to 5 slots
    const newSlide: CarouselSlide = {
      id: `slide-${Date.now()}`,
      title: 'WORLD CUP CLASSIC CLEARANCE',
      subtitle: 'Save Big on Nations Jerseys',
      description: 'Save big on unique Classic 1 of 1s from nations that competed at the 2026 World Cup.',
      badge: 'LIMITED TIME CLEARANCE',
      primaryColor: 'from-[#031d10] to-[#070e0a]',
      productId: products[0]?.id || 'shirt-1',
    };
    setSlides((prev) => {
      const next = [...prev, newSlide];
      setSelectedSlideIdx(next.length - 1);
      return next;
    });
  };

  const handleDeleteSlide = (id: string) => {
    setSlides((prev) => {
      const next = prev.filter((s) => s.id !== id);
      setSelectedSlideIdx((prevIdx) => Math.min(prevIdx, next.length - 1));
      return next;
    });
  };

  const moveSlide = (index: number, direction: 'left' | 'right') => {
    const targetIdx = direction === 'left' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= slides.length) return;
    const newSlides = [...slides];
    const temp = newSlides[index];
    newSlides[index] = newSlides[targetIdx];
    newSlides[targetIdx] = temp;
    setSlides(newSlides);
    setSelectedSlideIdx(targetIdx);
  };

  const bulkLoadWCPresets = () => {
    const wcSlides: CarouselSlide[] = [
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
        title: 'ARGENTINA THREE STARS',
        subtitle: 'Defending Champions Match Jersey',
        description: 'Own a piece of tournament history. Premium gold heat-pressed emblems with dry-fit cooling ventilation fabric.',
        badge: 'DEFENDING CHAMPIONS',
        primaryColor: 'from-[#1e3a8a] to-[#0f172a]',
        productId: 'shirt-4',
        customImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=1600'
      },
      {
        id: 'slide-3',
        title: 'BRAZIL RETRO SAMBA',
        subtitle: 'Seleção Historical Authentic Reissue',
        description: 'The golden classic of Ronaldo No.9. Rare weave texture with vintage embroidery lines direct from the Rio vaults.',
        badge: 'SAMBA LEGENDS',
        primaryColor: 'from-[#064e3b] to-[#022c22]',
        productId: 'shirt-3',
        customImage: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&q=80&w=1600'
      },
      {
        id: 'slide-4',
        title: 'GERMANY RETRO 1990',
        subtitle: 'The Geometric Classic Jersey',
        description: 'Rep the ultimate tournament geometry. Woven details, heavy knit ribbed collars, and pristine historical authenticity.',
        badge: 'HISTORIC REISSUE',
        primaryColor: 'from-[#111827] to-[#030712]',
        productId: 'shirt-6',
        customImage: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=1600'
      },
      {
        id: 'slide-5',
        title: 'DHAKA HUB FAN WEAR',
        subtitle: 'Exclusive Jersey Addicts BD Capsule',
        description: 'Engineered for maximum breathable comfort under Dhaka summers. Express your sheer addiction to the beautiful game.',
        badge: 'LOCAL DHAKA RELEASES',
        primaryColor: 'from-[#065f46] to-[#022c22]',
        productId: 'shirt-1',
        customImage: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80&w=1600'
      }
    ];
    setSlides(wcSlides);
    setSelectedSlideIdx(0);
  };

  // Seller request controls
  const handleSellerRequest = (id: string, action: 'Approved' | 'Rejected') => {
    setSellerRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: action } : req))
    );
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    setCoupons((prev) => [
      ...prev,
      {
        code: newCouponCode.toUpperCase().trim(),
        discount: newCouponDiscount,
        limit: 100,
        active: true,
      },
    ]);
    setNewCouponCode('');
  };

  // KPIs
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0) + 148290; // Add simulated historical sales
  const pendingRequestsCount = sellerRequests.filter((r) => r.status === 'Pending').length;
  const lowStockCount = products.filter((p) => p.stock <= 3).length;

  return (
    <section className="bg-white text-emerald-950 py-10 px-4 md:px-12 max-w-7xl mx-auto min-h-screen">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-emerald-100 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-ping" />
            <h1 className="text-3xl font-black uppercase tracking-tight text-emerald-950">Admin Command Room</h1>
          </div>
          <p className="text-xs text-emerald-800 font-mono">
            Platform Engine • Secure Control Tower 2026
          </p>
        </div>
        <button
          onClick={onBackToCatalog}
          className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-extrabold text-xs uppercase tracking-widest px-6 py-3 rounded-xl cursor-pointer"
        >
          Return to Client Website
        </button>
      </div>

      {/* Admin Tabs Panel */}
      <div className="flex overflow-x-auto md:flex-wrap gap-2.5 border-b border-emerald-100 pb-4 mb-8 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-none whitespace-nowrap flex-nowrap">
        {[
          { id: 'dashboard', label: 'Overview Dashboard' },
          { id: 'inventory', label: 'Inventory & Stock Desk' },
          { id: 'seller-requests', label: `Pending Seller Requests (${pendingRequestsCount})` },
          { id: 'homepage-builder', label: 'Drag Homepage Builder' },
          { id: 'coupons', label: 'Coupon & Campaign Codes' },
          { id: 'brand-customizer', label: '🛠 Bangladesh Theme & Logo Customizer' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-2.5 px-5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 flex-shrink-0 ${
              activeTab === tab.id
                ? 'bg-emerald-800 text-white font-black shadow-lg shadow-emerald-800/10'
                : 'bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-850'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* RENDER ACTIVE TAB */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* KPI Dashboard Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* KPI 1 */}
            <div className="bg-emerald-50/40 border border-emerald-100 p-6 rounded-2xl relative overflow-hidden shadow-xl">
              <span className="absolute top-4 right-4 text-emerald-700"><AreaChart size={24} /></span>
              <p className="text-emerald-800 text-[10px] font-mono tracking-wider uppercase">Gross Store Revenue</p>
              <h2 className="text-2xl font-black text-emerald-950 mt-2">{formatPrice(totalRevenue)}</h2>
              <span className="text-[9px] text-emerald-800 font-bold block mt-1">▲ +14.2% Growth compared to Q1</span>
            </div>

            {/* KPI 2 */}
            <div className="bg-emerald-50/40 border border-emerald-100 p-6 rounded-2xl relative overflow-hidden shadow-xl">
              <span className="absolute top-4 right-4 text-emerald-700"><Users size={24} /></span>
              <p className="text-emerald-800 text-[10px] font-mono tracking-wider uppercase">Active Collectors</p>
              <h2 className="text-2xl font-black text-emerald-950 mt-2">12,492</h2>
              <span className="text-[9px] text-emerald-800 font-bold block mt-1">▲ +84 new registrations today</span>
            </div>

            {/* KPI 3 */}
            <div className="bg-emerald-50/40 border border-emerald-100 p-6 rounded-2xl relative overflow-hidden shadow-xl">
              <span className="absolute top-4 right-4 text-emerald-700"><Shirt size={24} /></span>
              <p className="text-emerald-800 text-[10px] font-mono tracking-wider uppercase">Verified Sourced Stock</p>
              <h2 className="text-2xl font-black text-emerald-950 mt-2">{products.reduce((sum, p) => sum + p.stock, 0)} shirts</h2>
              <span className="text-[9px] text-emerald-800 font-bold block mt-1">▲ 8 discrete models in active catalog</span>
            </div>

            {/* KPI 4 */}
            <div className="bg-emerald-50/40 border border-emerald-100 p-6 rounded-2xl relative overflow-hidden shadow-xl">
              <span className="absolute top-4 right-4 text-emerald-700"><AlertTriangle size={24} /></span>
              <p className="text-emerald-800 text-[10px] font-mono tracking-wider uppercase">Stock & Seller Alerts</p>
              <h2 className="text-2xl font-black text-red-600 mt-2">{lowStockCount + pendingRequestsCount} alerts</h2>
              <span className="text-[9px] text-red-600 font-bold block mt-1">⚡ {lowStockCount} items at low limits</span>
            </div>

          </div>

          {/* Simulated Monthly Sales Trend Chart */}
          <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-sm font-bold uppercase text-emerald-950">Monthly Store Sales Performance Trend</h3>
                <p className="text-[10px] text-emerald-700 font-mono">Gross aggregate store volume (including retro releases)</p>
              </div>
              <span className="bg-emerald-100 text-emerald-800 font-mono text-[10px] px-2.5 py-1 rounded">Secured Cloud Run Server Logs</span>
            </div>

            {/* SVG Visual Bar Chart */}
            <div className="h-64 flex items-end justify-between gap-2 md:gap-4 pt-4 border-b border-emerald-100 pb-2">
              {[
                { m: 'Jan', val: 40 }, { m: 'Feb', val: 55 }, { m: 'Mar', val: 48 },
                { m: 'Apr', val: 75 }, { m: 'May', val: 82 }, { m: 'Jun', val: 95 },
                { m: 'Jul', val: 120 }, { m: 'Aug', val: 110 }, { m: 'Sep', val: 135 },
                { m: 'Oct', val: 142 }, { m: 'Nov', val: 158 }, { m: 'Dec', val: 180 }
              ].map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="text-[10px] text-emerald-800 opacity-0 group-hover:opacity-100 transition-opacity font-mono font-bold">${item.val}k</div>
                  <div
                    className="w-full bg-gradient-to-t from-emerald-200 to-emerald-700 hover:from-emerald-350 hover:to-emerald-800 rounded-t-lg transition-all duration-500 shadow-lg"
                    style={{ height: `${item.val}px` }}
                  />
                  <span className="text-[9px] font-mono text-emerald-700">{item.m}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Recent Activity list */}
          <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-6">
            <h3 className="text-sm font-bold uppercase text-emerald-950 mb-4">Recent Secure Server Activity Logs</h3>
            <div className="space-y-2.5 font-mono text-[10px] text-emerald-850">
              <p className="flex justify-between border-b border-emerald-100 pb-2">
                <span>[2026-07-09 14:38] AUTH_JWT: New verification token issued for user yasinahmed000997@gmail.com</span>
                <span className="text-emerald-700 font-bold">STATUS: OK</span>
              </p>
              <p className="flex justify-between border-b border-emerald-100 pb-2">
                <span>[2026-07-09 14:32] STRIPE_WEBHOOK: Secure checkout payment intent confirmed for $349</span>
                <span className="text-emerald-700 font-bold">STATUS: COMPLETED</span>
              </p>
              <p className="flex justify-between">
                <span>[2026-07-09 14:28] BACKUP: Automated database partition snap-shotted to MongoDB Atlas</span>
                <span className="text-emerald-700 font-bold">STATUS: MOUNTED</span>
              </p>
            </div>
          </div>

        </div>
      )}

      {activeTab === 'inventory' && (
        <InventoryEditor
          products={products}
          setProducts={setProducts}
          formatPrice={formatPrice}
        />
      )}

      {activeTab === 'seller-requests' && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-sm font-bold uppercase text-emerald-950">Collector Submission Approval Desk</h3>
            <p className="text-[10px] text-emerald-700 font-mono">Approve submitted user shirts for physical verification checks or reject them directly</p>
          </div>

          <div className="space-y-4">
            {sellerRequests.map((req) => (
              <div
                key={req.id}
                className="bg-emerald-50/40 border border-emerald-100 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="bg-emerald-100 text-emerald-800 font-mono text-[10px] px-2.5 py-0.5 rounded font-bold border border-emerald-200">
                      ID: {req.id}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-mono">{req.date}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-black ${
                      req.status === 'Pending'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : req.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {req.status}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-emerald-950">{req.shirtName}</h4>
                  <p className="text-xs text-emerald-850">
                    Brand: <span className="text-emerald-950 font-mono">{req.brand}</span> | Season: <span className="text-emerald-950 font-mono">{req.season}</span> | Condition: <span className="text-emerald-800 font-bold">{req.condition}</span>
                  </p>
                  <p className="text-xs font-semibold text-emerald-850">
                    Seller Expected Value: <span className="text-emerald-950 font-mono font-black">${req.expectedPrice}</span>
                  </p>
                </div>

                {req.status === 'Pending' && (
                  <div className="flex gap-2 w-full md:w-auto">
                    <button
                      onClick={() => handleSellerRequest(req.id, 'Approved')}
                      className="flex-1 md:flex-none bg-emerald-800 hover:bg-emerald-900 border border-emerald-700 text-white text-xs px-5 py-2.5 rounded-xl uppercase tracking-wider font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Check size={14} /> Approve Submission
                    </button>
                    <button
                      onClick={() => handleSellerRequest(req.id, 'Rejected')}
                      className="flex-1 md:flex-none bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs px-5 py-2.5 rounded-xl uppercase tracking-wider font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <X size={14} /> Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'homepage-builder' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-emerald-50/40 border border-emerald-100 p-6 rounded-2xl">
            <div>
              <h3 className="text-base font-bold uppercase text-emerald-950">Interactive Homepage Carousel Builder</h3>
              <p className="text-[11px] text-emerald-800 font-mono mt-0.5">Add, edit, or remove slides, upload custom slide banner images, and pair with target products.</p>
            </div>
            <button
              type="button"
              onClick={handleAddSlide}
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs uppercase tracking-widest px-5 py-3 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer flex-shrink-0"
            >
              <Plus size={14} className="stroke-[3]" /> Add New Banner Slide
            </button>
          </div>

          {/* Match Countdown Timer Settings */}
          <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-6 space-y-6">
            <div className="border-b border-emerald-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-600 animate-pulse" />
                <h4 className="text-sm font-mono font-black text-emerald-950 uppercase tracking-widest">
                  LIVE MATCH COUNTDOWN TIMER CONTROLLER & PRESETS
                </h4>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onUpdateConfig({ ...appConfig, timerEnabled: false })}
                  className={`text-[10px] font-mono font-black uppercase px-3 py-1.5 rounded transition-all cursor-pointer ${
                    appConfig.timerEnabled === false
                      ? 'bg-red-600 text-white font-black'
                      : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                  }`}
                >
                  🔴 HIDE / TURN OFF (SHOW NOTHING)
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateConfig({ ...appConfig, timerEnabled: true })}
                  className={`text-[10px] font-mono font-black uppercase px-3 py-1.5 rounded transition-all cursor-pointer ${
                    appConfig.timerEnabled !== false
                      ? 'bg-emerald-800 text-white font-black'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  🟢 SHOW TIMER
                </button>
              </div>
            </div>

            {/* Featured Rivalries (Filterable / Searchable Grid) */}
            <div className="space-y-3 bg-white border border-emerald-100 p-4 rounded-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-100 pb-2">
                <label className="text-[10px] text-emerald-950 font-mono uppercase tracking-widest block font-bold">
                  ⭐ SELECT PRESET RIVALRY MATCH ({RIVALRY_PRESETS.length} CLASSIC DERBIES):
                </label>
                <span className="text-[9px] text-emerald-600 font-mono">
                  Sets Team 1, Team 2, Emojis, Stage/Label & Ideal Countdown hours!
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 max-h-[220px] overflow-y-auto pr-1">
                {RIVALRY_PRESETS.map((preset) => {
                  const isActive = appConfig.timerTeam1 === preset.team1.code && appConfig.timerTeam2 === preset.team2.code;
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => onUpdateConfig({
                        ...appConfig,
                        timerTeam1: preset.team1.code,
                        timerTeam1Emoji: preset.team1.emoji,
                        timerTeam2: preset.team2.code,
                        timerTeam2Emoji: preset.team2.emoji,
                        timerLabel: preset.label,
                        timerTargetHours: preset.hours,
                        timerEnabled: true
                      })}
                      className={`text-left p-2 rounded-xl transition-all cursor-pointer border flex flex-col justify-between h-[68px] ${
                        isActive
                          ? 'bg-emerald-100 border-emerald-400 text-emerald-950'
                          : 'bg-white border border-emerald-100 hover:border-emerald-200 hover:bg-emerald-50 text-emerald-850'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[9px] font-mono font-bold text-emerald-600 uppercase tracking-tight">
                          {preset.label}
                        </span>
                        <span className="text-[9px] font-mono font-bold text-emerald-850">
                          {preset.hours}h
                        </span>
                      </div>
                      <p className="text-[10px] font-black text-emerald-950 line-clamp-1">
                        {preset.name}
                      </p>
                      <div className="flex items-center gap-1.5 text-[9px] font-mono text-emerald-700">
                        <span>{preset.team1.emoji} {preset.team1.code}</span>
                        <span>vs</span>
                        <span>{preset.team2.code} {preset.team2.emoji}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Time Hours Presets */}
            <div className="space-y-2 bg-white border border-emerald-100 p-4 rounded-xl">
              <label className="text-[10px] text-emerald-950 font-mono uppercase tracking-widest block font-bold">
                ⏰ QUICK TIME DURATION PRESETS:
              </label>
              <div className="flex flex-wrap gap-2.5">
                {[12, 24, 36, 48, 72, 96, 120].map((hours) => (
                  <button
                    key={hours}
                    type="button"
                    onClick={() => onUpdateConfig({ ...appConfig, timerTargetHours: hours, timerEnabled: true })}
                    className={`text-[10px] font-mono font-black uppercase px-3 py-1.5 rounded transition-all cursor-pointer border ${
                      appConfig.timerTargetHours === hours
                        ? 'bg-emerald-800 text-white border-emerald-800 font-extrabold'
                        : 'bg-white text-emerald-700 border border-emerald-100 hover:bg-emerald-50'
                    }`}
                  >
                    {hours} Hours ({Math.round(hours / 24)} Days)
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Interactive Team Selectors */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
              
              {/* TEAM 1 SEARCH & SELECTOR */}
              <div className="bg-white border border-emerald-100 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                  <span className="text-[11px] font-mono font-black text-emerald-950 uppercase tracking-widest">
                    👈 SELECT TEAM 1 (HOME)
                  </span>
                  <span className="bg-emerald-50 text-emerald-800 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-200/60">
                    Selected: {appConfig.timerTeam1Emoji} {appConfig.timerTeam1}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] text-emerald-700 font-mono uppercase block mb-1">League Category:</label>
                    <select
                      value={team1Category}
                      onChange={(e) => setTeam1Category(e.target.value)}
                      className="w-full bg-white border border-emerald-100 rounded-lg py-1 px-2 text-[11px] text-emerald-950 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="All">All Categories</option>
                      {Array.from(new Set(TEAMS_LIST.map((t) => t.category))).map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] text-emerald-700 font-mono uppercase block mb-1">Search Club:</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Type name..."
                        value={team1Search}
                        onChange={(e) => setTeam1Search(e.target.value)}
                        className="w-full bg-white border border-emerald-100 rounded-lg py-1 pl-2 pr-6 text-[11px] text-emerald-950 focus:outline-none focus:border-emerald-500"
                      />
                      <Search size={10} className="absolute right-2 top-2 text-emerald-600" />
                    </div>
                  </div>
                </div>

                {/* Grid list of team items for Team 1 */}
                <div className="bg-white rounded-lg p-2 max-h-[140px] overflow-y-auto space-y-1 border border-emerald-100">
                  {TEAMS_LIST.filter((t) => {
                    const matchesCat = team1Category === 'All' || t.category === team1Category;
                    const matchesSearch = t.name.toLowerCase().includes(team1Search.toLowerCase()) || t.code.toLowerCase().includes(team1Search.toLowerCase());
                    return matchesCat && matchesSearch;
                  }).slice(0, 40).map((team) => (
                    <button
                      key={team.name}
                      type="button"
                      onClick={() => onUpdateConfig({
                        ...appConfig,
                        timerTeam1: team.code,
                        timerTeam1Emoji: team.emoji,
                        timerEnabled: true
                      })}
                      className={`w-full text-left py-1.5 px-2.5 rounded text-[10px] font-bold flex items-center justify-between transition-all ${
                        appConfig.timerTeam1 === team.code
                          ? 'bg-emerald-800 text-white'
                          : 'text-emerald-800 hover:bg-emerald-50'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <span className="text-xs">{team.emoji}</span>
                        <span>{team.name}</span>
                      </span>
                      <span className="font-mono opacity-80 uppercase tracking-wider">{team.code}</span>
                    </button>
                  ))}
                  {TEAMS_LIST.filter((t) => {
                    const matchesCat = team1Category === 'All' || t.category === team1Category;
                    const matchesSearch = t.name.toLowerCase().includes(team1Search.toLowerCase()) || t.code.toLowerCase().includes(team1Search.toLowerCase());
                    return matchesCat && matchesSearch;
                  }).length === 0 && (
                    <p className="text-[10px] text-gray-500 text-center py-2">No matching clubs found.</p>
                  )}
                </div>
              </div>

              {/* TEAM 2 SEARCH & SELECTOR */}
              <div className="bg-white border border-emerald-100 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                  <span className="text-[11px] font-mono font-black text-emerald-950 uppercase tracking-widest">
                    👈 SELECT TEAM 2 (AWAY)
                  </span>
                  <span className="bg-emerald-50 text-emerald-800 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-200/60">
                    Selected: {appConfig.timerTeam2} {appConfig.timerTeam2Emoji}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] text-emerald-700 font-mono uppercase block mb-1">League Category:</label>
                    <select
                      value={team2Category}
                      onChange={(e) => setTeam2Category(e.target.value)}
                      className="w-full bg-white border border-emerald-100 rounded-lg py-1 px-2 text-[11px] text-emerald-950 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="All">All Categories</option>
                      {Array.from(new Set(TEAMS_LIST.map((t) => t.category))).map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] text-emerald-700 font-mono uppercase block mb-1">Search Club:</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Type name..."
                        value={team2Search}
                        onChange={(e) => setTeam2Search(e.target.value)}
                        className="w-full bg-white border border-emerald-100 rounded-lg py-1 pl-2 pr-6 text-[11px] text-emerald-950 focus:outline-none focus:border-emerald-500"
                      />
                      <Search size={10} className="absolute right-2 top-2 text-emerald-600" />
                    </div>
                  </div>
                </div>

                {/* Grid list of team items for Team 2 */}
                <div className="bg-white rounded-lg p-2 max-h-[140px] overflow-y-auto space-y-1 border border-emerald-100">
                  {TEAMS_LIST.filter((t) => {
                    const matchesCat = team2Category === 'All' || t.category === team2Category;
                    const matchesSearch = t.name.toLowerCase().includes(team2Search.toLowerCase()) || t.code.toLowerCase().includes(team2Search.toLowerCase());
                    return matchesCat && matchesSearch;
                  }).slice(0, 40).map((team) => (
                    <button
                      key={team.name}
                      type="button"
                      onClick={() => onUpdateConfig({
                        ...appConfig,
                        timerTeam2: team.code,
                        timerTeam2Emoji: team.emoji,
                        timerEnabled: true
                      })}
                      className={`w-full text-left py-1.5 px-2.5 rounded text-[10px] font-bold flex items-center justify-between transition-all ${
                        appConfig.timerTeam2 === team.code
                          ? 'bg-emerald-800 text-white'
                          : 'text-emerald-800 hover:bg-emerald-50'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <span className="text-xs">{team.emoji}</span>
                        <span>{team.name}</span>
                      </span>
                      <span className="font-mono opacity-80 uppercase tracking-wider">{team.code}</span>
                    </button>
                  ))}
                  {TEAMS_LIST.filter((t) => {
                    const matchesCat = team2Category === 'All' || t.category === team2Category;
                    const matchesSearch = t.name.toLowerCase().includes(team2Search.toLowerCase()) || t.code.toLowerCase().includes(team2Search.toLowerCase());
                    return matchesCat && matchesSearch;
                  }).length === 0 && (
                    <p className="text-[10px] text-emerald-600 text-center py-2">No matching clubs found.</p>
                  )}
                </div>
              </div>

            </div>

            {/* Live values inputs and fine-tuning */}
            <div className="pt-3 border-t border-emerald-100">
              <p className="text-[10px] text-emerald-700 font-mono uppercase tracking-wider mb-2 font-bold">
                🔧 MANUAL FINE-TUNING / CUSTOM OVERWRITE (IF YOU WANT TO TYPE ENTIRELY CUSTOM VALUES):
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-emerald-700 font-mono uppercase block">Team 1 Code:</label>
                  <input
                    type="text"
                    value={appConfig.timerTeam1 || 'ESP'}
                    onChange={(e) => onUpdateConfig({ ...appConfig, timerTeam1: e.target.value.toUpperCase() })}
                    className="w-full bg-white border border-emerald-100 rounded-xl py-2 px-3 text-xs text-emerald-950 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-emerald-700 font-mono uppercase block">Team 1 Emoji:</label>
                  <input
                    type="text"
                    value={appConfig.timerTeam1Emoji || '🇪🇸'}
                    onChange={(e) => onUpdateConfig({ ...appConfig, timerTeam1Emoji: e.target.value })}
                    className="w-full bg-white border border-emerald-100 rounded-xl py-2 px-3 text-xs text-emerald-950 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-emerald-700 font-mono uppercase block">Team 2 Code:</label>
                  <input
                    type="text"
                    value={appConfig.timerTeam2 || 'BEL'}
                    onChange={(e) => onUpdateConfig({ ...appConfig, timerTeam2: e.target.value.toUpperCase() })}
                    className="w-full bg-white border border-emerald-100 rounded-xl py-2 px-3 text-xs text-emerald-950 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-emerald-700 font-mono uppercase block">Team 2 Emoji:</label>
                  <input
                    type="text"
                    value={appConfig.timerTeam2Emoji || '🇧🇪'}
                    onChange={(e) => onUpdateConfig({ ...appConfig, timerTeam2Emoji: e.target.value })}
                    className="w-full bg-white border border-emerald-100 rounded-xl py-2 px-3 text-xs text-emerald-950 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1 col-span-2 md:col-span-1">
                  <label className="text-[10px] text-emerald-700 font-mono uppercase block">Stage / Label:</label>
                  <input
                    type="text"
                    value={appConfig.timerLabel || 'QUARTER-FINAL'}
                    onChange={(e) => onUpdateConfig({ ...appConfig, timerLabel: e.target.value })}
                    className="w-full bg-white border border-emerald-100 rounded-xl py-2 px-3 text-xs text-emerald-950 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1 col-span-2 md:col-span-1">
                  <label className="text-[10px] text-emerald-700 font-mono uppercase block">Countdown Hours:</label>
                  <input
                    type="number"
                    value={appConfig.timerTargetHours !== undefined ? appConfig.timerTargetHours : 20}
                    onChange={(e) => onUpdateConfig({ ...appConfig, timerTargetHours: Number(e.target.value) })}
                    className="w-full bg-white border border-emerald-100 rounded-xl py-2 px-3 text-xs text-emerald-950 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* STYLISH CAROUSEL MANAGER (4-5 IMAGE HERO CONTROLLER) */}
          <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-emerald-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="text-emerald-800 h-4 w-4" />
                  <h4 className="text-sm font-mono font-black text-emerald-950 uppercase tracking-widest">
                    PRESTIGE HERO CAROUSEL CONTROLLER (4-5 IMAGE SLOTS)
                  </h4>
                </div>
                <p className="text-[11px] text-emerald-800 font-mono mt-1">
                  Configure 4-5 high-resolution banner images, target product routes, and promotional captions. Changes sync globally instantly.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={bulkLoadWCPresets}
                  className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-mono text-[10px] uppercase font-black px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Instantly populates 5 stunning ready-to-go 2026 World Cup slider graphics"
                >
                  <Sparkles size={12} className="text-emerald-700" /> Apply World Cup 2026 Presets
                </button>
                {slides.length < 5 && (
                  <button
                    type="button"
                    onClick={handleAddSlide}
                    className="bg-emerald-800 hover:bg-emerald-700 text-white font-black text-[10px] uppercase px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus size={12} className="stroke-[3]" /> Add Slide Slot
                  </button>
                )}
              </div>
            </div>

            {/* 5 Slot Navigation Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {[0, 1, 2, 3, 4].map((idx) => {
                const slide = slides[idx];
                const isSelected = selectedSlideIdx === idx;
                
                if (slide) {
                  return (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => setSelectedSlideIdx(idx)}
                      className={`text-left p-3 rounded-xl border transition-all relative flex flex-col justify-between h-[90px] cursor-pointer group overflow-hidden ${
                        isSelected
                          ? 'bg-emerald-100 border-emerald-500 ring-2 ring-emerald-500/20'
                          : 'bg-white border-emerald-100 hover:border-emerald-200 hover:bg-emerald-50'
                      }`}
                    >
                      {/* Micro slide background thumbnail */}
                      <div className="absolute inset-0 opacity-10 group-hover:opacity-15 transition-opacity">
                        <img
                          src={slide.customImage || CAROUSEL_PRESETS[idx % CAROUSEL_PRESETS.length].url}
                          alt="Thumbnail"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      
                      <div className="relative z-10 flex items-center justify-between w-full">
                        <span className={`font-mono text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                          isSelected ? 'bg-emerald-800 text-white' : 'bg-emerald-50 text-emerald-800'
                        }`}>
                          SLOT {idx + 1}
                        </span>
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      </div>
                      
                      <div className="relative z-10 mt-2">
                        <p className="text-[10px] font-black text-emerald-950 truncate leading-tight">
                          {slide.title || 'Untitled Slide'}
                        </p>
                        <p className="text-[8px] font-mono text-emerald-700 truncate mt-0.5">
                          {slide.badge || 'No tag'}
                        </p>
                      </div>
                    </button>
                  );
                } else {
                  return (
                    <button
                      key={`empty-slot-${idx}`}
                      type="button"
                      onClick={handleAddSlide}
                      className="text-center p-3 rounded-xl border border-dashed border-emerald-200 bg-emerald-50/20 hover:bg-emerald-50 hover:border-emerald-400 transition-all flex flex-col items-center justify-center h-[90px] cursor-pointer group"
                    >
                      <Plus size={14} className="text-emerald-600 group-hover:text-emerald-800 transition-colors" />
                      <span className="text-[9px] font-mono font-bold text-emerald-700 uppercase tracking-wider mt-1 block">
                        ACTIVATE SLOT {idx + 1}
                      </span>
                    </button>
                  );
                }
              })}
            </div>

            {/* Active Slot Configuration Dashboard */}
            {slides.length > 0 && slides[selectedSlideIdx] ? (
              (() => {
                const activeSlide = slides[selectedSlideIdx];
                return (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 border-t border-emerald-100">
                    
                    {/* COLUMN 1: LIVE INTERACTIVE PREVIEW SIMULATOR (5 COLS) */}
                    <div className="lg:col-span-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-800 font-bold">
                            Live Simulated Canvas
                          </span>
                        </div>
                        
                        {/* Desktop / Mobile Device preview switches */}
                        <div className="flex items-center gap-1 bg-emerald-50 p-1 rounded-lg border border-emerald-100">
                          <button
                            type="button"
                            onClick={() => setPreviewDeviceMode('desktop')}
                            className={`p-1.5 rounded transition-all cursor-pointer ${
                              previewDeviceMode === 'desktop'
                                ? 'bg-emerald-800 text-white'
                                : 'text-emerald-600 hover:text-emerald-850'
                            }`}
                            title="Simulate PC/Tablet Desktop Layout"
                          >
                            <Monitor size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setPreviewDeviceMode('mobile')}
                            className={`p-1.5 rounded transition-all cursor-pointer ${
                              previewDeviceMode === 'mobile'
                                ? 'bg-emerald-800 text-white'
                                : 'text-emerald-600 hover:text-emerald-850'
                            }`}
                            title="Simulate Mobile Portrait Device"
                          >
                            <Smartphone size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Simulator Stage view */}
                      <div className="bg-emerald-50/20 rounded-2xl border border-emerald-100 p-4 flex items-center justify-center min-h-[280px]">
                        <div
                          className={`relative overflow-hidden rounded-xl bg-cover bg-center border border-neutral-900 shadow-2xl transition-all duration-300 flex flex-col justify-end ${
                            previewDeviceMode === 'desktop'
                              ? 'aspect-[16/10] w-full max-w-md'
                              : 'aspect-[9/16] w-[210px]'
                          }`}
                          style={{
                            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.85)), url(${
                              activeSlide.customImage || CAROUSEL_PRESETS[selectedSlideIdx % CAROUSEL_PRESETS.length].url
                            })`,
                          }}
                        >
                          <div className="p-4 space-y-1 text-white">
                            <span className="bg-amber-400 text-black text-[7px] font-black uppercase px-1 py-0.5 rounded tracking-wider">
                              {activeSlide.badge || 'PROMO BADGE'}
                            </span>
                            <h5 className="text-xs sm:text-sm font-black uppercase tracking-tight text-white leading-tight mt-1">
                              {activeSlide.title || 'ENTER BANNER TITLE'}
                            </h5>
                            <p className="text-[7px] text-gray-300 uppercase font-bold tracking-wider leading-none">
                              {activeSlide.subtitle || 'Enter slide subtitle'}
                            </p>
                            <p className="text-[8px] text-gray-400 line-clamp-2 leading-tight py-0.5">
                              {activeSlide.description || 'Describe the unique retro jersey release or mystery box campaign pack here...'}
                            </p>
                            <div className="pt-1.5 flex items-center justify-between">
                              <span className="inline-block bg-white text-black font-black text-[7px] uppercase px-2 py-1 rounded">
                                SHOP NOW
                              </span>
                              <span className="text-[6px] font-mono text-gray-500 bg-black/60 px-1 py-0.5 rounded">
                                Product: {products.find(p => p.id === activeSlide.productId)?.name || 'Default'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* COLUMN 2: FORMS AND ASSET SELECTORS (7 COLS) */}
                    <div className="lg:col-span-7 space-y-5">
                      
                      {/* Curated Sports Atmosphere Preset Selector */}
                      <div className="space-y-2">
                        <label className="text-[10px] text-emerald-950 font-mono uppercase block font-bold tracking-widest">
                          🌅 CHOOSE ATMOSPHERE GRAPHIC PRESET:
                        </label>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                          {CAROUSEL_PRESETS.map((pSet) => {
                            const isPresetActive = activeSlide.customImage === pSet.url;
                            return (
                              <button
                                key={pSet.name}
                                type="button"
                                onClick={() => handleUpdateSlide({ ...activeSlide, customImage: pSet.url })}
                                className={`group text-center p-1 rounded-lg border transition-all cursor-pointer overflow-hidden relative h-[48px] flex items-center justify-center ${
                                  isPresetActive
                                    ? 'border-emerald-500 bg-emerald-50'
                                    : 'border-emerald-100 hover:border-emerald-200 bg-white'
                                }`}
                                title={`Set background image to ${pSet.name}`}
                              >
                                <img
                                  src={pSet.url}
                                  alt={pSet.name}
                                  className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity"
                                  referrerPolicy="no-referrer"
                                />
                                <span className="relative z-10 text-[8px] font-mono font-black text-emerald-950 leading-none px-1 text-center truncate drop-shadow-md">
                                  {pSet.name}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Custom File Upload Area */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-emerald-700 font-mono uppercase block">Or Upload Custom Banner File:</label>
                        <label className="bg-white hover:bg-emerald-50/50 border border-emerald-100 hover:border-emerald-200 p-3 rounded-xl flex items-center gap-3.5 cursor-pointer transition-all">
                          <div className="w-12 h-12 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {activeSlide.customImage ? (
                              <img
                                src={activeSlide.customImage}
                                alt="Custom Slide"
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <Image size={16} className="text-emerald-600" />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-bold text-emerald-950 uppercase">Upload custom banner image</p>
                            <p className="text-[9px] text-emerald-700 truncate">Tap to pick custom file from your device</p>
                          </div>
                          
                          <span className="bg-emerald-800 text-white font-extrabold text-[9px] uppercase px-2.5 py-1.5 rounded-lg">
                            Upload
                          </span>
                          
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  if (typeof reader.result === 'string') {
                                    handleUpdateSlide({ ...activeSlide, customImage: reader.result });
                                  }
                                };
                                reader.readAsDataURL(e.target.files[0]);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Captions & Texts inputs */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] text-emerald-700 font-mono uppercase block">Slide Badge Tag:</label>
                          <input
                            type="text"
                            value={activeSlide.badge}
                            onChange={(e) => handleUpdateSlide({ ...activeSlide, badge: e.target.value })}
                            className="w-full bg-white border border-emerald-100 rounded-xl py-2 px-3 text-xs text-emerald-950 focus:outline-none focus:border-emerald-500"
                            placeholder="e.g. WORLD CUP EXCLUSIVE"
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <label className="text-[10px] text-emerald-700 font-mono uppercase block">Slide Subtitle:</label>
                          <input
                            type="text"
                            value={activeSlide.subtitle}
                            onChange={(e) => handleUpdateSlide({ ...activeSlide, subtitle: e.target.value })}
                            className="w-full bg-white border border-emerald-100 rounded-xl py-2 px-3 text-xs text-emerald-950 focus:outline-none focus:border-emerald-500"
                            placeholder="e.g. Rare Historic Reissues"
                          />
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-[10px] text-emerald-700 font-mono uppercase block">Slide Title:</label>
                          <input
                            type="text"
                            value={activeSlide.title}
                            onChange={(e) => handleUpdateSlide({ ...activeSlide, title: e.target.value })}
                            className="w-full bg-white border border-emerald-100 rounded-xl py-2 px-3 text-xs text-emerald-950 focus:outline-none focus:border-emerald-500"
                            placeholder="e.g. THE 1998 FRANCE VAULT"
                          />
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-[10px] text-emerald-700 font-mono uppercase block">Slide Description:</label>
                          <textarea
                            rows={2}
                            value={activeSlide.description}
                            onChange={(e) => handleUpdateSlide({ ...activeSlide, description: e.target.value })}
                            className="w-full bg-white border border-emerald-100 rounded-xl py-2 px-3 text-xs text-emerald-950 focus:outline-none focus:border-emerald-500"
                            placeholder="Provide descriptive copy about the capsule/jerseys featured."
                          />
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-[10px] text-emerald-700 font-mono uppercase block">Target Product Destination:</label>
                          <select
                            value={activeSlide.productId}
                            onChange={(e) => handleUpdateSlide({ ...activeSlide, productId: e.target.value })}
                            className="w-full bg-white border border-emerald-100 rounded-xl py-2.5 px-3.5 text-xs text-emerald-950 focus:outline-none focus:border-emerald-500"
                          >
                            {products.map((p) => (
                              <option key={p.id} value={p.id} className="bg-white text-emerald-950">
                                {p.name} (${p.price})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Slide Ordering Toolbar and delete */}
                      <div className="flex items-center justify-between pt-3 border-t border-emerald-100">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => moveSlide(selectedSlideIdx, 'left')}
                            disabled={selectedSlideIdx === 0}
                            className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 disabled:opacity-30 disabled:pointer-events-none p-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono"
                          >
                            <ChevronLeft size={14} /> Move Left
                          </button>
                          <button
                            type="button"
                            onClick={() => moveSlide(selectedSlideIdx, 'right')}
                            disabled={selectedSlideIdx === slides.length - 1}
                            className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 disabled:opacity-30 disabled:pointer-events-none p-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono"
                          >
                            Move Right <ChevronRight size={14} />
                          </button>
                        </div>

                        {slides.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleDeleteSlide(activeSlide.id)}
                            className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs uppercase font-mono font-bold"
                          >
                            <Trash2 size={13} /> Delete Slide Slot
                          </button>
                        )}
                      </div>

                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="text-center py-10 bg-emerald-50/20 rounded-2xl border border-emerald-100 border-dashed">
                <AlertTriangle className="text-emerald-800 h-8 w-8 mx-auto mb-2" />
                <p className="text-xs font-bold text-emerald-950 uppercase font-mono">No Slider Banners Active</p>
                <p className="text-[10px] text-emerald-700 font-mono mt-1">Please add or load default slides above to begin customization.</p>
              </div>
            )}

          </div>
        </div>
      )}

      {activeTab === 'coupons' && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-sm font-bold uppercase text-emerald-950">Dynamic Promo Coupon Generator</h3>
            <p className="text-[10px] text-emerald-800 font-mono">Generate system codes with instant mathematical validation during checkouts</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Create Coupon form */}
            <form onSubmit={handleCreateCoupon} className="lg:col-span-5 bg-emerald-50/40 border border-emerald-100 p-6 rounded-2xl space-y-4">
              <h4 className="text-xs font-mono font-black text-emerald-950 uppercase tracking-widest border-b border-emerald-100 pb-2">
                Generate Campaign Code
              </h4>
              
              <div className="space-y-1.5">
                <label className="text-[10px] text-emerald-700 font-mono">COUPON CODE (UPPERCASE):</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUMMER26"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                  className="w-full bg-white border border-emerald-100 rounded-xl py-2.5 px-4 text-xs font-mono text-emerald-950 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-emerald-700 font-mono">DISCOUNT VALUE (%):</label>
                <input
                  type="number"
                  required
                  min={5}
                  max={50}
                  value={newCouponDiscount}
                  onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                  className="w-full bg-white border border-emerald-100 rounded-xl py-2.5 px-4 text-xs font-mono text-emerald-950 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-widest py-3 rounded-xl cursor-pointer"
              >
                + Inject Code Into Server
              </button>
            </form>

            {/* List of active codes */}
            <div className="lg:col-span-7 bg-emerald-50/40 border border-emerald-100 p-6 rounded-2xl space-y-4">
              <h4 className="text-xs font-mono font-black text-emerald-950 uppercase tracking-widest border-b border-emerald-100 pb-2">
                Active Code Databases
              </h4>
              <div className="space-y-3">
                {coupons.map((c) => (
                  <div
                    key={c.code}
                    className="bg-white border border-emerald-100 p-4 rounded-xl flex justify-between items-center"
                  >
                    <div>
                      <p className="text-sm font-bold font-mono text-emerald-800">{c.code}</p>
                      <p className="text-[10px] text-emerald-700 font-mono">Saves {c.discount}% discount • Limit {c.limit} users</p>
                    </div>
                    <span className="bg-emerald-50 text-emerald-800 text-[10px] font-mono px-3 py-1 rounded font-bold border border-emerald-200/60">
                      ✓ ENCRYPTED ACTIVE
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ROUTE BRAND CUSTOMIZER & THEME EDITOR */}
      {activeTab === 'brand-customizer' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Header Description */}
          <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl">
            <h3 className="text-lg font-black uppercase text-emerald-950">Bangladesh Theme & Brand Customizer Desk</h3>
            <p className="text-xs text-emerald-800 font-mono mt-1">
              Command Center calibrated for Bangladeshi retail outlets. Edit live branding logos, inject custom pricing rates, select regional color palettes, and configure custom footer footprints in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Col: Configurations */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Brand Logo & Currency Calibration */}
              <div className="bg-emerald-50/40 border border-emerald-100 p-6 rounded-2xl space-y-4">
                <h4 className="text-xs font-mono font-black text-emerald-950 uppercase tracking-widest border-b border-emerald-100 pb-2">
                  Brand Logo & Currency Setup
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-emerald-700 block">LOGO BRAND TEXT</label>
                    <input
                      type="text"
                      value={appConfig.logoText}
                      onChange={(e) => onUpdateConfig({ ...appConfig, logoText: e.target.value })}
                      className="w-full bg-white border border-emerald-100 rounded-xl py-2.5 px-4 text-xs font-bold text-emerald-950 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-emerald-700 block">LOGO SUBTEXT / OUTLET</label>
                    <input
                      type="text"
                      value={appConfig.logoSubtext}
                      onChange={(e) => onUpdateConfig({ ...appConfig, logoSubtext: e.target.value })}
                      className="w-full bg-white border border-emerald-100 rounded-xl py-2.5 px-4 text-xs font-bold text-emerald-950 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-emerald-700 block">CURRENCY SYMBOL</label>
                    <input
                      type="text"
                      value={appConfig.currencySymbol}
                      onChange={(e) => onUpdateConfig({ ...appConfig, currencySymbol: e.target.value })}
                      className="w-full bg-white border border-emerald-100 rounded-xl py-2.5 px-4 text-xs font-bold text-emerald-950 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-emerald-700 block">CURRENCY CODE</label>
                    <input
                      type="text"
                      value={appConfig.currencyCode}
                      onChange={(e) => onUpdateConfig({ ...appConfig, currencyCode: e.target.value })}
                      className="w-full bg-white border border-emerald-100 rounded-xl py-2.5 px-4 text-xs font-bold text-emerald-950 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-emerald-700 block">EXCHANGE RATE ($1 USD to BDT)</label>
                    <input
                      type="number"
                      value={appConfig.exchangeRate}
                      onChange={(e) => onUpdateConfig({ ...appConfig, exchangeRate: Number(e.target.value) })}
                      className="w-full bg-white border border-emerald-100 rounded-xl py-2.5 px-4 text-xs font-bold text-emerald-950 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
                <p className="text-[10px] font-mono text-emerald-800 font-medium">
                  ⚡ Calibrated to Bangladesh: Standard products will multiply USD prices by {appConfig.exchangeRate} in real-time, displaying them with the "{appConfig.currencySymbol}" symbol.
                </p>
              </div>

              {/* Theme Preset Selector */}
              <div className="bg-emerald-50/40 border border-emerald-100 p-6 rounded-2xl space-y-4">
                <h4 className="text-xs font-mono font-black text-emerald-950 uppercase tracking-widest border-b border-emerald-100 pb-2">
                  Select Visual Theme Preset
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Theme 1 */}
                  <button
                    onClick={() => onUpdateConfig({ ...appConfig, theme: 'classic' })}
                    className={`p-4 rounded-xl text-left border transition-all ${
                      appConfig.theme === 'classic'
                        ? 'bg-emerald-100/60 border-emerald-500 shadow-sm'
                        : 'bg-white border-emerald-100 hover:border-emerald-200'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-emerald-950">Classic Emerald Vault</span>
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                    </div>
                    <p className="text-[10px] text-emerald-800 leading-normal">
                      Curated light forest green layout paired with rich emerald details and golden text elements.
                    </p>
                  </button>

                  {/* Theme 2 */}
                  <button
                    onClick={() => onUpdateConfig({ ...appConfig, theme: 'crimson' })}
                    className={`p-4 rounded-xl text-left border transition-all ${
                      appConfig.theme === 'crimson'
                        ? 'bg-red-50 border-red-500 shadow-sm'
                        : 'bg-white border-emerald-100 hover:border-emerald-200'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-emerald-950">Crimson Bengal Pride</span>
                      <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                    </div>
                    <p className="text-[10px] text-emerald-800 leading-normal">
                      Deep crimson watermarks and warm brick red accents. Inspired directly by the Bengal flag.
                    </p>
                  </button>

                  {/* Theme 3 */}
                  <button
                    onClick={() => onUpdateConfig({ ...appConfig, theme: 'royal' })}
                    className={`p-4 rounded-xl text-left border transition-all ${
                      appConfig.theme === 'royal'
                        ? 'bg-blue-50 border-blue-500 shadow-sm'
                        : 'bg-white border-emerald-100 hover:border-emerald-200'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-emerald-950">Royal Prestige Blue</span>
                      <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                    </div>
                    <p className="text-[10px] text-emerald-800 leading-normal">
                      Luxury premium blue watermarks with deep gold borders. Evokes historical elegance.
                    </p>
                  </button>

                  {/* Theme 4 */}
                  <button
                    onClick={() => onUpdateConfig({ ...appConfig, theme: 'bengal' })}
                    className={`p-4 rounded-xl text-left border transition-all ${
                      appConfig.theme === 'bengal'
                        ? 'bg-amber-50 border-amber-500 shadow-sm'
                        : 'bg-white border-emerald-100 hover:border-emerald-200'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-emerald-950">Royal Bengal Tiger</span>
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                    </div>
                    <p className="text-[10px] text-emerald-800 leading-normal">
                      Coal-black layouts and fierce tiger-orange tags. Represents Dhaka curated athletic gear.
                    </p>
                  </button>
                </div>
              </div>

              {/* Footer Customizer Form */}
              <div className="bg-emerald-50/40 border border-emerald-100 p-6 rounded-2xl space-y-4">
                <h4 className="text-xs font-mono font-black text-emerald-950 uppercase tracking-widest border-b border-emerald-100 pb-2">
                  Footer Editorial Customizer
                </h4>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-emerald-700 block">FOOTER ABOUT TEXT</label>
                  <textarea
                    rows={3}
                    value={appConfig.footerAbout}
                    onChange={(e) => onUpdateConfig({ ...appConfig, footerAbout: e.target.value })}
                    className="w-full bg-white border border-emerald-100 rounded-xl py-2.5 px-4 text-xs font-sans text-emerald-950 focus:outline-none focus:border-emerald-500 leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-emerald-700 block">DHAKA HQ ADDRESS</label>
                    <input
                      type="text"
                      value={appConfig.footerLocations[0]?.address || ''}
                      onChange={(e) => {
                        const copy = [...appConfig.footerLocations];
                        copy[0] = { ...copy[0], address: e.target.value };
                        onUpdateConfig({ ...appConfig, footerLocations: copy });
                      }}
                      className="w-full bg-white border border-emerald-100 rounded-xl py-2.5 px-4 text-xs text-emerald-950 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-emerald-700 block">DHAKA HQ PHONE</label>
                    <input
                      type="text"
                      value={appConfig.footerLocations[0]?.phone || ''}
                      onChange={(e) => {
                        const copy = [...appConfig.footerLocations];
                        copy[0] = { ...copy[0], phone: e.target.value };
                        onUpdateConfig({ ...appConfig, footerLocations: copy });
                      }}
                      className="w-full bg-white border border-emerald-100 rounded-xl py-2.5 px-4 text-xs text-emerald-950 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-emerald-700 block">TRADEMARK / COPYRIGHT FOOTNOTE</label>
                  <input
                    type="text"
                    value={appConfig.footerCopyright}
                    onChange={(e) => onUpdateConfig({ ...appConfig, footerCopyright: e.target.value })}
                    className="w-full bg-white border border-emerald-100 rounded-xl py-2.5 px-4 text-xs text-emerald-950 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

            </div>

            {/* Right Col: Secure Staff Sessions & Stock Adding */}
            <div className="lg:col-span-5 space-y-8">
              
              {/* Secure Authorized Staff Sessions */}
              <div className="bg-emerald-50/40 border border-emerald-100 p-6 rounded-2xl space-y-4">
                <div className="flex justify-between items-center border-b border-emerald-100 pb-2">
                  <h4 className="text-xs font-mono font-black text-emerald-950 uppercase tracking-widest">
                    Authorized Staff Sessions
                  </h4>
                  <span className="bg-emerald-100 text-emerald-800 font-mono text-[9px] px-2 py-0.5 rounded border border-emerald-200/60 animate-pulse">
                    SECURE ACCESS
                  </span>
                </div>

                <p className="text-[11px] text-emerald-800 leading-normal">
                  You are currently managing the vault via authenticated administrator credentials. Access sessions are audited under regional regulations.
                </p>

                <div className="space-y-3">
                  {[
                    { name: 'Kazi Yasin Ahmed (Dhaka HQ)', status: 'ACTIVE SESSION', loc: 'Dhaka, Bangladesh', active: true },
                    { name: 'Bailey Road Staff Terminal', status: 'STANDBY', loc: 'Dhaka, Bangladesh', active: false },
                    { name: 'International Curators (Gattuso)', status: 'STANDBY', loc: 'Milan, Italy', active: false }
                  ].map((sessionUser) => (
                    <div
                      key={sessionUser.name}
                      className={`p-3 rounded-xl border flex justify-between items-center transition-all ${
                        sessionUser.active
                          ? 'bg-emerald-100 border-emerald-300 text-emerald-950 font-bold'
                          : 'bg-white border-emerald-100 text-emerald-700'
                      }`}
                    >
                      <div>
                        <p className="text-[11px] font-bold">{sessionUser.name}</p>
                        <p className="text-[10px] text-emerald-600 font-mono font-medium">📍 {sessionUser.loc}</p>
                      </div>
                      <span className={`text-[9px] font-mono font-bold ${sessionUser.active ? 'text-emerald-800' : 'text-emerald-600'}`}>
                        {sessionUser.status}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="bg-white p-3 rounded-xl border border-emerald-100 font-mono text-[10px] text-emerald-700 space-y-1">
                  <p>✔ SESSION STATUS: AUTHORIZED</p>
                  <p>✔ GATEWAY: Bailey Road, Dhaka 1217</p>
                  <p>✔ REGION: Dhaka Division</p>
                </div>
              </div>

              {/* Stock Stock Adding Form */}
              <div className="bg-emerald-50/40 border border-emerald-100 p-6 rounded-2xl space-y-4">
                <h4 className="text-xs font-mono font-black text-emerald-950 uppercase tracking-widest border-b border-emerald-100 pb-2">
                  + Add New Stock To Bangladesh Catalog
                </h4>
                
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const nameInput = form.elements.namedItem('shirt_name') as HTMLInputElement;
                    const brandInput = form.elements.namedItem('shirt_brand') as HTMLInputElement;
                    const priceInput = form.elements.namedItem('shirt_price') as HTMLInputElement;
                    const stockInput = form.elements.namedItem('shirt_stock') as HTMLInputElement;
                    const categoryInput = form.elements.namedItem('shirt_category') as HTMLSelectElement;

                    if (!nameInput.value || !brandInput.value || !priceInput.value) {
                      alert('Please fill out all required fields');
                      return;
                    }

                    const newId = `shirt-custom-${Date.now()}`;
                    const bdtPrice = Number(priceInput.value);
                    const usdPrice = Math.round(bdtPrice / appConfig.exchangeRate);

                    const newProd: Product = {
                      id: newId,
                      name: nameInput.value,
                      slug: nameInput.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                      price: usdPrice,
                      originalPrice: usdPrice + 30,
                      image: 'shirt-custom',
                      images: [],
                      brand: brandInput.value,
                      season: '2025/2026',
                      year: 2026,
                      condition: 'Mint',
                      conditionDetail: 'Sourced from local archives in perfect collectible condition.',
                      color: 'Green/Red',
                      sizes: ['S', 'M', 'L', 'XL'],
                      sku: `BD-SKU-${Math.floor(100000 + Math.random() * 900000)}`,
                      badgeAvailable: true,
                      printAvailable: true,
                      rating: 5.0,
                      reviewsCount: 1,
                      description: 'Special customized vintage retro jersey added to the Dhaka Football Vault system.',
                      specification: {
                        material: '100% Polyester Mesh',
                        madeIn: 'Bangladesh',
                        fit: 'Aero Athlete Standard'
                      },
                      category: categoryInput.value as any,
                      stock: Number(stockInput.value) || 10,
                      isFeatured: true,
                      uploadedImage: quickAddImage || undefined,
                    };

                    setProducts((prev) => {
                      const updated = [newProd, ...prev];
                      localStorage.setItem('vault_custom_products', JSON.stringify(updated));
                      return updated;
                    });

                    form.reset();
                    setQuickAddImage('');
                    alert(`Successfully added "${newProd.name}" to Bangladesh stock at ${appConfig.currencySymbol}${bdtPrice}!`);
                  }}
                  className="space-y-3"
                >
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-emerald-700 block">JERSEY CATALOG NAME *</label>
                    <input
                      name="shirt_name"
                      required
                      placeholder="e.g. Bangladesh 1999 World Cup Vintage"
                      className="w-full bg-white border border-emerald-100 rounded-xl py-2.5 px-4 text-xs text-emerald-950 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-emerald-700 block">BRAND (ADIDAS/NIKE) *</label>
                      <input
                        name="shirt_brand"
                        required
                        placeholder="e.g. Adidas"
                        className="w-full bg-white border border-emerald-100 rounded-xl py-2.5 px-4 text-xs text-emerald-950 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-emerald-700 block">CATEGORY</label>
                      <select
                        name="shirt_category"
                        className="w-full bg-white border border-emerald-100 rounded-xl py-2.5 px-4 text-xs text-emerald-950 focus:outline-none focus:border-emerald-500"
                      >
                        <option value="World Cup">World Cup Vault</option>
                        <option value="Classic">Classic Vintage</option>
                        <option value="Current Season">Current Season</option>
                        <option value="Legends">Legends Tribute</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-emerald-700 block">PRICE IN BANGLADESH TAKA (৳) *</label>
                      <input
                        name="shirt_price"
                        type="number"
                        required
                        placeholder="e.g. 5500"
                        className="w-full bg-white border border-emerald-100 rounded-xl py-2.5 px-4 text-xs text-emerald-950 focus:outline-none focus:border-emerald-500 font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-emerald-700 block">INITIAL INVENTORY STOCK *</label>
                      <input
                        name="shirt_stock"
                        type="number"
                        required
                        placeholder="e.g. 15"
                        className="w-full bg-white border border-emerald-100 rounded-xl py-2.5 px-4 text-xs text-emerald-950 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Mobile-optimized touch image upload trigger */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-emerald-700 block uppercase font-bold">Jersey Photo (Optional):</label>
                    <label className="flex items-center gap-3.5 bg-white hover:bg-emerald-50/50 border border-emerald-100 hover:border-emerald-200 p-3 rounded-xl cursor-pointer transition-all group">
                      <div className="w-11 h-11 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform">
                        {quickAddImage ? (
                          <img
                            src={quickAddImage}
                            alt="Quick add preview"
                            className="w-full h-full object-contain filter drop-shadow"
                          />
                        ) : (
                          <Image size={15} className="text-emerald-700 group-hover:text-emerald-600 transition-colors" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="bg-emerald-800 text-white group-hover:bg-emerald-700 border border-emerald-600 text-[9px] font-extrabold uppercase px-3 py-1.5 rounded-lg transition-all inline-flex items-center gap-1">
                          <Upload size={9} />
                          Browse Photo
                        </div>
                        {quickAddImage ? (
                          <span className="text-[9px] text-emerald-800 font-mono block mt-0.5 truncate">✓ Photo loaded</span>
                        ) : (
                          <span className="text-[9px] text-emerald-700 font-mono block mt-0.5">JPEG/PNG max 2MB</span>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 2 * 1024 * 1024) {
                              alert('File is too large! Maximum limit is 2MB.');
                              return;
                            }
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              if (typeof reader.result === 'string') {
                                setQuickAddImage(reader.result);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                    {quickAddImage && (
                      <button
                        type="button"
                        onClick={() => setQuickAddImage('')}
                        className="text-[9px] text-red-600 hover:text-red-700 hover:underline font-mono block mt-1"
                      >
                        ✕ Remove Selected Photo
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-widest py-3 rounded-xl transition-all cursor-pointer shadow-sm mt-2"
                  >
                    + Add Jersey to Dhaka Stock
                  </button>
                </form>
              </div>

            </div>
          </div>
        </div>
      )}

    </section>
  );
};
