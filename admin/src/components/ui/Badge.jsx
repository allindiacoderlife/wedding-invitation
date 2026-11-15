export const Badge = ({ children, variant = 'default', className = '' }) => {
  const base = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition-colors uppercase tracking-wider';

  const variants = {
    default: 'bg-stone-900 text-white',
    secondary: 'bg-stone-100 text-stone-800 border border-stone-200',
    outline: 'text-stone-950 border border-stone-300',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    purple: 'bg-purple-50 text-purple-700 border border-purple-200',
    destructive: 'bg-red-50 text-red-700 border border-red-200',
  };

  return (
    <span className={`${base} ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
};
