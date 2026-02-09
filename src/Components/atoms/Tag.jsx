import React from 'react';

// Map category to display label
const categoryLabels = {
  'MORNING': 'Morning',
  'EVENING': 'Evening',
  'SPECIAL_OCCASION': 'Special Occasion'
};

export default function Tag({ category, className = '', position = 'top-left' }) {
  if (!category) return null;

  // Position classes
  const positionClasses = {
    'top-left': 'top-3 left-3',
    'top-right': 'top-3 right-3',
    'bottom-left': 'bottom-3 left-3',
    'bottom-right': 'bottom-3 right-3',
    'static': ''
  };

  const isStatic = position === 'static';
  const positionClass = isStatic ? '' : `absolute ${positionClasses[position] || positionClasses['top-left']}`;

  return (
    <div className={`${positionClass} bg-white/50 backdrop-blur-sm px-3 py-1.5 ${className}`}>
      <span className="text-xs md:text-sm font-light text-black uppercase tracking-wider">
        {categoryLabels[category] || category}
      </span>
    </div>
  );
}

