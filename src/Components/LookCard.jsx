import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tag, Heart, ProgressBar } from './atoms';
import { Body2 } from './atoms/Typography';

// Helper function to parse image URLs
const parseImageUrls = (imageData) => {
  if (!imageData) return ["https://via.placeholder.com/140x200"];
  
  if (Array.isArray(imageData)) return imageData;
  
  if (typeof imageData === 'string') {
    if (imageData.includes(',')) {
      return imageData.split(',').map(url => url.trim());
    }
    return [imageData];
  }
  
  return ["https://via.placeholder.com/140x200"];
};

export default function LookCard({ look, onClick, index = 0, category = null, isTodayLook = false, completionPercentage = null }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleHeartTap = (tapped) => {
    setIsFavorite(tapped);
    // TODO: Add API call to save/remove favorite
  };

  return (
    <motion.div
      className="flex-shrink-0 w-[180px] md:w-[220px] lg:w-[310px] flex flex-col justify-start items-start cursor-pointer"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 + (index * 0.05) }}
    >
      <div className="relative w-full overflow-hidden rounded-[2px]">
        <motion.img
          src={parseImageUrls(look.image_url)[0]}
          alt={look.name}
          className="w-full h-[240px] md:h-[280px] lg:h-[350px] object-cover"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
        {/* Heart - top right */}
        <div className="absolute top-3 right-3 bg-white/50 backdrop-blur-sm p-1.5 rounded-full flex items-center justify-center">
          <div className="w-[26px] h-[26px]">
            <Heart 
              isTapped={isFavorite} 
              onTap={handleHeartTap}
              tappedColor="#EF4444"
              untappedColor="white"
              size={26}
            />
          </div>
        </div>
        {/* Tag - bottom right (show RECOMMENDED if today's look, otherwise category, hide if progress bar is shown) */}
        {completionPercentage === null && (
          <div className="absolute bottom-3 right-3">
            <Tag category={isTodayLook ? "RECOMMENDED" : category} position="static" />
          </div>
        )}
        {/* Progress bar - bottom right (only for continue where you left off) */}
        {completionPercentage !== null && (
          <div className="absolute bottom-3 right-3 bg-white/50 backdrop-blur-sm p-1.5 rounded-full flex items-center justify-center">
            <ProgressBar percentage={completionPercentage} size={26} strokeWidth={3} />
          </div>
        )}
      </div>
      <Body2 className="text-left mt-3">
        {look.name}
      </Body2>
    </motion.div>
  );
}

