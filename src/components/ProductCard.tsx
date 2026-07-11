import React from 'react';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { JerseyRenderer } from './JerseyRenderer';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  onQuickAdd?: (product: Product) => void;
  onUpdateImage?: (productId: string, base64: string) => void;
  formatPrice: (amount: number) => string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onToggleWishlist,
  isWishlisted,
  onQuickAdd,
  onUpdateImage,
  formatPrice,
}) => {
  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWishlist(product);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onQuickAdd) {
      onQuickAdd(product);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.target.files && e.target.files[0] && onUpdateImage) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onUpdateImage(product.id, reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className="group bg-white border border-emerald-100 hover:border-emerald-500 rounded-3xl p-5 cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_24px_rgba(4,36,22,0.06)] relative"
      id={`product-card-${product.id}`}
    >
      {/* Badges Overlay */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
        <span className="bg-emerald-50 text-emerald-800 font-mono text-[9px] font-black uppercase px-2.5 py-1 rounded-full border border-emerald-200">
          {product.season}
        </span>
        {product.originalPrice && (
          <span className="bg-red-50 text-red-700 font-mono text-[9px] font-black uppercase px-2.5 py-1 rounded-full border border-red-200">
            SALE
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleWishlist}
        className="absolute top-4 right-4 z-10 p-2.5 bg-white border border-emerald-100 rounded-full text-emerald-800 hover:text-red-500 hover:bg-white shadow-sm transition-all cursor-pointer"
        aria-label="Add to Wishlist"
      >
        <Heart
          size={15}
          className={isWishlisted ? 'fill-red-500 text-red-500 scale-110 transition-transform' : 'transition-transform'}
        />
      </button>

      {/* Jersey Render Window */}
      <div className="bg-emerald-50/40 rounded-2xl py-6 px-4 mb-4 flex items-center justify-center relative overflow-hidden group-hover:bg-emerald-50/60 transition-all duration-300 min-h-[180px]">
        {/* Subtle circular grid watermark */}
        <div className="absolute w-24 h-24 rounded-full bg-emerald-500/10 blur-2xl group-hover:scale-150 transition-transform duration-500" />
        
        {/* Actual SVG representation of shirt */}
        <div className="transform group-hover:scale-105 transition-transform duration-500 w-full h-full">
          <JerseyRenderer productId={product.id} uploadedImage={product.uploadedImage} />
        </div>
      </div>

      {/* Product Information */}
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-700 font-bold">
            {product.brand} • {product.category}
          </span>
          {/* Condition rating badge */}
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
            product.condition === 'Mint'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-amber-50 text-amber-800 border border-amber-200'
          }`}>
            {product.condition}
          </span>
        </div>

        <h3 className="text-emerald-950 text-sm font-black tracking-tight line-clamp-1 group-hover:text-emerald-600 transition-colors">
          {product.name}
        </h3>

        {/* Brand / Rating Bar */}
        <div className="flex items-center gap-1">
          <div className="flex text-amber-500">
            <Star size={11} className="fill-amber-500 text-amber-500" />
          </div>
          <span className="text-[11px] text-emerald-900 font-bold">{product.rating}</span>
          <span className="text-[10px] text-emerald-700/60 font-medium">({product.reviewsCount} reviews)</span>
        </div>

        {/* Bottom Price and Actions Bar */}
        <div className="flex flex-col gap-2.5 pt-3 border-t border-emerald-100">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-emerald-800 text-sm font-black">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-emerald-700/40 text-xs line-through font-mono">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-700/60 font-mono">In Stock</span>
          </div>

          <button
            onClick={handleQuickAdd}
            className="w-full bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white border border-emerald-200 hover:border-emerald-600 py-2.5 px-4 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer font-sans"
            title="Quick add to cart"
            id={`quick-add-${product.id}`}
          >
            <ShoppingCart size={13} />
            <span>ADD TO CART</span>
          </button>
        </div>
      </div>
    </div>
  );
};
