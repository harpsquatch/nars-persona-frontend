import React from 'react';

// Typography components with mobile, tablet, and PC breakpoints
// Mobile: base styles (0px+)
// Tablet: md: prefix (768px+)
// PC: lg: prefix (1024px+)

export function Body1({ children, className = '', ...props }) {
  return (
    <div 
      className={`text-sm md:text-base lg:text-lg font-thin leading-5 md:leading-6 lg:leading-7 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function Body2({ children, className = '', ...props }) {
  return (
    <p 
      className={`text-base md:text-base lg:text-lg font-light leading-[21.6px] md:leading-[21.6px] lg:leading-[21.6px] tracking-[0px] ${className}`}
      {...props}
    >
      {children}
    </p>
  );
}

export function H1({ children, className = '', ...props }) {
  return (
    <h1 
      className={`text-3xl md:text-5xl lg:text-7xl font-thin leading-tight md:leading-[72px] lg:leading-[104.42px] tracking-[1.5px] md:tracking-[2.5px] lg:tracking-[3.16px] uppercase ${className}`}
      {...props}
    >
      {children}
    </h1>
  );
}

export function H2({ children, className = '', ...props }) {
  return (
    <h2 
      className={`text-2xl md:text-4xl lg:text-5xl font-thin leading-tight md:leading-tight lg:leading-tight ${className}`}
      {...props}
    >
      {children}
    </h2>
  );
}

export function H3({ children, className = '', ...props }) {
  return (
    <h3 
      className={`text-xl md:text-2xl lg:text-3xl font-thin leading-tight md:leading-tight lg:leading-tight ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
}

