import React from 'react';
import { motion } from 'framer-motion';
import { Body2 } from './Typography';

export default function SubmitButton({ 
  onClick, 
  disabled = false,
  loading = false,
  isEditing = false,
  text = null,
  className = "",
  variants = null,
  initial = null,
  animate = null
}) {
  const buttonText = text || (loading ? 'SUBMITTING...' : isEditing ? 'Update' : 'SUBMIT');
  
  return (
    <motion.button 
      className={`w-full text-white bg-[#000000] font-light px-10 py-3 rounded-[2px] disabled:opacity-50 ${className}`}
      onClick={onClick}
      disabled={disabled}
      variants={variants}
      whileHover={variants?.hover ? "hover" : { scale: 1.03 }}
      whileTap={variants?.tap ? "tap" : { scale: 0.97 }}
      initial={initial}
      animate={animate}
    >
      <Body2 className="text-white">
        {buttonText}
      </Body2>
    </motion.button>
  );
}

