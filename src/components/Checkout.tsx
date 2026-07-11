import React, { useState } from 'react';
import { ShieldCheck, ArrowLeft, Truck, ClipboardCheck, Sparkles, AlertCircle, MapPin, Phone, CheckCircle, Info, Home, Briefcase, User, Save } from 'lucide-react';
import { CartItem, Order, AppConfig } from '../types';

interface CheckoutProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  onOrderSuccess: (order: Order) => void;
  onBackToCart: () => void;
  onBackToCatalog: () => void;
  formatPrice: (amount: number) => string;
  appConfig: AppConfig;
}

export const Checkout: React.FC<CheckoutProps> = ({
  cart,
  setCart,
  onOrderSuccess,
  onBackToCart,
  onBackToCatalog,
  formatPrice,
  appConfig,
}) => {
  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [city, setCity] = useState(appConfig.logoSubtext?.includes('DHAKA') ? 'Dhaka' : '');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');
  
  // Delivery Region (Inside Dhaka: 70 TK, Outside Dhaka: 130 TK)
  const [deliveryRegion, setDeliveryRegion] = useState<'inside' | 'outside'>('inside');

  // Saved Shipping Coordinates for One-Click suggest
  const [savedAddresses, setSavedAddresses] = useState(() => {
    const stored = localStorage.getItem('vault_shipping_addresses');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        // Fallback
      }
    }
    return [
      {
        id: 'addr-1',
        label: 'Home',
        fullName: 'Yasin Ahmed',
        addressLine1: 'Flat 4B, House 12, Road 5, Sector 4, Uttara',
        city: 'Dhaka',
        postalCode: '1230',
        country: 'Bangladesh',
        phone: '01840990700',
        isDefault: true,
      },
      {
        id: 'addr-2',
        label: 'Office',
        fullName: 'Yasin Ahmed',
        addressLine1: 'Level 8, Crystal Palace, SE(F) 22 Road 140, Gulshan 1',
        city: 'Dhaka',
        postalCode: '1212',
        country: 'Bangladesh',
        phone: '01840990701',
        isDefault: false,
      },
    ];
  });

  const [saveThisAddress, setSaveThisAddress] = useState(false);
  const [saveLabel, setSaveLabel] = useState<'Home' | 'Office' | 'Visitor'>('Home');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  const handleSelectAddress = (addr: any) => {
    setFullName(addr.fullName);
    setAddressLine1(addr.addressLine1);
    setCity(addr.city || 'Dhaka');
    setPostalCode(addr.postalCode || '');
    setPhone(addr.phone);
    if (addr.city && addr.city.toLowerCase().includes('dhaka')) {
      setDeliveryRegion('inside');
    } else {
      setDeliveryRegion('outside');
    }
  };

  const handleSaveCurrentAddress = () => {
    if (!fullName || !addressLine1 || !phone) {
      alert('Please fill out Recipient Full Name, Address, and Phone first before saving.');
      return;
    }
    const newAddr = {
      id: `addr-${Date.now()}`,
      label: saveLabel,
      fullName,
      addressLine1,
      city: city || 'Dhaka',
      postalCode: postalCode || '',
      country: 'Bangladesh',
      phone,
      isDefault: savedAddresses.length === 0,
    };
    const updated = [...savedAddresses, newAddr];
    setSavedAddresses(updated);
    localStorage.setItem('vault_shipping_addresses', JSON.stringify(updated));
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 3000);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  
  // Delivery Charge in BDT
  const deliveryChargeBDT = deliveryRegion === 'inside' ? 70 : 130;
  
  // Convert BDT charge to base currency (USD) using the active exchangeRate
  const exchangeRate = appConfig.exchangeRate || 115;
  const shippingCostBase = deliveryChargeBDT / exchangeRate;
  
  // Grand total in base currency (USD)
  const grandTotal = subtotal + shippingCostBase;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !addressLine1 || !phone) {
      alert('Please fill out all the required fields for secure delivery.');
      return;
    }

    if (phone.length < 10) {
      alert('Please enter a valid active phone number.');
      return;
    }

    // Create a robust local Order object with CASH ON DELIVERY paymentMethod
    const trackingID = `CFJ-COD-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      items: [...cart],
      subtotal,
      tax: 0,
      shipping: shippingCostBase,
      total: grandTotal,
      status: 'Processing',
      trackingNumber: trackingID,
      shippingAddress: {
        fullName,
        addressLine1,
        city: city || (deliveryRegion === 'inside' ? 'Dhaka' : 'Outside Dhaka'),
        postalCode: postalCode || 'N/A',
        country: 'Bangladesh',
        phone,
      },
      paymentMethod: 'CASH ON DELIVERY',
    };

    if (saveThisAddress) {
      const isDuplicate = savedAddresses.some(
        (a: any) => a.addressLine1.toLowerCase().trim() === addressLine1.toLowerCase().trim()
      );
      if (!isDuplicate) {
        const newAddr = {
          id: `addr-${Date.now()}`,
          label: saveLabel,
          fullName,
          addressLine1,
          city: city || 'Dhaka',
          postalCode: postalCode || 'N/A',
          country: 'Bangladesh',
          phone,
          isDefault: savedAddresses.length === 0,
        };
        const updated = [...savedAddresses, newAddr];
        localStorage.setItem('vault_shipping_addresses', JSON.stringify(updated));
      }
    }

    onOrderSuccess(newOrder);
    setCart([]); // Clear the shopping cart
  };

  return (
    <section className="bg-white text-emerald-950 py-8 px-4 md:px-12 max-w-7xl mx-auto min-h-screen">
      
      {/* Navigation Back Link */}
      <button
        onClick={onBackToCart}
        className="inline-flex items-center gap-2 text-[10px] md:text-xs font-mono font-bold tracking-wider text-emerald-850 hover:text-emerald-950 uppercase mb-6 cursor-pointer transition-all"
        id="checkout-back-to-cart"
      >
        <ArrowLeft size={14} /> Back to Cart
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form & Options */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-6">
          
          {/* Header Title */}
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-emerald-950 font-display">
              Place Cash on Delivery Order
            </h1>
            <p className="text-xs text-emerald-700 font-mono">
              Fill in your active address and phone number. No advance payment required!
            </p>
          </div>

          {/* Section 1: Personal Contact Details */}
          <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-4 md:p-6 space-y-4 shadow-xl text-emerald-950">
            <h3 className="text-xs md:text-sm font-mono font-black text-emerald-850 uppercase tracking-widest border-b border-emerald-100 pb-2.5 flex items-center gap-2">
              <ClipboardCheck size={16} className="text-emerald-700" /> 1. Contact Information
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-emerald-600 font-mono block">RECIPIENT FULL NAME *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Yasin Ahmed"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white border border-emerald-100 focus:border-emerald-500 rounded-xl py-3 px-4 text-xs focus:outline-none transition-colors text-emerald-950 placeholder-emerald-300"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-emerald-850 font-mono block font-bold">MOBILE PHONE NUMBER *</label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 01840990700"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white border border-emerald-150 focus:border-emerald-500 rounded-xl py-3 px-4 text-xs focus:outline-none transition-colors font-mono font-bold text-emerald-800"
                  />
                </div>
                <span className="text-[9px] text-emerald-600 font-mono block">We will call this number before delivery to verify.</span>
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <label className="text-[10px] text-emerald-600 font-mono block">EMAIL ADDRESS (OPTIONAL)</label>
              <input
                type="email"
                placeholder="e.g. collector@vault.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-emerald-100 focus:border-emerald-500 rounded-xl py-3 px-4 text-xs focus:outline-none transition-colors text-emerald-950 placeholder-emerald-300"
              />
            </div>
          </div>

          {/* Section 2: Delivery Address Details */}
          <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-4 md:p-6 space-y-4 shadow-xl text-emerald-950">
            <h3 className="text-xs md:text-sm font-mono font-black text-emerald-850 uppercase tracking-widest border-b border-emerald-100 pb-2.5 flex items-center gap-2">
              <MapPin size={16} className="text-emerald-700" /> 2. Delivery Address
            </h3>

            {/* SAVED ADDRESSES QUICK SUGGESTIONS GRID */}
            {savedAddresses.length > 0 && (
              <div className="bg-emerald-50/60 border border-emerald-100/60 p-4 rounded-xl space-y-2.5">
                <span className="text-[10px] text-emerald-800 font-mono font-black uppercase tracking-wider block flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" /> 
                  ONE-CLICK SUGGESTIONS (SAVED ADDRESSES):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {savedAddresses.map((addr: any) => (
                    <button
                      type="button"
                      key={addr.id}
                      onClick={() => handleSelectAddress(addr)}
                      className="text-left bg-white hover:bg-emerald-50 border border-emerald-100 hover:border-emerald-300 p-3 rounded-lg text-xs transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div className="flex justify-between items-center gap-2 mb-1.5">
                        <span className="bg-emerald-100 text-emerald-800 text-[9px] font-mono px-2 py-0.5 rounded uppercase font-bold border border-emerald-200">
                          {addr.label}
                        </span>
                        {addr.isDefault && (
                          <span className="text-emerald-800 font-mono text-[8px] font-bold">PRIMARY</span>
                        )}
                      </div>
                      <p className="font-bold text-emerald-950 truncate">{addr.fullName}</p>
                      <p className="text-emerald-800 text-[10px] truncate leading-tight">{addr.addressLine1}</p>
                      <p className="text-[10px] font-mono text-emerald-600 mt-1">Phone: {addr.phone}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] text-emerald-600 font-mono block">FULL DETAILED ADDRESS (House, Flat, Road, Area) *</label>
              <textarea
                required
                rows={3}
                placeholder="e.g. Flat 4B, House 12, Road 5, Sector 4, Uttara, Dhaka"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                className="w-full bg-white border border-emerald-100 focus:border-emerald-500 rounded-xl py-3 px-4 text-xs focus:outline-none transition-colors resize-none leading-relaxed text-emerald-950 placeholder-emerald-300"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-emerald-600 font-mono block">CITY / DISTRICT</label>
                <input
                  type="text"
                  placeholder="e.g. Dhaka"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-white border border-emerald-100 focus:border-emerald-500 rounded-xl py-3 px-4 text-xs focus:outline-none transition-colors text-emerald-950 placeholder-emerald-300"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-emerald-600 font-mono block">POSTAL CODE (OPTIONAL)</label>
                <input
                  type="text"
                  placeholder="e.g. 1230"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full bg-white border border-emerald-100 focus:border-emerald-500 rounded-xl py-3 px-4 text-xs focus:outline-none transition-colors font-mono text-emerald-950 placeholder-emerald-300"
                />
              </div>
            </div>

            {/* OPTION TO SAVE CURRENT ADDRESS */}
            <div className="bg-emerald-50/60 border border-emerald-100 p-4 rounded-xl space-y-3 mt-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="checkoutSaveThisAddress"
                  checked={saveThisAddress}
                  onChange={(e) => setSaveThisAddress(e.target.checked)}
                  className="w-3.5 h-3.5 accent-emerald-600 bg-white rounded border-emerald-200 cursor-pointer"
                />
                <label htmlFor="checkoutSaveThisAddress" className="text-[11px] text-emerald-950 font-bold cursor-pointer select-none">
                  Save this address for future checkout suggestions
                </label>
              </div>

              <div className="space-y-3 pl-5 sm:pl-6 border-l border-emerald-100 transition-all">
                <div className="space-y-1.5">
                  <span className="text-[10px] text-emerald-600 font-mono block uppercase">ADDRESS LABEL:</span>
                  <div className="flex gap-2">
                    {['Home', 'Office', 'Visitor'].map((lbl) => {
                      const isSelected = saveLabel === lbl;
                      return (
                        <button
                          type="button"
                          key={lbl}
                          onClick={() => setSaveLabel(lbl as any)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-800 text-white border-emerald-800'
                              : 'bg-white border-emerald-100 text-emerald-800 hover:border-emerald-300'
                          }`}
                        >
                          {lbl}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={handleSaveCurrentAddress}
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 hover:text-emerald-950 font-extrabold text-[9px] uppercase tracking-wider px-3.5 py-1.5 rounded-lg border border-emerald-200 transition-all cursor-pointer inline-flex items-center gap-1"
                  >
                    <Save size={10} /> Save Coordinate Now
                  </button>
                  {saveSuccessMsg && (
                    <span className="text-[10px] text-emerald-700 font-mono animate-fadeIn">✓ Saved successfully</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Localization Shipping Cost Selection */}
          <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-4 md:p-6 space-y-4 shadow-xl text-emerald-950">
            <h3 className="text-xs md:text-sm font-mono font-black text-emerald-850 uppercase tracking-widest border-b border-emerald-100 pb-2.5 flex items-center gap-2">
              <Truck size={16} className="text-emerald-700" /> 3. Select Delivery Area
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Inside Dhaka Area */}
              <div
                onClick={() => setDeliveryRegion('inside')}
                className={`p-4 rounded-xl border-2 cursor-pointer flex justify-between items-center transition-all ${
                  deliveryRegion === 'inside'
                    ? 'bg-emerald-50/50 border-emerald-600 text-emerald-950 shadow-lg shadow-emerald-600/5'
                    : 'bg-white border-emerald-100 text-emerald-800 hover:border-emerald-300'
                }`}
                id="shipping-inside-dhaka"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-3 h-3 rounded-full border flex items-center justify-center ${deliveryRegion === 'inside' ? 'border-emerald-600' : 'border-emerald-300'}`}>
                      {deliveryRegion === 'inside' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />}
                    </span>
                    <p className="text-xs font-black uppercase tracking-wider text-emerald-950">Inside Dhaka</p>
                  </div>
                  <p className="text-[10px] text-emerald-800 leading-normal">Fast doorstep delivery within 24-48 hours inside capital limits.</p>
                </div>
                <div className="text-right flex-shrink-0 pl-2">
                  <span className="text-sm font-mono font-black text-emerald-800">৳70</span>
                  <p className="text-[9px] text-emerald-600 font-mono">fee</p>
                </div>
              </div>

              {/* Outside Dhaka Area */}
              <div
                onClick={() => setDeliveryRegion('outside')}
                className={`p-4 rounded-xl border-2 cursor-pointer flex justify-between items-center transition-all ${
                  deliveryRegion === 'outside'
                    ? 'bg-emerald-50/50 border-emerald-600 text-emerald-950 shadow-lg shadow-emerald-600/5'
                    : 'bg-white border-emerald-100 text-emerald-800 hover:border-emerald-300'
                }`}
                id="shipping-outside-dhaka"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-3 h-3 rounded-full border flex items-center justify-center ${deliveryRegion === 'outside' ? 'border-emerald-600' : 'border-emerald-300'}`}>
                      {deliveryRegion === 'outside' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />}
                    </span>
                    <p className="text-xs font-black uppercase tracking-wider text-emerald-950">Outside Dhaka</p>
                  </div>
                  <p className="text-[10px] text-emerald-800 leading-normal">Standard courier service to all districts across Bangladesh (2-4 days).</p>
                </div>
                <div className="text-right flex-shrink-0 pl-2">
                  <span className="text-sm font-mono font-black text-emerald-800">৳130</span>
                  <p className="text-[9px] text-emerald-600 font-mono">fee</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Pure Cash on Delivery Payment Option */}
          <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-4 md:p-6 space-y-4 shadow-xl text-emerald-950">
            <h3 className="text-xs md:text-sm font-mono font-black text-emerald-850 uppercase tracking-widest border-b border-emerald-100 pb-2.5 flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-700" /> 4. Order Verification
            </h3>

            <div className="bg-white border border-emerald-100 rounded-xl p-4 flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 flex-shrink-0 mt-0.5">
                <CheckCircle size={18} />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wider">CASH ON DELIVERY (COD) SELECTED</h4>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  You will pay the full amount of <span className="text-emerald-800 font-bold font-mono">{formatPrice(grandTotal)}</span> directly to the delivery agent in cash when they bring the jersey package to your door. There are no advanced card charges.
                </p>
              </div>
            </div>
          </div>

          {/* Place Order CTA Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-extrabold text-xs md:text-sm uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/10 active:scale-[0.99] transition-all"
            id="checkout-submit-btn"
          >
            <ShieldCheck size={16} /> Place Cash on Delivery Order ({formatPrice(grandTotal)})
          </button>

        </form>

        {/* Right Column: Mini Sticky Order Summary */}
        <div className="lg:col-span-4 bg-emerald-50/40 border border-emerald-100 rounded-2xl p-4 md:p-6 space-y-5 sticky top-28 text-emerald-950 shadow-xl">
          <h4 className="text-xs font-mono font-black text-emerald-850 uppercase tracking-widest border-b border-emerald-100 pb-2.5 flex items-center justify-between">
            <span>Order Summary</span>
            <span className="bg-emerald-100 text-emerald-850 border border-emerald-200 text-[9px] px-2 py-0.5 rounded-full font-mono">
              {cart.reduce((sum, item) => sum + item.quantity, 0)} Items
            </span>
          </h4>

          {/* Items Checklist */}
          <div className="space-y-3.5 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
            {cart.map((item, idx) => (
              <div key={idx} className="flex gap-3 text-xs border-b border-emerald-100/40 pb-3 last:border-0 last:pb-0">
                <div className="w-10 h-10 bg-white border border-emerald-100 rounded overflow-hidden flex items-center justify-center flex-shrink-0">
                  {item.product.uploadedImage ? (
                    <img src={item.product.uploadedImage} alt={item.product.name} className="w-full h-full object-contain filter drop-shadow" />
                  ) : (
                    <span className="text-[10px] font-mono text-emerald-600">Jersey</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold truncate text-emerald-950">{item.product.name}</p>
                  <p className="text-[10px] text-emerald-600 font-mono mt-0.5">Size: {item.selectedSize} | Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <span className="text-emerald-800 font-mono font-semibold">{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Totals Section */}
          <div className="space-y-2.5 text-xs text-emerald-800 border-t border-emerald-100/60 pt-4">
            <div className="flex justify-between items-center">
              <span>Items Total:</span>
              <span className="text-emerald-950 font-mono">{formatPrice(subtotal)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Delivery Fee ({deliveryRegion === 'inside' ? 'Inside Dhaka' : 'Outside Dhaka'}):</span>
              <span className="text-emerald-800 font-bold font-mono">৳{deliveryChargeBDT}</span>
            </div>

            <div className="border-t border-emerald-100 pt-4 flex justify-between items-baseline">
              <span className="text-emerald-900 font-extrabold uppercase text-[10px] tracking-wider">Total Amount to Pay:</span>
              <span className="text-emerald-800 font-black text-xl font-mono">{formatPrice(grandTotal)}</span>
            </div>
          </div>

          {/* Delivery Note */}
          <div className="bg-white border border-emerald-100 p-4 rounded-xl text-[10px] text-emerald-850 flex gap-2.5">
            <Info size={14} className="text-emerald-700 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Every package is chemically sanitized and sealed inside historical vacuum-sealed cases with certificates of origin. Sourced for real fans.
            </p>
          </div>
        </div>

      </div>

    </section>
  );
};
