export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  club?: string;
  country?: string;
  league?: string;
  brand: string;
  season: string;
  year: number;
  condition: 'Mint' | 'Excellent' | 'Very Good' | 'Good' | 'Fair';
  conditionDetail: string;
  player?: {
    name: string;
    number: number;
  };
  color: string;
  sizes: string[];
  sku: string;
  badgeAvailable: boolean;
  printAvailable: boolean;
  rating: number;
  reviewsCount: number;
  description: string;
  specification: {
    material: string;
    madeIn: string;
    fit: string;
    sponsor?: string;
  };
  category: 'Classic' | 'Current Season' | 'World Cup' | 'England' | 'Clearance' | 'Legends' | 'Accessories' | 'Mystery';
  stock: number;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  uploadedImage?: string; // Base64 data URL uploaded manually
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'Customer' | 'Admin';
  password?: string;
  simulatedIp?: string;
  location?: string;
  phone?: string;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  customPrint?: {
    name: string;
    number: number;
  };
  addBadge?: boolean;
  quantity: number;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: string;
  readTime: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  trackingNumber?: string;
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  paymentMethod: string;
}

export interface SellerRequest {
  id: string;
  shirtName: string;
  brand: string;
  season: string;
  condition: string;
  expectedPrice: number;
  images: string[];
  status: 'Pending' | 'Approved' | 'Rejected';
  date: string;
}

export interface CarouselSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  primaryColor: string;
  productId: string;
  customImage?: string;
}

export interface AppConfig {
  logoText: string;
  logoSubtext: string;
  theme: 'classic' | 'crimson' | 'royal' | 'bengal';
  footerAbout: string;
  footerLocations: { city: string; address: string; phone: string }[];
  footerCopyright: string;
  currencySymbol: string;
  currencyCode: string;
  exchangeRate: number;
  timerTeam1?: string;
  timerTeam1Emoji?: string;
  timerTeam2?: string;
  timerTeam2Emoji?: string;
  timerLabel?: string;
  timerTargetHours?: number;
  timerEnabled?: boolean;
}
