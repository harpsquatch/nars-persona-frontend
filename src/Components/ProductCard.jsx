import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart } from './atoms';
import { Body2 } from './atoms/Typography';
import { wishlistService } from '../services/api';

// Helper function to parse image URLs
const parseImageUrls = (imageData) => {
  if (!imageData) return ["https://via.placeholder.com/150"];
  
  if (Array.isArray(imageData)) return imageData;
  
  if (typeof imageData === 'string') {
    if (imageData.includes(',')) {
      return imageData.split(',').map(url => url.trim());
    }
    return [imageData];
  }
  
  return ["https://via.placeholder.com/150"];
};

export default function ProductCard({ 
  product, 
  isOwned = false,
  index = 0,
  isInWishlist: externalIsInWishlist = null,
  onWishlistChange = null
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  // Load wishlist status on mount
  useEffect(() => {
    const loadWishlistStatus = async () => {
      if (!product.id) return;
      
      try {
        const wishlistData = await wishlistService.getWishlist();
        if (wishlistData?.items) {
          const isInWishlist = wishlistData.items.some(item => item.product_id === product.id);
          setIsFavorite(isInWishlist);
        }
      } catch (error) {
        console.error("Error loading wishlist status:", error);
      }
    };
    
    loadWishlistStatus();
  }, [product.id]);

  // Sync with external state if provided
  useEffect(() => {
    if (externalIsInWishlist !== null) {
      setIsFavorite(externalIsInWishlist);
    }
  }, [externalIsInWishlist]);

  const handleHeartTap = async (tapped) => {
    if (!product.id) return;
    
    setIsFavorite(tapped);
    
    try {
      setLoadingWishlist(true);
      
      if (tapped) {
        // Add to wishlist
        await wishlistService.addToWishlist(product.id, 'general');
      } else {
        // Remove from wishlist
        await wishlistService.removeFromWishlist(product.id);
      }
      
      // Notify parent component if callback provided
      if (onWishlistChange) {
        onWishlistChange(product.id, tapped);
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      // Revert on error
      setIsFavorite(!tapped);
    } finally {
      setLoadingWishlist(false);
    }
  };

  const handleProductClick = () => {
    // Open product URL in new tab if available
    if (product.product_url) {
      window.open(product.product_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <motion.div
      className="flex-shrink-0 w-[180px] md:w-[220px] lg:w-[310px] flex flex-col justify-start items-start cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleProductClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 + (index * 0.05) }}
    >
      <div className="relative w-full h-[240px] md:h-[280px] lg:h-[350px] overflow-hidden rounded-[2px]">
        <motion.img
          src={parseImageUrls(product.image || product.image_url)[0]}
          alt={product.name}
          className="w-full h-full object-cover"
          style={{ filter: 'contrast(0.9)' }}
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="flex-1"></div>
          <div className="w-[26px] h-[26px]">
            <Heart 
              isTapped={isFavorite} 
              onTap={handleHeartTap}
              tappedColor="#EF4444"
              untappedColor="#FFFFFF"
              size={26}
            />
          </div>
        </div>
        
        {/* Shade Match Badge */}
        {product.has_match && (
          <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            ✓ Match
          </div>
        )}
      </div>
      
      {/* Product Name */}
      <Body2 className="text-left mt-3">
        {product.name}
      </Body2>
      
      {/* Ownership Status */}
      {isOwned && (
        <p className="text-xs text-[#4CAF50] font-semibold mt-1">
          ✓ In your collection
        </p>
      )}
      
      {/* Recommended Shades */}
      {product.recommended_shades && product.recommended_shades.length > 0 && (
        <div className="mt-2">
          <p className="text-sm font-semibold text-[#1E1E1E]">
            Recommended for you:
          </p>
          {product.recommended_shades.slice(0, 2).map((shade, idx) => (
            <div key={idx} className="mt-1">
              <p className="text-xs font-bold text-[#1E1E1E]">
                {shade.name}
              </p>
              <p className="text-xs text-[#8F8F8F] italic">
                {shade.reason}
              </p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

