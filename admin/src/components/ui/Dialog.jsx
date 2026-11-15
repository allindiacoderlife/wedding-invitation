export const Dialog = ({ open, onClose, children, maxWidth = 'max-w-2xl' }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Content */}
      <div className={`relative w-full ${maxWidth} rounded-2xl bg-white border border-stone-200 shadow-2xl p-6 z-10 my-8 max-h-[90vh] overflow-y-auto space-y-5 animate-in fade-in-0 zoom-in-95`}>
        {children}
      </div>
    </div>
  );
};

export const DialogHeader = ({ children, className = '' }) => (
  <div className={`flex flex-col space-y-1.5 border-b border-stone-100 pb-4 ${className}`}>
    {children}
  </div>
);

export const DialogTitle = ({ children, className = '' }) => (
  <h2 className={`text-base font-semibold text-stone-900 ${className}`}>
    {children}
  </h2>
);

export const DialogDescription = ({ children, className = '' }) => (
  <p className={`text-xs text-stone-500 leading-relaxed ${className}`}>
    {children}
  </p>
);

export const DialogFooter = ({ children, className = '' }) => (
  <div className={`flex items-center justify-end gap-2 border-t border-stone-100 pt-4 ${className}`}>
    {children}
  </div>
);
