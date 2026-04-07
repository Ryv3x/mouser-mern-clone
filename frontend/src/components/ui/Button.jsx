import React from 'react';    

const VARIANTS = {
  primary: 'bg-primary text-gray-900 hover:bg-primary-600',
  secondary: 'bg-white text-gray-800 border border-gray-200 hover:bg-gray-50',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  ghost: 'bg-transparent text-primary hover:opacity-80',
};

const Button = ({ children, variant = 'primary', className = '', type = 'button', ...rest }) => {
  const base = 'px-4 py-2 rounded-lg font-semibold transition inline-flex items-center justify-center gap-2';
  const cls = `${base} ${VARIANTS[variant] || VARIANTS.primary} ${className}`.trim();
  return (
    <button type={type} className={cls} {...rest}>
      {children}
    </button>
  );
};

export default Button;
