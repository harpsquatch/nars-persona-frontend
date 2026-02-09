import React from 'react';
import { motion } from 'framer-motion';

export default function FeedbackButton({ 
  onClick, 
  hasFeedback = false,
  className = "",
  variants = null
}) {
  return (
    <motion.button 
      className={`mt-4 px-10 py-3 bg-[#000000] font-light text-white rounded-[2px] md:mt-0 w-full md:w-[270px] text-lg md:text-base shadow-md hover:shadow-lg transition-all duration-300 ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      variants={variants}
    >
      {hasFeedback ? "EDIT FEEDBACK" : "LEAVE FEEDBACK"}
    </motion.button>
  );
}

