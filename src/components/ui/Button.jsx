import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-navy-900 text-white hover:bg-navy-800 shadow-sm',
  secondary: 'bg-white text-navy-800 border border-surface-300 hover:border-navy-300 hover:bg-surface-50',
  ghost: 'text-navy-700 hover:bg-surface-100',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm',
  outline: 'bg-transparent text-navy-900 border border-navy-900 hover:bg-navy-900 hover:text-white',
  onDark: 'bg-white/10 text-white border border-white/20 hover:bg-white/15',
};

const sizes = {
  sm: 'text-xs px-3 py-1.5 gap-1.5 rounded-lg',
  md: 'text-sm px-4 py-2.5 gap-2 rounded-xl',
  lg: 'text-base px-6 py-3.5 gap-2 rounded-xl',
};

const Button = forwardRef(function Button(
  { children, variant = 'primary', size = 'md', icon: Icon, iconRight: IconRight, loading, className = '', ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center font-semibold transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] whitespace-nowrap ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={16} />
      ) : Icon ? (
        <Icon size={16} strokeWidth={2.25} />
      ) : null}
      {children}
      {!loading && IconRight ? <IconRight size={16} strokeWidth={2.25} /> : null}
    </button>
  );
});

export default Button;
