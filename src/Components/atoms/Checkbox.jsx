import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Checkbox({ 
  isChecked = false, 
  onChange, 
  label = '',
  className = '',
  disabled = false
}) {
  const handleClick = () => {
    if (!disabled && onChange) {
      onChange(!isChecked);
    }
  };

  return (
    <motion.div
      onClick={handleClick}
      className={`flex items-start gap-3 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      whileHover={disabled ? {} : { x: 2 }}
      transition={{ duration: 0.2 }}
    >
      <div 
        className={`flex-shrink-0 w-5 h-5 rounded-sm border-2 flex items-center justify-center transition-all duration-200 ${
          isChecked 
            ? 'bg-black border-black' 
            : 'bg-white border-gray-300 hover:border-gray-400'
        }`}
      >
        {isChecked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Check size={14} color="white" strokeWidth={3} />
          </motion.div>
        )}
      </div>
      {label && (
        <span className={`text-sm md:text-base flex-1 ${isChecked ? 'line-through text-gray-500' : 'text-black'}`}>
          {label}
        </span>
      )}
    </motion.div>
  );
}

