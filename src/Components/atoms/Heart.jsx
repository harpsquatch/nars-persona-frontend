import React from 'react';
import { Heart as HeartIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Heart({ 
  isTapped = false, 
  onTap, 
  size = 26,
  className = '',
  tappedColor = '#EF4444',
  untappedColor = 'currentColor'
}) {
  const handleClick = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    if (onTap) {
      onTap(!isTapped);
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`inline-flex items-center justify-center cursor-pointer focus:outline-none w-full h-full ${className}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={isTapped ? 'Remove from favorites' : 'Add to favorites'}
    >
      <HeartIcon 
        size={size} 
        fill={isTapped ? tappedColor : 'none'}
        stroke={isTapped ? tappedColor : untappedColor}
        strokeWidth={2}
        className="transition-all duration-200 w-full h-full"
      />
    </motion.button>
  );
}

