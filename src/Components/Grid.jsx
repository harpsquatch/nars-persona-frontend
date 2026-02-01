export function Grid({ children, className = "" }) {
  return (
    <div className={`
      w-full
      mx-[24px]
      md:mx-[32px]
      grid
      grid-cols-4
      md:grid-cols-6
      gap-[16px]
      md:gap-[24px]
      min-w-[320px]
      ${className}
    `}>
      {children}
    </div>
  );
} 