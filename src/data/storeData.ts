import { Product, BlogPost, Review, SellerRequest } from '../types';

export const POPULAR_SEARCHES = [
  'Zidane 1998',
  'Beckham England 2004',
  'Messi Argentina Reissue',
  'Ronaldo Brazil 2002',
  'Mystery Box',
  'Vintage Nike',
  'Manchester United 1999',
];

export const STORE_LOCATIONS = [
  { city: 'London', address: 'Commercial Street, Shoreditch', phone: '+44 20 7123 4567', hours: 'Mon-Sat: 10am - 7pm | Sun: 11am - 5pm' },
  { city: 'Manchester', address: 'Newton Street, Northern Quarter', phone: '+44 161 987 6543', hours: 'Mon-Sat: 10am - 7pm | Sun: 11am - 5pm' },
  { city: 'New York', address: 'Lafayette Street, SoHo', phone: '+1 212 555 0199', hours: 'Mon-Sat: 11am - 8pm | Sun: 12pm - 6pm' },
  { city: 'Tokyo', address: 'Meiji-dori, Harajuku', phone: '+81 3 4567 8910', hours: 'Daily: 11am - 8pm' }
];

export const CUSTOMER_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    userName: 'Alexander G.',
    rating: 5,
    date: '2026-06-25',
    comment: 'Absolutely stunning! The condition of the 2004 England shirt was exactly as described (Excellent). Delivery was secure and beautifully packaged. True luxury experience.',
    verified: true,
  },
  {
    id: 'rev-2',
    userName: 'Marcus K.',
    rating: 5,
    date: '2026-07-01',
    comment: 'The Mystery Box exceeded all my expectations. Got a beautiful 1996 Fiorentina Nintendo kit! Smells fresh, tags verified. 10/10 will buy again.',
    verified: true,
  },
  {
    id: 'rev-3',
    userName: 'Sophie L.',
    rating: 5,
    date: '2026-07-05',
    comment: 'Ordered the 1998 France Zidane home kit with the official print. Masterpiece. It sits proudly in my collection. Customer service was incredibly fast and helpful.',
    verified: true,
  },
  {
    id: 'rev-4',
    userName: 'Raffaele M.',
    rating: 4,
    date: '2026-07-08',
    comment: 'Shipping took a couple of extra days to Italy, but the kit is an absolute dream. Gold details are impeccable.',
    verified: true,
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'The Golden Era of Shirt Design: Why 90s Jerseys Dominate Culture',
    slug: 'golden-era-90s-jerseys',
    excerpt: 'From oversized collar loops to bold watermarked prints, we trace why 1990s designs remain the undisputed pinnacle of football aesthetic.',
    date: 'July 5, 2026',
    author: 'Harry Vance',
    readTime: '6 min read',
    content: `
      Nineteen-ninety-four. It was a year of blistering heat in Pasadena, California, and a World Cup that redefined global soccer. But more than the football, it was the canvas of the jerseys that forever altered the culture. The bold, diagonal abstract graphics of Germany, the classic green sash of Nigeria, and the vibrant collar points of Colombia.

      Today, retro shirt collecting is no longer a niche hobby for die-hard stadium regulars. It is a full-fledged luxury culture, rubbing shoulders with high fashion in Milan, London, and Tokyo. But why do the nineties jerseys command such an emotional and financial premium?

      ### 1. The Death of Template Culture
      In modern manufacturing, brands often deploy unified templates across teams, changing only the crests and colorways. In contrast, the 90s represented a period of radical experimentation. Design bureaus created custom watermarks (like the Umbro logo woven directly into the fabric of the Ajax kit) and daring color clashes.

      ### 2. Oversized Silhouettes
      The relaxed, baggy fit of 90s shirts aligns perfectly with modern streetwear. They were designed to look brilliant both on a muddy pitch in December and paired with premium denim in a SoHo cafe.

      ### 3. Iconic Sponsors
      A sponsor can make or break a classic kit. Think of Fiorentina with Nintendo, Arsenal with JVC, or AC Milan with Opel. These corporate pairings became synonymous with the legendary players who wore them, forming an inseparable bond in our collective memory.
    `,
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'blog-2',
    title: 'How to Spot a Fake Retro Jersey: The Ultimate Collector Guide',
    slug: 'how-to-spot-fake-retro-jersey',
    excerpt: 'Avoid counterfeit disappointments with our professional collector check-list focusing on stitching, tags, and crest materials.',
    date: 'June 28, 2026',
    author: 'Charlotte Cole',
    readTime: '8 min read',
    content: `
      As the market for rare football shirts has surged, so too has the sophistication of bootleg manufacturers. For the modern jersey investor, protecting your collection starts with knowing exactly what to look for. 

      At Classic Football Jerseys, our in-house verification experts examine hundreds of shirts daily. Here is our essential checklist to keep your wardrobe authentic.

      ### 1. The Internal Wash Tags
      Genuine vintage jerseys always feature high-quality internal tags, often with batch numbers, barcodes, or specific licensing details. Counterfeits frequently use generic white tags with blurry fonts or incorrect country-of-origin details.

      ### 2. Crest Application
      Older jerseys used embroidered crests with high stitch densities or heavy, embossed felt patches. If you run your finger over the crest and feel loose threads, uneven borders, or thin, cheap plastic, it is highly likely a replica.

      ### 3. Neck Label Fonts
      Study the brand logo on the neck label. Counterfeiters often struggle to match the exact kerning, weight, and spacing of classic brand lettering (such as the classic vintage Nike grey label or Adidas blue-tag).
    `,
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=800',
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'shirt-1',
    name: '1998 France World Cup Home Shirt',
    slug: '1998-france-world-cup-home',
    price: 349,
    originalPrice: 420,
    image: 'france_home_1998',
    images: ['france_home_1998', 'france_home_1998_back', 'france_home_detail'],
    club: 'France',
    country: 'France',
    league: 'World Cup',
    brand: 'Adidas',
    season: '1998',
    year: 1998,
    condition: 'Excellent',
    conditionDetail: 'Stunning colors, perfect crest embroidery. Minor micro-bobble near bottom left, otherwise pristine.',
    player: { name: 'ZIDANE', number: 10 },
    color: 'Royal Blue',
    sizes: ['M', 'L', 'XL'],
    sku: 'FRA98H-ZID10',
    badgeAvailable: true,
    printAvailable: true,
    rating: 4.9,
    reviewsCount: 48,
    description: 'The legendary home shirt worn as France swept to World Cup glory on home soil in 1998. Featuring the iconic red and white horizontal chest stripes, a classic high-standing white collar, and Zidane’s legendary number 10 beautifully heat-pressed on the front and back.',
    specification: {
      material: '100% Polyester',
      madeIn: 'Tunisia',
      fit: 'Relaxed 90s Fit',
      sponsor: 'None (National Team)'
    },
    category: 'World Cup',
    stock: 3,
    isFeatured: true,
  },
  {
    id: 'shirt-2',
    name: '2004-06 England Home Shirt',
    slug: '2004-england-home-beckham',
    price: 189,
    image: 'england_home_2004',
    images: ['england_home_2004', 'england_home_2004_back', 'england_home_detail'],
    club: 'England',
    country: 'England',
    league: 'Euro 2004',
    brand: 'Umbro',
    season: '2004-06',
    year: 2004,
    condition: 'Mint',
    conditionDetail: 'Deadstock condition with original store tags. Pure white fabric, bright red sleeve stripe, zero signs of wear.',
    player: { name: 'BECKHAM', number: 7 },
    color: 'White',
    sizes: ['S', 'M', 'L', 'XL'],
    sku: 'ENG04H-BEC7',
    badgeAvailable: true,
    printAvailable: true,
    rating: 5.0,
    reviewsCount: 32,
    description: 'Classic Umbro home shirt as worn at Euro 2004 when David Beckham captained the Golden Generation. Features the iconic red stripe down the shoulder, centered England crest, and official felt nameset printing on the back.',
    specification: {
      material: '100% Polyester / ClimaCool',
      madeIn: 'United Kingdom',
      fit: 'Regular Athletic',
      sponsor: 'None'
    },
    category: 'England',
    stock: 5,
    isBestSeller: true,
    isFeatured: true,
  },
  {
    id: 'shirt-3',
    name: '1990 Argentina World Cup Home Shirt',
    slug: '1990-argentina-world-cup-home',
    price: 299,
    originalPrice: 350,
    image: 'argentina_home_1990',
    images: ['argentina_home_1990', 'argentina_home_1990_back'],
    club: 'Argentina',
    country: 'Argentina',
    league: 'World Cup',
    brand: 'Adidas',
    season: '1990',
    year: 1990,
    condition: 'Very Good',
    conditionDetail: 'Slight yellowing on interior neck band. Adidas logo and crest are beautifully detailed and intact.',
    player: { name: 'MARADONA', number: 10 },
    color: 'Sky Blue / White',
    sizes: ['L', 'XL'],
    sku: 'ARG90H-MAR10',
    badgeAvailable: false,
    printAvailable: true,
    rating: 4.8,
    reviewsCount: 22,
    description: 'The historic home shirt as worn in Italia 90 when Diego Maradona carried Argentina to the final. Features the timeless vertical sky blue and white stripes with a elegant V-neck collar design.',
    specification: {
      material: 'Polyester / Cotton Blend',
      madeIn: 'Argentina',
      fit: 'Classic Retro Fit',
      sponsor: 'None'
    },
    category: 'Legends',
    stock: 2,
    isFeatured: true,
  },
  {
    id: 'shirt-4',
    name: '2002 Brazil World Cup Away Shirt',
    slug: '2002-brazil-world-cup-away',
    price: 249,
    image: 'brazil_away_2002',
    images: ['brazil_away_2002', 'brazil_away_2002_back'],
    club: 'Brazil',
    country: 'Brazil',
    league: 'World Cup',
    brand: 'Nike',
    season: '2002',
    year: 2002,
    condition: 'Excellent',
    conditionDetail: 'Vibrant cobalt blue with bright yellow trim. Sublimated fabric detail looks outstanding.',
    player: { name: 'RONALDO', number: 9 },
    color: 'Cobalt Blue',
    sizes: ['M', 'L'],
    sku: 'BRA02A-RON9',
    badgeAvailable: true,
    printAvailable: true,
    rating: 4.9,
    reviewsCount: 15,
    description: 'Beautiful royal blue away shirt worn during the successful 2002 World Cup campaign in Japan and South Korea, where Ronaldo scored eight goals to lead the Seleção to their fifth star.',
    specification: {
      material: '100% Recycled Polyester',
      madeIn: 'Brazil',
      fit: 'Dri-Fit Custom',
      sponsor: 'None'
    },
    category: 'World Cup',
    stock: 4,
    isBestSeller: true,
  },
  {
    id: 'shirt-5',
    name: '1998-99 Manchester United Home Shirt',
    slug: '1998-man-united-home-treble',
    price: 389,
    originalPrice: 450,
    image: 'man_united_home_1998',
    images: ['man_united_home_1998', 'man_united_home_1998_back'],
    club: 'Manchester United',
    country: 'England',
    league: 'Premier League',
    brand: 'Umbro',
    season: '1998-99',
    year: 1998,
    condition: 'Excellent',
    conditionDetail: 'Incredibly well-preserved zipper collar. Sponsor printing shows minimal cracking. Bright red fabric.',
    player: { name: 'SOLSKJAER', number: 20 },
    color: 'Red',
    sizes: ['S', 'M', 'XL'],
    sku: 'MUN98H-SOL20',
    badgeAvailable: true,
    printAvailable: true,
    rating: 4.95,
    reviewsCount: 52,
    description: 'The iconic Umbro home shirt as worn during the unforgettable Treble-winning season of 1998-99. Features the sharp white/black Umbro sleeve tape, zippered collar, and the legendary Sharp sponsor print across the chest.',
    specification: {
      material: '100% Polyester Vapour',
      madeIn: 'England',
      fit: 'Retro Oversized',
      sponsor: 'SHARP'
    },
    category: 'Classic',
    stock: 1,
    isFeatured: true,
  },
  {
    id: 'shirt-6',
    name: '2026-27 Juventus FC Home Shirt',
    slug: '2026-juventus-home',
    price: 110,
    image: 'juventus_home_2026',
    images: ['juventus_home_2026', 'juventus_home_2026_back'],
    club: 'Juventus',
    country: 'Italy',
    league: 'Serie A',
    brand: 'Adidas',
    season: '2026-27',
    year: 2026,
    condition: 'Mint',
    conditionDetail: 'Brand new with tags direct from Turin. Pristine condition with high-tech AEROREADY heat seals.',
    player: { name: 'YILDIZ', number: 10 },
    color: 'Black / White',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    sku: 'JUV26H-YIL10',
    badgeAvailable: true,
    printAvailable: true,
    rating: 4.7,
    reviewsCount: 8,
    description: 'The futuristic next-season home shirt for the Bianconeri, featuring sleek textured vertical black and white stripes with a modern crew neck and high-end gold accent trims.',
    specification: {
      material: '100% Recycled Primegreen',
      madeIn: 'Cambodia',
      fit: 'Sleek Fit / AEROREADY',
      sponsor: 'Save The Children'
    },
    category: 'Current Season',
    stock: 15,
  },
  {
    id: 'shirt-7',
    name: 'Premium Mystery Shirt Box',
    slug: 'premium-mystery-shirt-box',
    price: 79,
    originalPrice: 120,
    image: 'mystery_box',
    images: ['mystery_box', 'mystery_box_detail'],
    brand: 'Mixed',
    season: 'Varies',
    year: 2026,
    condition: 'Mint',
    conditionDetail: 'Always brand new with tags (BNWT) or verified mint condition vintage. Authentic only.',
    color: 'Surprise',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    sku: 'MYS-BOX-PREM',
    badgeAvailable: false,
    printAvailable: false,
    rating: 4.9,
    reviewsCount: 112,
    description: 'The ultimate football jersey fan experience! Our experts curate a 100% genuine vintage or brand-new football jersey from any club or national team worldwide. Simply choose your size, and let us surprise you with a verified, authenticated masterpiece. Includes a high-end presentation box and verification certificate.',
    specification: {
      material: 'Polyester Blend',
      madeIn: 'Varies by Brand',
      fit: 'Standard Fit',
      sponsor: 'Varies'
    },
    category: 'Mystery',
    stock: 50,
    isBestSeller: true,
  },
  {
    id: 'shirt-8',
    name: '2005-06 Arsenal Highbury Home Shirt',
    slug: '2005-arsenal-highbury-home',
    price: 329,
    image: 'arsenal_highbury_2005',
    images: ['arsenal_highbury_2005', 'arsenal_highbury_2005_back'],
    club: 'Arsenal',
    country: 'England',
    league: 'Premier League',
    brand: 'Nike',
    season: '2005-06',
    year: 2005,
    condition: 'Excellent',
    conditionDetail: 'Beautiful deep redcurrant material. Gold sponsor print has perfect sheen. No cracks.',
    player: { name: 'HENRY', number: 14 },
    color: 'Redcurrant / Gold',
    sizes: ['M', 'L'],
    sku: 'ARS05H-HEN14',
    badgeAvailable: true,
    printAvailable: true,
    rating: 4.98,
    reviewsCount: 38,
    description: 'The historic "Redcurrant" home shirt worn during Arsenal’s final season at the iconic Highbury Stadium. Styled with brilliant gold embroidery and complete with the legendary Henry 14 printing on the reverse.',
    specification: {
      material: '100% Dri-Fit Nike Tech',
      madeIn: 'Morocco',
      fit: 'Regular Comfort',
      sponsor: 'O2'
    },
    category: 'Classic',
    stock: 2,
    isFeatured: true,
  }
];

export const SELLER_REQUESTS: SellerRequest[] = [
  {
    id: 'REQ-1024',
    shirtName: '1996 Barcelona Away Ronaldo Shirt',
    brand: 'Nike',
    season: '1996-97',
    condition: 'Excellent',
    expectedPrice: 280,
    images: ['barcelona_96_away.jpg'],
    status: 'Pending',
    date: 'July 05, 2026',
  },
  {
    id: 'REQ-1025',
    shirtName: '1990 Milan AC Home Baresi Kit',
    brand: 'Kappa',
    season: '1990-91',
    condition: 'Very Good',
    expectedPrice: 320,
    images: ['milan_90_home.jpg'],
    status: 'Approved',
    date: 'July 02, 2026',
  }
];

