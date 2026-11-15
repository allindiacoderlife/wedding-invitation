export const Input = ({ className = '', type = 'text', ...props }) => {
  return (
    <input
      type={type}
      className={`flex h-9 w-full rounded-lg border border-stone-200 bg-white px-3 py-1 text-xs shadow-2xs transition-colors placeholder:text-stone-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stone-900 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
};

export const Textarea = ({ className = '', rows = 3, ...props }) => {
  return (
    <textarea
      rows={rows}
      className={`flex w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs shadow-2xs transition-colors placeholder:text-stone-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stone-900 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
};

export const Select = ({ className = '', children, ...props }) => {
  return (
    <select
      className={`flex h-9 w-full rounded-lg border border-stone-200 bg-white px-3 py-1 text-xs shadow-2xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stone-900 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
};
