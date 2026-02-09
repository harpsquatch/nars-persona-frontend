import React from 'react';
import { motion } from 'framer-motion';
import { Body1, Body2 } from './Typography';

export default function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'large',
  className = '',
  disabled = false,
  ...props 
}) {
  const baseStyles = "inline-flex justify-center items-center gap-2.5 transition-colors";
  
  const variants = {
    primary: "bg-white text-black hover:bg-gray-100",
    secondary: "bg-[#1E1E1E] text-white hover:bg-[#2E2E2E]",
    outline: "bg-transparent border border-[#1E1E1E] text-[#1E1E1E] hover:bg-[#1E1E1E] hover:text-white",
    ghost: "bg-transparent text-[#1E1E1E] hover:bg-gray-100"
  };
  
  const sizes = {
    small: "px-3 py-2 h-10",
    medium: "px-4 py-3 h-12",
    large: "px-4 pt-4 pb-3.5 h-14"
  };
  
  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "";
  
  const buttonClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${disabledStyles} ${className}`;
  
  // Choose Typography component based on size
  const TypographyComponent = size === 'small' ? Body2 : Body1;
  
  return (
    <motion.button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      {...props}
    >
      <div className="self-stretch pt-1 flex justify-center items-center gap-2.5">
        <TypographyComponent className="font-normal">
          {children}
        </TypographyComponent>
      </div>
    </motion.button>
  );
}

