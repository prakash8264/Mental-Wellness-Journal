import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'blue' | 'mint' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  children,
  className,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-heading font-bold rounded-2xl border-3 border-[var(--border)] shadow-[4px_4px_0px_0px_var(--border)] transition-all duration-150 focus:outline-none disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_var(--border)] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_0px_var(--border)]';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5 min-h-[36px]',
    md: 'text-sm px-5 py-2.5 gap-2 min-h-[44px]',
    lg: 'text-base px-6 py-3.5 gap-2.5 min-h-[52px]',
  };

  const variantStyles = {
    primary: 'bg-[var(--cta)] text-white hover:bg-[var(--cta-hover)]',
    secondary: 'bg-[var(--primary)] text-[var(--text)] hover:bg-[var(--accent-yellow)]',
    blue: 'bg-[var(--secondary)] text-[var(--text)]',
    mint: 'bg-[var(--accent-mint)] text-[var(--text)]',
    outline: 'bg-[var(--bg-card)] text-[var(--text)] hover:bg-[var(--secondary)]',
    ghost: 'border-transparent shadow-none bg-transparent hover:bg-[var(--secondary)] hover:shadow-none hover:translate-x-0 hover:translate-y-0',
  };

  return (
    <motion.button
      type="button"
      className={twMerge(
        clsx(
          baseStyles,
          sizeStyles[size],
          variantStyles[variant],
          className
        )
      )}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="text-lg">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="text-lg">{icon}</span>}
    </motion.button>
  );
};
