export const Button = ({
  children,
  variant = 'default',
  size = 'default',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) => {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 disabled:pointer-events-none disabled:opacity-50 select-none';

  const variants = {
    default: 'bg-stone-900 text-white hover:bg-stone-800 shadow-xs',
    primary: 'bg-rose-700 text-white hover:bg-rose-800 shadow-xs',
    secondary: 'bg-stone-100 text-stone-900 hover:bg-stone-200',
    outline: 'border border-stone-200 bg-white text-stone-900 hover:bg-stone-50',
    ghost: 'hover:bg-stone-100 text-stone-700 hover:text-stone-900',
    destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-xs',
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs',
    default: 'h-9 px-4 py-2 text-xs',
    lg: 'h-11 px-6 text-sm',
    icon: 'h-9 w-9 p-0',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variants[variant] || variants.default} ${sizes[size] || sizes.default} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
